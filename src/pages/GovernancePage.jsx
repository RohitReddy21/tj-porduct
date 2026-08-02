import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Governance</div><span class=\"eyebrow\" style=\"color:#a99fff\">Enterprise AI you can trust</span><h1>Govern every action. Preserve every decision.</h1><p class=\"lead\">Apply policy, approval, evidence, access and audit controls across every workflow and agent run.</p></div></section>\n<section class=\"section\"><div class=\"container split\"><div class=\"side-list\"><div class=\"side-item\"><div class=\"icon\">P</div><div><h3>Policy engine</h3><p class=\"muted\">Define model, tool, data, execution and repair policies.</p></div></div><div class=\"side-item\"><div class=\"icon\">\u2713</div><div><h3>Approval gates</h3><p class=\"muted\">Route critical decisions to accountable owners.</p></div></div><div class=\"side-item\"><div class=\"icon\">A</div><div><h3>Audit and evidence</h3><p class=\"muted\">Capture sources, rationale, versions and outcomes.</p></div></div><div class=\"side-item\"><div class=\"icon\">R</div><div><h3>Role-based access</h3><p class=\"muted\">Control who can design, execute, approve and inspect.</p></div></div></div><div class=\"dashboard\"><h3>Execution timeline</h3><div class=\"side-list\"><div class=\"side-item\"><strong>01</strong><div><h3>Run started</h3><p class=\"muted\">Workflow initiated by Anand S.</p></div></div><div class=\"side-item\"><strong>02</strong><div><h3>Research completed</h3><p class=\"muted\">Approved enterprise sources captured.</p></div></div><div class=\"side-item\"><strong>03</strong><div><h3>Review completed</h3><p class=\"muted\">Quality agent validated evidence.</p></div></div><div class=\"side-item\"><strong>04</strong><div><h3>Human approval</h3><p class=\"muted\">Decision recorded with comments.</p></div></div><div class=\"side-item\"><strong>05</strong><div><h3>Outcome released</h3><p class=\"muted\">Final artifact archived with audit.</p></div></div></div></div></div></section>\n<section class=\"section alt\"><div class=\"container center\"><h2>Governance without slowing the business.</h2><p class=\"copy\">Risk controls can be configured by workflow, business unit, data type, action and deployment environment.</p><div class=\"grid-4\" style=\"margin-top:38px\"><div class=\"card\"><h3>Configurable rigor</h3></div><div class=\"card\"><h3>Evidence sufficiency</h3></div><div class=\"card\"><h3>Automatic repairs</h3></div><div class=\"card\"><h3>Complete traceability</h3></div></div></div></section>";

export default function GovernancePage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Governance | AFSv5";
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
    return () => { root?.removeEventListener('click', onClick); root?.removeEventListener('submit', onSubmit); };
  }, [navigate]);
  return <main data-page-root dangerouslySetInnerHTML={{ __html: content }} />;
}
