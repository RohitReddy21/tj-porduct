import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Industries</div><span class=\"eyebrow\" style=\"color:#93c5fd\">Purpose-built for your environment</span><h1>Enterprise AI aligned to your industry.</h1><p class=\"lead\">Adapt workflows, controls, terminology and deployment patterns to the requirements of each industry.</p></div></section>\n<section class=\"section\"><div class=\"container\"><div class=\"grid-4\"><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">H</div><h3>Healthcare</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">\u26a1</div><h3>Energy & Utilities</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">M</div><h3>Manufacturing</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">G</div><h3>Government</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">F</div><h3>Financial Services</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">R</div><h3>Retail & Commerce</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">IT</div><h3>IT Services</h3></div><div class=\"card center\"><div class=\"icon\" style=\"margin:auto auto 20px\">E</div><h3>Education</h3></div></div></div></section>";

export default function IndustriesPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Industries | AFSv5";
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
