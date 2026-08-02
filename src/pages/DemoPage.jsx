import React, { useEffect, useMemo, useState } from 'react';

const industries = [
  'Healthcare',
  'Financial Services',
  'Energy',
  'Manufacturing',
  'Technology',
];

const companySizes = ['1-100', '101-1,000', '1,001-10,000', '10,000+'];

const initialForm = {
  fullName: '',
  workEmail: '',
  company: '',
  jobTitle: '',
  industry: '',
  companySize: '',
  preferredDate: '',
  preferredTime: '',
  problem: '',
};

export default function DemoPage() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);

  const microsoftBookingsUrl = useMemo(
    () => import.meta.env.VITE_MICROSOFT_BOOKINGS_URL?.trim() || '',
    [],
  );
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    document.title = 'Book a Demo | AFSv5';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!microsoftBookingsUrl) {
      setStatus({
        type: 'error',
        message:
          'Microsoft scheduling is not configured yet. Add VITE_MICROSOFT_BOOKINGS_URL to connect this form to your Microsoft booking page.',
      });
      return;
    }

    sessionStorage.setItem('afsv5DemoLead', JSON.stringify(formData));
    setShowBookingCalendar(true);
    setStatus({
      type: 'success',
      message:
        'Thanks. Your details are saved for this session. Now choose your meeting date and time in the Microsoft booking calendar below.',
    });
    window.requestAnimationFrame(() => {
      document.getElementById('booking-calendar')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <main>
      <section className="hero-inner">
        <div className="container">
          <div className="breadcrumb">AFSv5 / Book a Demo</div>
          <span className="eyebrow" style={{ color: '#a99fff' }}>
            See AFSv5 in action
          </span>
          <h1>Bring your highest-value workflow. We will map the operating model.</h1>
          <p className="lead">
            Request a tailored platform walkthrough, workflow assessment and enterprise
            deployment discussion.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">What to expect</span>
            <h2>A focused enterprise discovery session.</h2>
            <div className="side-list">
              <div className="side-item">
                <strong>✓</strong>
                <div>
                  <h3>Workflow walkthrough</h3>
                  <p className="muted">See AFSv5 applied to a realistic enterprise process.</p>
                </div>
              </div>
              <div className="side-item">
                <strong>✓</strong>
                <div>
                  <h3>Use-case scoping</h3>
                  <p className="muted">Identify inputs, agents, approvals and outcomes.</p>
                </div>
              </div>
              <div className="side-item">
                <strong>✓</strong>
                <div>
                  <h3>Governance review</h3>
                  <p className="muted">
                    Discuss security, deployment and control requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard">
            <h2 style={{ fontSize: 32 }}>Request your demo</h2>
            <p className="copy demo-copy">
              Share your details, tell us your preferred date, and then choose the final
              meeting slot in the Microsoft booking calendar.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  className="input"
                  name="fullName"
                  required
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <input
                  className="input"
                  name="workEmail"
                  required
                  type="email"
                  placeholder="Work email"
                  value={formData.workEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid">
                <input
                  className="input"
                  name="company"
                  required
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <input
                  className="input"
                  name="jobTitle"
                  placeholder="Job title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label" htmlFor="preferredDate">
                    Preferred date
                  </label>
                  <input
                    id="preferredDate"
                    className="input"
                    name="preferredDate"
                    type="date"
                    min={minDate}
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="preferredTime">
                    Preferred time
                  </label>
                  <select
                    id="preferredTime"
                    className="input"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                  >
                    <option value="">Select time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <select
                  className="input"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Company size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                className="input"
                name="problem"
                rows="5"
                placeholder="Tell us about the workflow or business problem"
                value={formData.problem}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  Save Details and Show Calendar
                </button>
                {microsoftBookingsUrl ? (
                  <a
                    className="btn btn-light"
                    href={microsoftBookingsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Microsoft Booking Page
                  </a>
                ) : null}
              </div>

              <p className={`notice${status.type ? ` notice-${status.type}` : ''}`}>
                {status.message ||
                  'Best practice: connect this page to Microsoft Bookings using VITE_MICROSOFT_BOOKINGS_URL so visitors can submit details here and then pick a real slot in Microsoft.'}
              </p>
            </form>
          </div>
        </div>
      </section>

      {microsoftBookingsUrl ? (
        <section className="section alt" id="booking-calendar">
          <div className="container">
            <div className="center" style={{ marginBottom: 28 }}>
              <span className="eyebrow">Step 2</span>
              <h2>Choose your booking date and time</h2>
              <p className="copy">
                Use the Microsoft Bookings calendar below to confirm the final appointment.
                If the calendar does not load in your browser, use the direct booking link.
              </p>
            </div>

            <div className="booking-shell">
              <iframe
                className="booking-frame"
                src={microsoftBookingsUrl}
                title="Microsoft Bookings calendar"
                loading="lazy"
              />
            </div>

            <div className="form-actions" style={{ justifyContent: 'center', marginTop: 20 }}>
              <a
                className="btn btn-primary"
                href={microsoftBookingsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Booking Calendar in New Tab
              </a>
            </div>

            {!showBookingCalendar ? (
              <p className="notice center" style={{ marginTop: 16 }}>
                Fill the form above first so your team has the booking context before the
                meeting is scheduled.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
