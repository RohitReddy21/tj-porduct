import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Security & Trust</div><span class=\"eyebrow\" style=\"color:#a99fff\">Secure by design</span><h1>Security, privacy and compliance from day one.</h1><p class=\"lead\">Deploy AFSv5 with enterprise controls for identity, data, models, networks, observability and audit.</p></div></section>\n<section class=\"section\"><div class=\"container split\"><div><span class=\"eyebrow\">Trust architecture</span><h2>Control where AI runs and what it can access.</h2><div class=\"side-list\"><div class=\"side-item\"><strong>\u2713</strong><div><h3>Private deployment options</h3><p class=\"muted\">Cloud, dedicated environments and enterprise network patterns.</p></div></div><div class=\"side-item\"><strong>\u2713</strong><div><h3>Data-use controls</h3><p class=\"muted\">Define approved sources, retention and model boundaries.</p></div></div><div class=\"side-item\"><strong>\u2713</strong><div><h3>Identity and RBAC</h3><p class=\"muted\">Granular roles for designers, operators, approvers and auditors.</p></div></div><div class=\"side-item\"><strong>\u2713</strong><div><h3>Audit and logging</h3><p class=\"muted\">End-to-end evidence for every run and decision.</p></div></div></div></div><div class=\"card center\" style=\"padding:60px;background:linear-gradient(145deg,#07132f,#10285f);color:#fff\"><div style=\"font-size:90px\">\u25c8</div><h2>Enterprise controlled</h2><p style=\"color:#cbd5ed\">Security requirements must be validated for each customer deployment and contract.</p></div></div></section>\n<section class=\"section alt\"><div class=\"container center\"><h2>Security capabilities</h2><div class=\"grid-4\" style=\"margin-top:35px\"><div class=\"card\"><h3>Encryption</h3></div><div class=\"card\"><h3>Network isolation</h3></div><div class=\"card\"><h3>Access management</h3></div><div class=\"card\"><h3>Audit exports</h3></div></div></div></section>";

export default function SecurityPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Security & Trust | AFSv5";
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
