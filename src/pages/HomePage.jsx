import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroVideo from '../components/HeroVideo.jsx';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'AFSv5 | Enterprise AI Operating System';

    const root = document.querySelector('[data-page-root]');
    const onClick = (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        event.preventDefault();
        navigate(href);
        window.scrollTo(0, 0);
      }
    };
    const onSubmit = (event) => {
      const form = event.target.closest('[data-demo-form]');
      if (!form) return;
      event.preventDefault();
      const button = form.querySelector('button');
      if (button) { button.textContent = 'Request received'; button.disabled = true; }
    };
    root?.addEventListener('click', onClick);
    root?.addEventListener('submit', onSubmit);
    return () => {
      root?.removeEventListener('click', onClick);
      root?.removeEventListener('submit', onSubmit);
    };
  }, [navigate]);

  return (
    <main data-page-root className="homepage-3d-root">
      {/* ── Section 1: Hero with video background ── */}
      <section className="hero hero-3d">
        <HeroVideo />
        <div className="container hero-grid">
          <div>
            <span className="pill">Introducing AFSv5</span>
            <h1>Enterprise AI that plans, executes and governs.</h1>
            <p className="lead">
              Turn business intent into approved outcomes through reusable workflows,
              multi-agent execution, enterprise knowledge and human decision gates.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-magnetic" href="/demo">Book Enterprise Demo</a>
              <a className="btn btn-secondary btn-magnetic" href="#platform">Explore Platform</a>
            </div>
            <div className="trust-row">
              <span>◉ Policy-driven AI</span>
              <span>◎ Human in the loop</span>
              <span>◇ Audit ready</span>
              <span>▣ Secure by design</span>
            </div>
          </div>

          <div className="product-frame hero-3d-product-frame hero-image-frame">
            <img
              src="/assets/afsv5-cockpit.png"
              alt="AFSv5 enterprise AI cockpit dashboard"
            />
          </div>
        </div>
      </section>

      {/* ── Section 2: Designed for enterprise outcomes ── */}
      <section className="section">
        <div className="container center">
          <span className="eyebrow">Designed for enterprise outcomes</span>
          <h2>More than answers. A governed operating layer for AI work.</h2>
          <p className="copy">
            AFSv5 combines orchestration, specialist agents, enterprise data, human approvals and evidence-backed execution in one platform.
          </p>
          <div className="grid-3" style={{ marginTop: '42px' }}>
            <div className="card">
              <div className="icon">↻</div>
              <h3>Workflow Orchestration</h3>
              <p className="muted">Convert repeatable business processes into controlled AI workflows.</p>
            </div>
            <div className="card">
              <div className="icon">⌘</div>
              <h3>Multi-Agent Teams</h3>
              <p className="muted">Coordinate planners, researchers, reviewers, developers and auditors.</p>
            </div>
            <div className="card">
              <div className="icon">✓</div>
              <h3>Governance &amp; Audit</h3>
              <p className="muted">Apply policies, approvals, evidence and traceability at every step.</p>
            </div>
            <div className="card">
              <div className="icon">◫</div>
              <h3>Enterprise Knowledge</h3>
              <p className="muted">Ground outputs in documents, systems, databases and approved sources.</p>
            </div>
            <div className="card">
              <div className="icon">♙</div>
              <h3>Human Decisions</h3>
              <p className="muted">Route critical actions to the right people before execution continues.</p>
            </div>
            <div className="card">
              <div className="icon">⚡</div>
              <h3>Delivery to Outcome</h3>
              <p className="muted">Move from requirements and research to releases and operational action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How it works ── */}
      <section id="platform" className="section alt">
        <div className="container">
          <div className="center">
            <span className="eyebrow">How it works</span>
            <h2>From intent to impact in five governed steps.</h2>
          </div>
          <div className="process">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Select workflow</h3>
              <p className="muted">Start from an approved template or custom process.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Connect context</h3>
              <p className="muted">Provide documents, systems, rules and objectives.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Orchestrate agents</h3>
              <p className="muted">Specialist agents plan, research, build and review.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h3>Approve decisions</h3>
              <p className="muted">Human owners review high-impact actions.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h3>Deliver &amp; learn</h3>
              <p className="muted">Release outcomes with full audit and feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Workflow library ── */}
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Workflow library</span>
            <h2>Purpose-built workflows for real enterprise work.</h2>
            <p className="copy">
              Launch governed processes for solution definition, research, knowledge, release delivery and custom agent teams.
            </p>
            <a className="btn btn-primary" href="/workflows">Explore Workflows</a>
          </div>
          <div className="grid-2">
            <div className="card workflow">
              <span className="pill">Engineering</span>
              <h3>BRD → Approved Solution</h3>
              <p className="muted">Turn requirements into a reviewed PRD, architecture and implementation definition.</p>
              <div className="start">Start workflow →</div>
            </div>
            <div className="card workflow">
              <span className="pill">Decisioning</span>
              <h3>Research → Decision</h3>
              <p className="muted">Produce evidence-backed recommendations with traceability and review.</p>
              <div className="start">Start workflow →</div>
            </div>
            <div className="card workflow">
              <span className="pill">Knowledge</span>
              <h3>Knowledge Base Q&amp;A</h3>
              <p className="muted">Answer questions using governed enterprise sources and citations.</p>
              <div className="start">Start workflow →</div>
            </div>
            <div className="card workflow">
              <span className="pill">Delivery</span>
              <h3>Approved Definition → Release</h3>
              <p className="muted">Build, test, approve and release a scoped capability change.</p>
              <div className="start">Start workflow →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA band ── */}
      <section className="section alt">
        <div className="container">
          <div className="cta-band">
            <div>
              <span className="eyebrow" style={{ color: '#dbeafe' }}>Enterprise AI, operationalized</span>
              <h2 style={{ marginBottom: '8px' }}>Ready to see AFSv5 in action?</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                Book a tailored walkthrough around your highest-value workflow.
              </p>
            </div>
            <a className="btn btn-light" href="/demo">Book a Demo →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
