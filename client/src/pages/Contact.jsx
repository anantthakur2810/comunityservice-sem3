import { useState } from 'react';
import { submitEnquiry } from '../api.js';
import { TextField, TextAreaField } from '../components/Field.jsx';
import {
  IconInstagram,
  IconFacebook,
  IconX,
  IconYouTube,
  IconLinkedIn,
  IconMapPin,
  IconPhone,
  IconClock,
} from '../components/Icons.jsx';
import Reveal from '../components/Reveal.jsx';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/dpsngoindia', Icon: IconInstagram },
  { label: 'Facebook', href: 'https://www.facebook.com/dpsngo', Icon: IconFacebook },
  { label: 'X / Twitter', href: 'https://x.com/DpsNgo', Icon: IconX },
  { label: 'YouTube', href: 'https://youtube.com/@dpsngo', Icon: IconYouTube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dpsngo', Icon: IconLinkedIn },
];

const emptyForm = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitEnquiry({ ...form, type: 'other' });
      setDone(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you. Reach out any time — we’re always open.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Reveal>
            <div className="card contact-info">
              <h2>Get in touch</h2>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon">
                    <IconMapPin size={20} />
                  </span>
                  <div>
                    <strong>Address</strong>
                    <span>
                      Village Sadarpur, Sector 45, Near Indian Overseas Bank, Noida, India 201301
                    </span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">
                    <IconPhone size={20} />
                  </span>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:+919873965604">+91 98739 65604</a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">
                    <IconClock size={20} />
                  </span>
                  <div>
                    <strong>Hours</strong>
                    <span>Always open</span>
                  </div>
                </li>
              </ul>
              <h3>Follow us</h3>
              <div className="footer-socials">
                {socials.map(({ label, href, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" title={label}>
                    <span className="social-icon">
                      <Icon size={16} />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {done ? (
              <div className="card success-box">
                <h2>✅ Message sent!</h2>
                <p>Thank you for reaching out. We’ll get back to you as soon as possible.</p>
                <button className="btn btn-primary" onClick={() => setDone(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="card form" onSubmit={handleSubmit}>
                <h2>Send us a message</h2>
                <TextField
                  label="Full name *"
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                />
                <TextField
                  label="Email *"
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                />
                <TextField
                  label="Phone"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+91 …"
                />
                <TextAreaField
                  label="Message *"
                  required
                  value={form.message}
                  onChange={update('message')}
                  placeholder="How can we help?"
                />
                {error && <p className="form-error">⚠️ {error}</p>}
                <button className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}