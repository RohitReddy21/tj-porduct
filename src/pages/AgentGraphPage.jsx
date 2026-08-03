import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Dynamic Agent Graph</div><span class=\"eyebrow\" style=\"color:#93c5fd\">Design specialist AI teams</span><h1>Design. Connect. Govern. Run.</h1><p class=\"lead\">Build agent teams tailored to each process, with explicit responsibilities, tools, supervision and decision controls.</p></div></section>\n<section class=\"section\"><div class=\"container split\"><div class=\"graph\"><svg class=\"graph-lines\" viewBox=\"0 0 600 480\" preserveAspectRatio=\"none\"><path d=\"M300 75 L300 125 M300 155 L140 215 M300 155 L460 215 M140 245 L300 300 M460 245 L300 300 M300 330 L170 390 M300 330 L430 390\" stroke=\"#d1d5db\" stroke-width=\"2\" fill=\"none\"/></svg><div class=\"node primary\" style=\"top:35px;left:43%\">Planner</div><div class=\"node primary\" style=\"top:115px;left:39%\">Research Agent</div><div class=\"node\" style=\"top:205px;left:12%\">Reviewer</div><div class=\"node green\" style=\"top:205px;right:12%\">Supervisor</div><div class=\"node orange\" style=\"top:290px;left:42%\">Architect</div><div class=\"node primary\" style=\"top:360px;left:39%\">Developer</div><div class=\"node\" style=\"bottom:20px;left:14%\">QA Agent</div><div class=\"node green\" style=\"bottom:20px;right:14%\">Auditor</div></div><div><span class=\"eyebrow\">Graph builder</span><h2>Make the operating model visible.</h2><div class=\"side-list\"><div class=\"side-item\"><div class=\"icon\">+</div><div><h3>Add specialist nodes</h3><p class=\"muted\">Define role, objective, model, tools and constraints.</p></div></div><div class=\"side-item\"><div class=\"icon\">\u2194</div><div><h3>Connect dependencies</h3><p class=\"muted\">Control task sequence, parallel work and escalation.</p></div></div><div class=\"side-item\"><div class=\"icon\">\u2713</div><div><h3>Insert review gates</h3><p class=\"muted\">Require human or supervisory validation where needed.</p></div></div><div class=\"side-item\"><div class=\"icon\">\u27f3</div><div><h3>Version and improve</h3><p class=\"muted\">Compare outcomes and refine the agent team over time.</p></div></div></div></div></div></section>";

export default function AgentGraphPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Dynamic Agent Graph | AFSv5";
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
