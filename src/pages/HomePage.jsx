import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero\"><div class=\"container hero-grid\"><div><span class=\"pill\">Introducing AFSv5</span><h1>Enterprise AI that plans, executes and governs.</h1><p class=\"lead\">Turn business intent into approved outcomes through reusable workflows, multi-agent execution, enterprise knowledge and human decision gates.</p><div class=\"hero-actions\"><a class=\"btn btn-primary\" href=\"/demo\">Book Enterprise Demo</a><a class=\"btn btn-secondary\" href=\"#platform\">Explore Platform</a></div><div class=\"trust-row\"><span>\u25c9 Policy-driven AI</span><span>\u25ce Human in the loop</span><span>\u25c7 Audit ready</span><span>\u25a3 Secure by design</span></div></div><div class=\"product-frame\"><img src=\"/assets/afsv5-cockpit.png\" alt=\"AFSv5 Cockpit dashboard\"></div></div></section>\n<section class=\"section\"><div class=\"container center\"><span class=\"eyebrow\">Designed for enterprise outcomes</span><h2>More than answers. A governed operating layer for AI work.</h2><p class=\"copy\">AFSv5 combines orchestration, specialist agents, enterprise data, human approvals and evidence-backed execution in one platform.</p><div class=\"grid-3\" style=\"margin-top:42px\"><div class=\"card\"><div class=\"icon\">\u21bb</div><h3>Workflow Orchestration</h3><p class=\"muted\">Convert repeatable business processes into controlled AI workflows.</p></div><div class=\"card\"><div class=\"icon\">\u2318</div><h3>Multi-Agent Teams</h3><p class=\"muted\">Coordinate planners, researchers, reviewers, developers and auditors.</p></div><div class=\"card\"><div class=\"icon\">\u2713</div><h3>Governance & Audit</h3><p class=\"muted\">Apply policies, approvals, evidence and traceability at every step.</p></div><div class=\"card\"><div class=\"icon\">\u25eb</div><h3>Enterprise Knowledge</h3><p class=\"muted\">Ground outputs in documents, systems, databases and approved sources.</p></div><div class=\"card\"><div class=\"icon\">\u2659</div><h3>Human Decisions</h3><p class=\"muted\">Route critical actions to the right people before execution continues.</p></div><div class=\"card\"><div class=\"icon\">\u26a1</div><h3>Delivery to Outcome</h3><p class=\"muted\">Move from requirements and research to releases and operational action.</p></div></div></div></section>\n<section id=\"platform\" class=\"section alt\"><div class=\"container\"><div class=\"center\"><span class=\"eyebrow\">How it works</span><h2>From intent to impact in five governed steps.</h2></div><div class=\"process\"><div class=\"step\"><div class=\"step-num\">1</div><h3>Select workflow</h3><p class=\"muted\">Start from an approved template or custom process.</p></div><div class=\"step\"><div class=\"step-num\">2</div><h3>Connect context</h3><p class=\"muted\">Provide documents, systems, rules and objectives.</p></div><div class=\"step\"><div class=\"step-num\">3</div><h3>Orchestrate agents</h3><p class=\"muted\">Specialist agents plan, research, build and review.</p></div><div class=\"step\"><div class=\"step-num\">4</div><h3>Approve decisions</h3><p class=\"muted\">Human owners review high-impact actions.</p></div><div class=\"step\"><div class=\"step-num\">5</div><h3>Deliver & learn</h3><p class=\"muted\">Release outcomes with full audit and feedback.</p></div></div></div></section>\n<section class=\"section\"><div class=\"container split\"><div><span class=\"eyebrow\">Workflow library</span><h2>Purpose-built workflows for real enterprise work.</h2><p class=\"copy\">Launch governed processes for solution definition, research, knowledge, release delivery and custom agent teams.</p><a class=\"btn btn-primary\" href=\"/workflows\">Explore Workflows</a></div><div class=\"grid-2\"><div class=\"card workflow\"><span class=\"pill\">Engineering</span><h3>BRD \u2192 Approved Solution</h3><p class=\"muted\">Turn requirements into a reviewed PRD, architecture and implementation definition.</p><div class=\"start\">Start workflow \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Decisioning</span><h3>Research \u2192 Decision</h3><p class=\"muted\">Produce evidence-backed recommendations with traceability and review.</p><div class=\"start\">Start workflow \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Knowledge</span><h3>Knowledge Base Q&A</h3><p class=\"muted\">Answer questions using governed enterprise sources and citations.</p><div class=\"start\">Start workflow \u2192</div></div><div class=\"card workflow\"><span class=\"pill\">Delivery</span><h3>Approved Definition \u2192 Release</h3><p class=\"muted\">Build, test, approve and release a scoped capability change.</p><div class=\"start\">Start workflow \u2192</div></div></div></div></section>\n<section class=\"section alt\"><div class=\"container\"><div class=\"cta-band\"><div><span class=\"eyebrow\" style=\"color:#dbeafe\">Enterprise AI, operationalized</span><h2 style=\"margin-bottom:8px\">Ready to see AFSv5 in action?</h2><p style=\"margin:0;color:rgba(255,255,255,0.9)\">Book a tailored walkthrough around your highest-value workflow.</p></div><a class=\"btn btn-light\" href=\"/demo\">Book a Demo \u2192</a></div></div></section>";

// #region debug-point C:homepage-module-load
fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"react-runtime-error",runId:"post-fix",hypothesisId:"C",location:"src/pages/HomePage.jsx:6",msg:"[DEBUG] HomePage module loaded",data:{url:import.meta.url},ts:Date.now()})}).catch(()=>{});
// #endregion

export default function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    // #region debug-point C:homepage-effect
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"react-runtime-error",runId:"post-fix",hypothesisId:"C",location:"src/pages/HomePage.jsx:11",msg:"[DEBUG] HomePage effect ran",data:{path:window.location.pathname},ts:Date.now()})}).catch(()=>{});
    // #endregion
    document.title = "AFSv5 | Enterprise AI Operating System";
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
