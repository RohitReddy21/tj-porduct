import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Platform</div><span class=\"eyebrow\" style=\"color:#a99fff\">One governed operating layer</span><h1>One platform. Unlimited enterprise workflows.</h1><p class=\"lead\">Connect people, AI agents, knowledge and systems to deliver measurable outcomes under enterprise control.</p></div></section>\n<section class=\"section\"><div class=\"container split\"><div><span class=\"eyebrow\">Platform architecture</span><h2>Every capability required to move from intent to outcome.</h2><div class=\"side-list\"><div class=\"side-item\"><div class=\"icon\">1</div><div><h3>Workflow engine</h3><p class=\"muted\">Model repeatable work, inputs, decision gates and outputs.</p></div></div><div class=\"side-item\"><div class=\"icon\">2</div><div><h3>Agent framework</h3><p class=\"muted\">Assemble specialist AI roles aligned to each business process.</p></div></div><div class=\"side-item\"><div class=\"icon\">3</div><div><h3>Knowledge layer</h3><p class=\"muted\">Connect approved enterprise data and preserve evidence.</p></div></div><div class=\"side-item\"><div class=\"icon\">4</div><div><h3>Policy & observability</h3><p class=\"muted\">Control models, approvals, retries, access and audit.</p></div></div></div></div><div class=\"dashboard center\"><div class=\"pill\">Business user / team</div><div style=\"font-size:28px;margin:24px\">\u2193</div><div class=\"card\"><strong>Workflow Orchestration</strong></div><div style=\"font-size:28px;margin:18px\">\u2193</div><div class=\"grid-3\"><div class=\"card\">AI Agents</div><div class=\"card\">Enterprise Knowledge</div><div class=\"card\">Enterprise Systems</div></div><div style=\"font-size:28px;margin:18px\">\u2193</div><div class=\"card\" style=\"background:#fff4dc\">Human Approval & Decision</div><div style=\"font-size:28px;margin:18px\">\u2193</div><div class=\"card\" style=\"background:#e8f8ef\">Delivery & Outcomes</div></div></div></section>\n<section class=\"section alt\"><div class=\"container center\"><span class=\"eyebrow\">Platform principles</span><h2>Model neutral. Policy driven. Built to scale.</h2><div class=\"grid-4\" style=\"margin-top:40px\"><div class=\"card\"><h3>Model neutral</h3><p class=\"muted\">Choose models based on risk, cost and task requirements.</p></div><div class=\"card\"><h3>Composable</h3><p class=\"muted\">Reuse agents, tools, policies and workflow components.</p></div><div class=\"card\"><h3>Observable</h3><p class=\"muted\">Track every run, decision, repair and outcome.</p></div><div class=\"card\"><h3>Enterprise controlled</h3><p class=\"muted\">Apply access, deployment and governance requirements.</p></div></div></div></section>";

export default function PlatformPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Platform | AFSv5";
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
