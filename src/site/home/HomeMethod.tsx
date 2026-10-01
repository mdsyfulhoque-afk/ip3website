import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { Flow } from '../figures/Flow';

/** The six movements of an engagement, as one line. The full method lives on /approach. */
export function HomeMethod() {
  const { method } = useContent();
  return (
    <section id="method" aria-labelledby="method-title" className="on-night band border-t border-midnight-rule">
      <div className="wrap">
        <div className="max-w-[44rem]">
          <h2 id="method-title" className="t-h2">
            {method.heading}
          </h2>
          {method.intro[0] ? <p className="t-lead mt-6 text-mist">{method.intro[0]}</p> : null}
        </div>
        <div className="mt-12 lg:mt-16">
          <Flow items={method.movements.map((m) => ({ id: m.slug, title: m.title, text: m.output }))} label="The six movements of an engagement" />
        </div>
        <p className="mt-10">
          <Link to="/approach" className="btn btn-line">
            Read our approach
          </Link>
        </p>
      </div>
    </section>
  );
}
