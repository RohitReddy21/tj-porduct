import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Use Cases</div><span class=\"eyebrow\" style=\"color:#93c5fd\">Built for real enterprise work</span><h1>Solve complex processes across functions and industries.</h1><p class=\"lead\">Apply AFSv5 wherever work requires knowledge, coordination, judgment, approval and traceability.</p></div></section>\n<section class=\"section\"><div class=\"container\"><div class=\"grid-3\"><div class=\"card\"><div class=\"icon\">E</div><h3>Software Engineering</h3><p class=\"muted\">Requirements, architecture, development, QA and release.</p></div><div class=\"card\"><div class=\"icon\">B</div><h3>Banking & Financial Services</h3><p class=\"muted\">Compliance, risk, operations and evidence-backed decisions.</p></div><div class=\"card\"><div class=\"icon\">M</div><h3>Manufacturing</h3><p class=\"muted\">Quality, SOP, incident analysis and operational intelligence.</p></div><div class=\"card\"><div class=\"icon\">\u26a1</div><h3>Energy & Utilities</h3><p class=\"muted\">Usage analysis, maintenance, asset and regulatory workflows.</p></div><div class=\"card\"><div class=\"icon\">H</div><h3>Healthcare</h3><p class=\"muted\">Knowledge, operations, compliance and support workflows.</p></div><div class=\"card\"><div class=\"icon\">IT</div><h3>Enterprise Support</h3><p class=\"muted\">HR, finance, IT service and employee knowledge automation.</p></div></div></div></section>";

export default function UseCasesPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Use Cases | AFSv5";
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
