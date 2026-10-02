import Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Content from '../models/Content.js';
import { isDBConnected } from '../lib/db.js';
import { getInMemoryContent } from '../lib/inMemoryStore.js';
import { buildKnowledge, siteContentFrom } from '../lib/knowledge.js';
import { asyncHandler, httpError } from '../lib/helpers.js';

/**
 * Ask IP3: a visitor's question answered from the site's own content.
 *
 * Off unless ANTHROPIC_API_KEY is set; GET /status tells the widget whether to show itself.
 * Questions and answers are not stored. Each visitor gets ASK_PER_15_MIN questions per 15 minutes and the
 * instance stops answering after ASK_DAILY_LIMIT questions in a day (both counted per server instance).
 */
const router = Router();

const MODEL = process.env.ASK_MODEL || 'claude-opus-5-5';
const DAILY_LIMIT = Number(process.env.ASK_DAILY_LIMIT || 500);
const MAX_TURNS = 8;
const MAX_CHARS = 800;

const enabled = () => Boolean(process.env.ANTHROPIC_API_KEY);
let client = null;
const anthropic = () => (client ??= new Anthropic());

const askLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.ASK_PER_15_MIN || 15),
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'You have asked a lot of questions in a short time. Please try again in a few minutes.', code: 'RATE_LIMITED' },
});

let day = '';
let usedToday = 0;
function takeDailyQuota() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    usedToday = 0;
  }
  if (usedToday >= DAILY_LIMIT) return false;
  usedToday += 1;
  return true;
}

// The knowledge text changes only when content is published, so it is rebuilt at most every five minutes.
// Keeping it byte-identical between rebuilds is what lets the prompt cache hit.
let knowledge = { text: '', at: 0 };
async function currentKnowledge() {
  if (knowledge.text && Date.now() - knowledge.at < 5 * 60 * 1000) return knowledge.text;
  let published = null;
  try {
    if (isDBConnected()) published = (await Content.findOne({ key: 'site' }).lean())?.data ?? null;
    else published = getInMemoryContent()?.data ?? null;
  } catch {
    published = null; // the bundled content is always a safe answer source
  }
  knowledge = { text: buildKnowledge(siteContentFrom(published)), at: Date.now() };
  return knowledge.text;
}

const INSTRUCTIONS = `You are "Ask IP3", the assistant on the website of IP3 Consulting Limited (Institute for Public Policy and Practice), a policy analysis, action research and management consulting firm in Dhaka, Bangladesh.

Answer visitors' questions about IP3 using only the website content provided below. The visitors are mostly people from government, development partners, universities and businesses deciding whether IP3 can help them.

- If the content does not answer the question, say you do not have that information and suggest writing to the team through the contact page. Never invent clients, projects, figures, prices, people or credentials.
- Keep answers short: two to five sentences, or a short list when that is clearer. Plain, professional language.
- Point to the most useful page with a markdown link to its path, for example [Green transition of the garment sector](/work/green-industrial-transition-rmg) or [book a consultation](/contact). Use only paths that appear in the content.
- If the visitor describes a problem they want help with, say which service or past assignment is closest and invite them to book a consultation at [/contact](/contact).
- Reply in the language the visitor writes in. If they write in Bangla, answer in Bangla.
- You cannot see the visitor's personal data, book meetings or send emails. Do not ask for personal details.
- Decline questions unrelated to IP3 and its work politely, in one sentence.`;

/** Accepts only a short, well-formed conversation: alternating turns, user first and last, plain text. */
function cleanMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) throw httpError(400, 'Please type a question.', 'INVALID_QUESTION');
  const turns = raw.slice(-MAX_TURNS).map((m) => ({
    role: m?.role === 'assistant' ? 'assistant' : 'user',
    content: String(m?.content ?? '').trim().slice(0, MAX_CHARS * 2),
  }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  const last = turns[turns.length - 1];
  if (!last || last.role !== 'user' || !last.content) throw httpError(400, 'Please type a question.', 'INVALID_QUESTION');
  if (last.content.length > MAX_CHARS) throw httpError(400, `Please keep your question under ${MAX_CHARS} characters.`, 'TOO_LONG');
  for (let i = 1; i < turns.length; i += 1) {
    if (turns[i].role === turns[i - 1].role || !turns[i].content) throw httpError(400, 'The conversation could not be read. Please start again.', 'INVALID_CONVERSATION');
  }
  return turns;
}

router.get('/status', (_req, res) => {
  res.json({ enabled: enabled() });
});

router.post(
  '/',
  askLimiter,
  asyncHandler(async (req, res) => {
    if (!enabled()) throw httpError(503, 'The assistant is not switched on.', 'ASK_DISABLED');
    const messages = cleanMessages(req.body?.messages);
    if (!takeDailyQuota()) {
      throw httpError(429, 'The assistant has answered as many questions as it can today. Please write to us through the contact page.', 'DAILY_LIMIT');
    }

    let response;
    try {
      response = await anthropic().beta.messages.create({
        model: MODEL,
        max_tokens: 2000,
        // Quick factual answers from given content: low effort keeps replies fast and cheap.
        output_config: { effort: 'low' },
        // If the model declines a question, the API retries it on a suitable fallback model in the same call.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: [
          { type: 'text', text: INSTRUCTIONS },
          // Instructions and site content form a stable prefix; caching it makes follow-up questions cheap.
          { type: 'text', text: `<website_content>\n${await currentKnowledge()}\n</website_content>`, cache_control: { type: 'ephemeral' } },
        ],
        messages,
      });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) throw httpError(503, 'The assistant is busy. Please try again in a minute.', 'BUSY');
      if (err instanceof Anthropic.APIError) {
        console.error('[ask] API error', err.status, err.message);
        throw httpError(502, 'The assistant could not answer just now. Please try again, or write to us through the contact page.', 'UPSTREAM');
      }
      throw err;
    }

    if (response.stop_reason === 'refusal') {
      return res.json({ ok: true, answer: 'I can only help with questions about IP3 and its work. For anything else, please write to the team through the [contact page](/contact).' });
    }
    const answer = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    res.json({ ok: true, answer: answer || 'Sorry, I could not find an answer to that. Please write to the team through the [contact page](/contact).' });
  }),
);

export default router;
