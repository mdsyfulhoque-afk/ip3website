import type { SiteContent } from '../types';
import { about } from './about';
import { capabilities } from './capabilities';
import { contact } from './contact';
import { domains } from './domains';
import { home } from './home';
import { identity } from './identity';
import { legal } from './legal';
import { method } from './method';
import { people } from './people';
import { pillars } from './pillars';
import { portfolio } from './portfolio';
import { sectors } from './sectors';
import { services } from './services';

/** Everything the public site shows before (or without) the database. */
export const DEFAULT_CONTENT: SiteContent = {
  schema: 2,
  identity,
  contact,
  home,
  domains,
  sectors,
  capabilities,
  method,
  services,
  portfolio,
  people,
  pillars,
  about,
  legal,
};
