import { Link } from 'react-router-dom';

const objectives = [
  'Provide clear and accessible information about DPS Shiksha Samiti, its work, objectives and current requirements.',
  'Offer an easy-to-use volunteer registration system for individuals interested in contributing their time and skills.',
  'Provide a structured form for donation and support enquiries based on the organisation\u2019s current needs.',
  'Improve communication between the NGO and potential volunteers, donors and community supporters.',
  'Reduce dependency on manual collection and management of volunteer and support enquiries.',
];

export default function About() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Who we are, what we believe, and what we’re working towards.</p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Our Mission</h2>
          <p className="lead">
            DPS Shiksha Samiti is a community-based NGO in Sadarpur, Sector 45, Noida, working for
            the education of underprivileged children — because a literate child is the foundation
            of a stronger community and a stronger nation.
          </p>
          <p>
            Beyond education, we work on health awareness and women empowerment in our community.
            Our evening classes give children a safe place to learn, our health camps bring basic
            care closer to families, and our empowerment programmes give women skills and
            confidence.
          </p>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container narrow">
          <h2 className="section-title">Our Objectives</h2>
          <ol className="objectives">
            {objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Why This Platform?</h2>
          <p>
            We built this community engagement platform so that anyone who wants to help can find
            complete, up-to-date information about our work — volunteering opportunities, current
            requirements, and simple ways to get in touch. No more phone tag, no more missed
            connections. Just a clear bridge between the community’s generosity and the
            children who need it.
          </p>
          <div className="hero-actions">
            <Link to="/volunteer" className="btn btn-primary">Volunteer</Link>
            <Link to="/support" className="btn btn-outline">Donate / Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}