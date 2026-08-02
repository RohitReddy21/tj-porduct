import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Runs & Oversight</div><span class=\"eyebrow\" style=\"color:#a99fff\">Complete visibility</span><h1>Monitor every run, decision and outcome.</h1><p class=\"lead\">Give operators, managers and auditors a real-time view of execution health, approvals and business performance.</p></div></section>\n<section class=\"section\"><div class=\"container\"><div class=\"dashboard\"><div class=\"dash-top\"><div><span class=\"eyebrow\">Last 30 days</span><h3 style=\"margin:5px 0\">Run performance</h3></div><a class=\"btn btn-primary\" href=\"/demo\">Start new work</a></div><div class=\"metric-grid\"><div class=\"metric\"><span class=\"muted\">Runs</span><strong>128</strong><small>+20%</small></div><div class=\"metric\"><span class=\"muted\">Success rate</span><strong>92%</strong><small>+6%</small></div><div class=\"metric\"><span class=\"muted\">Approval rate</span><strong>88%</strong><small>+7%</small></div><div class=\"metric\"><span class=\"muted\">Avg. cycle time</span><strong>4h 32m</strong><small>-12%</small></div><div class=\"metric\"><span class=\"muted\">Auto repairs</span><strong>1.6</strong><small>of max 2</small></div></div><div class=\"table-wrap\" style=\"margin-top:25px\"><table class=\"table\"><thead><tr><th>Run</th><th>Workflow</th><th>Status</th><th>Owner</th><th>Duration</th></tr></thead><tbody><tr><td>Boston energy analysis</td><td>Knowledge Q&A</td><td><span class=\"status approved\">Approved</span></td><td>Anand S.</td><td>4m 12s</td></tr><tr><td>Vendor onboarding risk</td><td>Research \u2192 Decision</td><td><span class=\"status waiting\">Awaiting decision</span></td><td>Kavya R.</td><td>14m 40s</td></tr><tr><td>Core banking feature</td><td>Definition \u2192 Release</td><td><span class=\"status approved\">Approved</span></td><td>Rohit M.</td><td>2h 45m</td></tr><tr><td>Compliance report</td><td>Dynamic Agent Graph</td><td><span class=\"status approved\">Approved</span></td><td>Leela P.</td><td>1h 06m</td></tr></tbody></table></div></div></div></section>";

export default function RunsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Runs & Oversight | AFSv5";
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
