import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSending(true);
    setSubmitted(false);

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 700);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Study<span>Nep</span></h1>
        <p>Need help? Reach out to our support team for study guidance, technical assistance, or partnership inquiries.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h2>Get in Touch</h2>
          <p>We’re here to help you learn smarter. Send us your feedback, questions, or suggestions and we’ll respond as soon as possible.</p>
          <div className="contact-info">
            <p><strong>Email</strong><br />info@studynep.com</p>
            <p><strong>Phone</strong><br />+977 98XXXXXXX</p>
            <p><strong>Location</strong><br />Chitwan, Nepal</p>
          </div>
        </div>

        <div className="contact-card contact-form-card">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="form-success">
                <h3>Email Sent!</h3>
                <p>Your message has been received. Our StudyNep support team will reply shortly.</p>
              </div>
            )}

            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="6"
              placeholder="How can we help you?"
              value={formData.message}
              onChange={handleChange}
            />

            <button type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
