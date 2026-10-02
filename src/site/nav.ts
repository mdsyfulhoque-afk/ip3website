export interface NavItem {
  label: string;
  to: string;
}

/** Primary navigation. The structure of the site is code; the words on each page are content. */
export const NAV: NavItem[] = [
  { label: 'Our work', to: '/work' },
  { label: 'Focus areas', to: '/focus' },
  { label: 'Sectors', to: '/sectors' },
  { label: 'Services', to: '/services' },
  { label: 'Approach', to: '/approach' },
  { label: 'People', to: '/people' },
  { label: 'About', to: '/about' },
];

export const CTA: NavItem = { label: 'Discuss a challenge', to: '/contact' };
