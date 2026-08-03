import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Knowledge Intelligence</div><span class=\"eyebrow\" style=\"color:#93c5fd\">Connected enterprise knowledge</span><h1>Reliable answers grounded in your enterprise.</h1><p class=\"lead\">Connect approved sources, search across them and preserve the evidence behind every answer.</p></div></section>\n<section class=\"section\"><div class=\"container center\"><div class=\"logo-strip\"><div>SharePoint</div><div>Confluence</div><div>Google Drive</div><div>Salesforce</div><div>Databases</div></div><div class=\"dashboard\" style=\"margin-top:40px;text-align:left\"><div class=\"form-grid\"><input class=\"input\" placeholder=\"Ask a question across your enterprise knowledge\"><button class=\"btn btn-primary\">Search</button></div><div class=\"grid-4\" style=\"margin-top:30px\"><div class=\"card\"><div class=\"icon\">\u2315</div><h3>Search</h3><p class=\"muted\">Find relevant content across connected sources.</p></div><div class=\"card\"><div class=\"icon\">\u25eb</div><h3>Evidence</h3><p class=\"muted\">Preserve passages, files and data used.</p></div><div class=\"card\"><div class=\"icon\">\u2713</div><h3>Answer</h3><p class=\"muted\">Generate grounded responses with citations.</p></div><div class=\"card\"><div class=\"icon\">A</div><h3>Audit</h3><p class=\"muted\">Log every search, source and final output.</p></div></div></div></div></section>\n<section class=\"section alt\"><div class=\"container split\"><div><span class=\"eyebrow\">Knowledge controls</span><h2>Connect broadly. Expose selectively.</h2><p class=\"copy\">AFSv5 respects access boundaries and allows organizations to define approved sources, freshness rules, citation requirements and fallback behavior.</p></div><div class=\"grid-2\"><div class=\"card\"><h3>Source permissions</h3></div><div class=\"card\"><h3>Data freshness</h3></div><div class=\"card\"><h3>Citation requirements</h3></div><div class=\"card\"><h3>Web-search controls</h3></div></div></div></section>";

export default function KnowledgePage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Knowledge Intelligence | AFSv5";
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
