import type { ContactInfo } from '../types';

/**
 * Dhaka only. Both phone numbers and the social pages were confirmed by IP3 on 2 October 2026.
 */
export const contact: ContactInfo = {
  heading: 'Have a difficult policy or development challenge?',
  sub: 'Tell us the question you are trying to answer. We will reply to say whether and how we can help.',
  email: 'info@ip3-bd.org',
  phone: '+880 1974 011329, +880 1914 011329',
  address: ['Zenith Prime, House-39, Road-35/A', 'Gulshan-2', 'Dhaka 1212', 'Bangladesh'],
  hours: 'Sunday to Thursday, 09:00 to 18:00 (GMT+6)',
  mapQuery: 'IP3 Consulting Limited, Zenith Prime, House-39, Road-35/A, Gulshan-2, Dhaka 1212',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ip3-consulting-limited-institute-for-public-policy-practice' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61587162801268' },
  ],
  consultation: {
    enabled: true,
    heading: 'Book a 45-minute conversation',
    sub: 'A first call to understand your question. Choose a time; we confirm it by email with a link to join.',
    durationMinutes: 45,
    slots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:30 PM', '03:30 PM', '04:30 PM'],
    timezoneLabel: 'Dhaka time (GMT+6)',
    topics: [
      'Policy analysis and advisory',
      'Economic and financial feasibility',
      'Climate, ESG and circular economy',
      'Programme and survey design',
      'Monitoring, evaluation and learning',
      'Something else',
    ],
  },
};
