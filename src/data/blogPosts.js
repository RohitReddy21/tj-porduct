// ---------------------------------------------------------------------------
// BLOG DATA — this is the only file you edit to publish a post on the site.
//
// LinkedIn has no public API or RSS feed for personal articles, so posts are
// listed here by hand. Publishing takes about 30 seconds:
//
//   1. Publish your article or post on LinkedIn.
//   2. Click the "..." menu on the post -> "Copy link to post".
//   3. Add a new object to the TOP of the `blogPosts` array below.
//   4. Save. The card appears on /blog immediately.
//
// Only `title`, `date` and `url` are required. Everything else is optional.
// ---------------------------------------------------------------------------

// Powers every "Follow on LinkedIn" button on the blog.
export const LINKEDIN_PROFILE_URL =
  'https://www.linkedin.com/company/techjignyasa-india-private-limited';

export const blogPosts = [
  // ---- Copy this block for each new post -----------------------------------
  {
    title: 'How AFSv5 cuts agent runtime cost by 40%',
    date: '2026-09-01', // YYYY-MM-DD
    excerpt:
      'A short one or two sentence summary. This is the text that shows on the card, so write it for someone scanning the page.',
    url: 'https://www.linkedin.com/posts/your-linkedin-handle_example-post-id',
    image: '', // optional: '/assets/blog/my-cover.png' or a full https:// URL
    tags: ['Agent Orchestration', 'Cost'],
    readingTime: '4 min read', // optional
  },
  // --------------------------------------------------------------------------
  {
    title: 'Governance is not a dashboard, it is a control plane',
    date: '2026-08-18',
    excerpt:
      'Why approval gates, evidence capture and audit trails belong inside the run loop rather than bolted on afterwards.',
    url: 'https://www.linkedin.com/posts/your-linkedin-handle_example-post-id-2',
    image: '',
    tags: ['Governance'],
    readingTime: '6 min read',
  },
  {
    title: 'Grounding enterprise answers without leaking the enterprise',
    date: '2026-07-29',
    excerpt:
      'Connecting SharePoint, Confluence and Salesforce to an LLM is the easy part. Respecting the permission boundaries already in those systems is the real work.',
    url: 'https://www.linkedin.com/posts/your-linkedin-handle_example-post-id-3',
    image: '',
    tags: ['Knowledge', 'Security'],
    readingTime: '5 min read',
  },
];

// Newest first, regardless of the order you paste them in above.
export const sortedBlogPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);
