import { useContent } from '../../content';
import { Seo } from '../Seo';
import { breadcrumbLd } from '../seo';
import { Band, PageHero } from '../components/ui';
import { BookingSection } from '../contact/BookingSection';
import { ContactDetails } from '../contact/ContactDetails';
import { EnquirySection } from '../contact/EnquirySection';

/**
 * Two working flows against the real API: an enquiry, and (when the content enables it) a booked first conversation.
 * The enquiry is the reading column; the contact details sit beside it as a ruled aside. Booking is its own band.
 */
export function Contact() {
  const content = useContent();
  const { identity, contact } = content;
  const booking = contact.consultation.enabled && contact.consultation.slots.length > 0;

  return (
    <>
      <Seo
        title="Contact"
        description={
          booking
            ? `Send an enquiry to ${identity.name} in Dhaka, or book a first conversation.`
            : `Send an enquiry to ${identity.name} in Dhaka.`
        }
        path="/contact"
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <PageHero
        title="Contact"
        lead={booking ? 'Send us an enquiry, or book a first conversation.' : 'Send us an enquiry.'}
        trail={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        anchor="75% 30%"
      />
      <Band tone="paper" labelledBy="enquiry-title">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <EnquirySection />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <ContactDetails />
          </div>
        </div>
      </Band>
      <BookingSection />
    </>
  );
}
