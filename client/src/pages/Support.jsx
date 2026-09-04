import { useState } from 'react';
import { submitEnquiry } from '../api.js';
import { TextField, TextAreaField, SelectField } from '../components/Field.jsx';

const typeOptions = [
  { value: 'donation', label: 'Donation (money or supplies)' },
  { value: 'support', label: 'Volunteer support' },
  { value: 'partnership', label: 'Partnership / corporate support' },
  { value: 'other', label: 'Other' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  type: 'donation',
  amount: '',
  message: '',
};

export default function Support() {
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
      await submitEnquiry(form);
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
          <h1>Donate &amp; Support Us</h1>
          <p>
            Every rupee and every hour counts. Tell us how you’d like to help and we’ll
            take it from there.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {done ? (
            <div className="card success-box">
              <h2>❤️ Thank you for reaching out!</h2>
              <p>
                Your support enquiry has been received. Our team will contact you shortly to
                discuss the details.
              </p>
              <button className="btn btn-primary" onClick={() => setDone(false)}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="card form" onSubmit={handleSubmit}>
              <TextField
                label="Full name *"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="e.g. Rahul Verma"
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
              <SelectField
                label="How would you like to help?"
                options={typeOptions}
                value={form.type}
                onChange={update('type')}
              />
              {form.type === 'donation' && (
                <TextField
                  label="What are you able to donate?"
                  value={form.amount}
                  onChange={update('amount')}
                  placeholder="e.g. ₹2,000, 20 notebooks, school bags…"
                />
              )}
              <TextAreaField
                label="Message"
                value={form.message}
                onChange={update('message')}
                placeholder="Any details you’d like to share…"
              />
              {error && <p className="form-error">⚠️ {error}</p>}
              <button className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Support Enquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}