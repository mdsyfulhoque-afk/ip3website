import type { ContactInfo } from '../types';

/**
 * Dhaka only. The old site mixed this with a US farm address, a US phone number and two
 * conflicting Bangladeshi numbers. The phone is left empty until the owner confirms one; the
 * page hides it while it is empty.
 */
export const contact: ContactInfo = {
  heading: 'Have a difficult policy or development challenge?',
  sub: 'Tell us the question you are trying to answer. We will reply to say whether and how we can help.',
  email: 'info@ip3-bd.org',
  phone: '',
  address: ['Zenith Prime, House-39, Road-35/A', 'Gulshan-2', 'Dhaka 1212', 'Bangladesh'],
  hours: 'Sunday to Thursday, 09:00 to 18:00 (GMT+6)',
  mapQuery: 'IP3 Consulting Limited, Zenith Prime, House-39, Road-35/A, Gulshan-2, Dhaka 1212',
  social: [],
  consultation: {
    enabled: true,
    heading: 'Book a 45-minute conversation',
    sub: 'A first call to understand your question.',
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
