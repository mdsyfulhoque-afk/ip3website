import type { LegalContent } from '../types';

/**
 * A plain description of what this website actually does with what visitors send it.
 * IP3 should confirm the retention and contact wording before launch.
 */
export const legal: LegalContent = {
  privacy: {
    updated: '1 October 2026',
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
        text: ['We use what you send only to reply to you, to arrange the conversation you asked for, and to keep a record of the enquiry.'],
      },
      {
        title: 'Where it is kept',
        text: [
          'Enquiries and bookings are stored in a database that IP3 controls and are visible only to IP3 staff who handle enquiries.',
          'If you would like your enquiry corrected or deleted, write to the email address on the contact page and we will do it.',
        ],
      },
    ],
  },
};
