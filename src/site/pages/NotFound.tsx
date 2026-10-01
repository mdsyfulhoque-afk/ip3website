import { Link } from 'react-router-dom';
import { Seo } from '../Seo';
import { PageHero } from '../components/ui';

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist." path="/404" noindex />
      <PageHero title="This page does not exist." lead="The address may have changed, or the page may have been removed. These pages will get you back on track.">
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn btn-solid">
            Go to the home page
          </Link>
          <Link to="/services" className="btn btn-line">
            See our services
          </Link>
          <Link to="/contact" className="btn btn-line">
            Contact us
          </Link>
        </div>
      </PageHero>
    </>
  );
}
