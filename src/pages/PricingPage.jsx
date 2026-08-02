import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const content = "<section class=\"hero-inner\"><div class=\"container\"><div class=\"breadcrumb\">AFSv5 / Engagement</div><span class=\"eyebrow\" style=\"color:#a99fff\">Flexible enterprise engagement</span><h1>Built around your workflows, deployment and governance requirements.</h1><p class=\"lead\">Choose a starting model for validation, business deployment or enterprise-wide adoption.</p></div></section>\n<section class=\"section\"><div class=\"container\"><div class=\"grid-3\"><div class=\"card\"><span class=\"pill\">Starter</span><h2 style=\"font-size:30px;margin-top:18px\">Pilot</h2><p class=\"muted\">Validate one high-value workflow with a controlled user group.</p><ul><li>Up to 5 users</li><li>One pilot workflow</li><li>Standard models</li><li>Basic integrations</li></ul><a class=\"btn btn-light\" href=\"/demo\">Contact Sales</a></div><div class=\"card\" style=\"border:2px solid var(--violet)\"><span class=\"pill\">Recommended</span><h2 style=\"font-size:30px;margin-top:18px\">Business</h2><p class=\"muted\">Deploy multiple workflows for a team or business unit.</p><ul><li>Up to 50 users</li><li>Advanced workflows</li><li>Custom integrations</li><li>Governance controls</li></ul><a class=\"btn btn-primary\" href=\"/demo\">Contact Sales</a></div><div class=\"card\"><span class=\"pill\">Enterprise</span><h2 style=\"font-size:30px;margin-top:18px\">Scale</h2><p class=\"muted\">Enterprise deployment with advanced controls and support.</p><ul><li>Unlimited scale options</li><li>Custom deployment</li><li>Advanced governance</li><li>Enterprise support</li></ul><a class=\"btn btn-light\" href=\"/demo\">Contact Sales</a></div></div><p class=\"notice center\" style=\"margin-top:25px\">Commercial terms, features and commitments shown here are placeholders for sales qualification and must be approved before publication.</p></div></section>";

export default function PricingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Engagement | AFSv5";
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
