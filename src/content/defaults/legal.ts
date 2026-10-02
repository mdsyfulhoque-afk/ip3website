import type { LegalContent } from '../types';

/**
 * A plain description of what this website actually does with what visitors send it.
 * Retention (60 days) and access (site administrators only) confirmed by IP3 on 2 October 2026;
 * both are enforced in code (server/lib/retention.js and the admin-only API routes).
 */
export const legal: LegalContent = {
  privacy: {
    updated: '2 October 2026',
    sections: [
      {
        title: 'What we collect',
        text: [
          'When you send an enquiry we collect your name, email address, organisation, the topic you choose and the message you write.',
          'When you book a conversation we also collect the date and time you choose.',
          'To help us spot spam, the server also records the network address and browser details that arrive with an enquiry.',
          'We do not ask for anything else, and the site does not require you to create an account.',
          'If you switch the 3D scene on or off, your choice is remembered in your own browser. It is not sent to us.',
        ],
      },
      {
        title: 'What we do not do',
        text: [
          'This website does not use advertising or tracking cookies, and it does not run third-party analytics.',
          'We do not sell or share your details for marketing.',
        ],
      },
      {
        title: 'How we use it',
        text: [
          'We use what you send only to reply to you, to arrange the conversation you asked for, and to keep a record of the enquiry.',
          'When we confirm a conversation, we send you a link to an online meeting room on Jitsi Meet, a free video service that needs no account. The room name is unique to your booking.',
        ],
      },
      {
        title: 'Who can see it, and for how long',
        text: [
          'Enquiries and bookings are stored in a database that IP3 controls. Only IP3\'s site administrators can see them, after signing in to a password-protected console.',
          'We keep an enquiry for 60 days and then delete it automatically. A booking is deleted 60 days after the date of the conversation.',
          'If you would like your enquiry corrected or deleted sooner, write to the email address on the contact page and we will do it.',
        ],
      },
    ],
  },
};
