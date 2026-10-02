import { Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { Approach } from './pages/Approach';
import { Bangla } from './pages/Bangla';
import { Contact } from './pages/Contact';
import { Focus } from './pages/Focus';
import { FocusDetail } from './pages/FocusDetail';
import { Home } from './pages/Home';
import { Insights } from './pages/Insights';
import { NotFound } from './pages/NotFound';
import { People } from './pages/People';
import { Person } from './pages/Person';
import { Privacy } from './pages/Privacy';
import { SectorDetail } from './pages/SectorDetail';
import { Sectors } from './pages/Sectors';
import { ServiceDetail } from './pages/ServiceDetail';
import { Services } from './pages/Services';
import { Work } from './pages/Work';
import { WorkDetail } from './pages/WorkDetail';
import type { SiteContent } from '../content/types';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bn" element={<Bangla />} />
      <Route path="/about" element={<About />} />
      <Route path="/approach" element={<Approach />} />
      <Route path="/focus" element={<Focus />} />
      <Route path="/focus/:slug" element={<FocusDetail />} />
      <Route path="/sectors" element={<Sectors />} />
      <Route path="/sectors/:slug" element={<SectorDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/work" element={<Work />} />
      <Route path="/work/:id" element={<WorkDetail />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/people" element={<People />} />
      <Route path="/people/:slug" element={<Person />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/** Every URL the prerenderer writes to disk, derived from the content so new slugs are covered. */
export function prerenderPaths(content: SiteContent): string[] {
  return [
    '/',
    '/bn',
    '/about',
    '/approach',
    '/focus',
    ...content.domains.map((d) => `/focus/${d.slug}`),
    '/sectors',
    ...content.sectors.map((s) => `/sectors/${s.slug}`),
    '/services',
    ...content.services.map((s) => `/services/${s.slug}`),
    '/work',
    ...content.portfolio.filter((e) => e.status === 'published').map((e) => `/work/${e.id}`),
    '/insights',
    '/people',
    ...content.people.filter((p) => p.status === 'published').map((p) => `/people/${p.slug}`),
    '/contact',
    '/privacy',
  ];
}
