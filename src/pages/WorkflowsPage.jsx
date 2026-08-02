import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Workflow Library</div><span class=\"eyebrow\" style=\"color:#a99fff\">Pre-built, configurable workflows</span><h1>Purpose-built workflows. Faster time to impact.</h1><p class=\"lead\">Start from proven patterns, adapt them to your operating model and keep every run governed.</p></div></section>\n<section class=\"section\"><div class=\"container\"><div class=\"grid-3\"><div class=\"card workflow\"><span class=\"pill\">Engineering</span><h3>BRD \u2192 Approved Solution</h3><p class=\"muted\">Create a PRD, solution architecture and QC-reviewed implementation definition.</p><div class=\"start\">Explore \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Research</span><h3>Research \u2192 Decision</h3><p class=\"muted\">Gather evidence, assess sufficiency and produce a decision package.</p><div class=\"start\">Explore \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Knowledge</span><h3>Knowledge Base Q&A</h3><p class=\"muted\">Answer enterprise questions with citations, evidence and auditability.</p><div class=\"start\">Explore \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Release</span><h3>Approved Definition \u2192 Release</h3><p class=\"muted\">Generate tasks, build, test and release scoped capabilities.</p><div class=\"start\">Explore \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Agents</span><h3>Dynamic Agent Graph</h3><p class=\"muted\">Design and execute custom multi-agent operating models.</p><div class=\"start\">Explore \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Custom</span><h3>Custom Enterprise Workflow</h3><p class=\"muted\">Build controlled workflows around your systems, roles and policies.</p><div class=\"start\">Create \u2192</div></div></div></div></section>\n<section class=\"section alt\"><div class=\"container split\"><div><span class=\"eyebrow\">Workflow anatomy</span><h2>Every workflow is designed for repeatability and control.</h2><p class=\"copy\">Inputs, tools, agent roles, policies, review checkpoints, outputs and audit records are configured as a reusable operating asset.</p></div><div class=\"grid-2\"><div class=\"card\"><h3>Defined inputs</h3><p class=\"muted\">Documents, APIs, systems and structured business context.</p></div><div class=\"card\"><h3>Explicit decisions</h3><p class=\"muted\">Clear gates, owners and approval criteria.</p></div><div class=\"card\"><h3>Controlled execution</h3><p class=\"muted\">Model, tool and retry policies aligned to risk.</p></div><div class=\"card\"><h3>Auditable outputs</h3><p class=\"muted\">Evidence, rationale, versions and final deliverables.</p></div></div></div></section>";

export default function WorkflowsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Workflow Library | AFSv5";
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
