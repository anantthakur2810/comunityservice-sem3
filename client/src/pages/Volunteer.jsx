import { useState } from 'react';
import { submitVolunteer } from '../api.js';
import { TextField, TextAreaField, SelectField } from '../components/Field.jsx';

const availabilityOptions = [
  { value: '', label: 'Select availability…' },
  { value: 'Weekends', label: 'Weekends' },
  { value: 'Weekdays', label: 'Weekdays' },
  { value: 'Evenings', label: 'Evenings' },
  { value: 'Flexible', label: 'Flexible' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  availability: '',
  message: '',
};

export default function Volunteer() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitVolunteer(form);
      setSubmittedName(form.name);
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
          <h1>Become a Volunteer</h1>
          <p>
            Your time and skills can change a child’s life. Fill in the form below and our
            team will get back to you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {done ? (
            <div className="card success-box">
              <h2>🎉 Thank you, {submittedName || 'volunteer'}!</h2>
              <p>
                Your volunteer registration has been received. Our team will contact you shortly
                to discuss how you can help.
              </p>
              <button className="btn btn-primary" onClick={() => setDone(false)}>
                Register another volunteer
              </button>
            </div>
          ) : (
            <form className="card form" onSubmit={handleSubmit}>
              <TextField
                label="Full name *"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="e.g. Ananya Sharma"
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
              <TextField
                label="Skills / interests"
                value={form.skills}
                onChange={update('skills')}
                placeholder="e.g. teaching, fundraising, design, healthcare…"
              />
              <SelectField
                label="Availability"
                options={availabilityOptions}
                value={form.availability}
                onChange={update('availability')}
              />
              <TextAreaField
                label="Why do you want to volunteer?"
                value={form.message}
                onChange={update('message')}
                placeholder="Tell us a little about yourself…"
              />
              {error && <p className="form-error">⚠️ {error}</p>}
              <button className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Volunteer Registration'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}