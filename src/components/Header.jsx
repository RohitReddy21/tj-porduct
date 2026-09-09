import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';

// lucide-react v1 removed its brand marks (Facebook / Twitter / Linkedin), so the
// social glyphs are inlined here. Importing them from lucide would render
// `undefined` and crash the header.
function FacebookIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.45-4.92 8.45-9.94Z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

// Nav headings stay as they are in this project. Any item can be given a
// `dropdownItems` array and it renders the chevron + hover panel automatically.
const navItems = [
  { path: '/platform', label: 'Platform' },
  { path: '/workflows', label: 'Workflows' },
  { path: '/agent-graph', label: 'Agent Graph' },
  { path: '/governance', label: 'Governance' },
  { path: '/use-cases', label: 'Use Cases' },
  { path: '/security', label: 'Security' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/blog', label: 'Blog' },
];

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://twitter.com', label: 'Twitter', Icon: TwitterIcon },
  {
    href: 'https://www.linkedin.com/company/techjignyasa-india-private-limited/posts/?viewAsMember=true',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
];

const navLinkClass = ({ isActive }) =>
  `font-medium py-2 whitespace-nowrap transition-colors ${
    isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
  }`;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // The drawer covers the viewport, so stop the page behind it from scrolling.
  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', isMenuOpen);
    return () => document.body.classList.remove('mobile-nav-open');
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const barMotion = shouldReduceMotion
    ? { initial: false }
    : { initial: { y: -100 }, animate: { y: 0 }, transition: { duration: 0.3 } };

  const drawerMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      };

  return (
    <header className="sticky top-0 z-[60] w-full">
      {/* Top Info Bar */}
      <div className="hidden md:block bg-gray-100 text-sm text-gray-700 py-1">
        <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a href="tel:+14195614770" className="flex items-center space-x-1 hover:text-blue-600">
            <Phone size={14} />
            <span>(419) 561-4770</span>
          </a>
          <a
            href="mailto:sales@techjignyasa.com"
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <Mail size={14} />
            <span>sales@techjignyasa.com</span>
          </a>
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>Dallas, TX</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.div
        {...barMotion}
        className={`transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'
        }`}
      >
        {/* `.container` comes from styles.css, so the logo and nav line up with
            every page's content column at all widths. */}
        <div className="container flex items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/techjignyasa-logo.png"
              alt="Tech Jignyasa Logo"
              className="w-20 h-12 sm:w-24 sm:h-14 md:w-28 md:h-16 object-contain"
            />
          </Link>

          {/* Nav Links */}
          <nav
            className="hidden lg:flex items-center space-x-5 xl:space-x-8"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => item.dropdownItems && setOpenDropdown(item.label)}
                onMouseLeave={() => item.dropdownItems && setOpenDropdown(null)}
              >
                {item.dropdownItems ? (
                  <>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-1 ${navLinkClass({ isActive })}`
                      }
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={16} />
                    </NavLink>
                    <AnimatePresence>
                      {openDropdown === item.label ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink to={item.path} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Right Contact Info */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Phone className="text-blue-600" size={18} />
            </div>
            <div className="flex flex-col text-sm leading-tight">
              <span className="text-xs text-gray-500">Have Any Question?</span>
              <a href="tel:+14195614770" className="font-bold text-gray-800 hover:text-blue-600">
                (419) 561-4770
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-site-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            key="mobile-nav"
            id="mobile-site-menu"
            {...drawerMotion}
            className="fixed inset-0 z-50 overflow-y-auto bg-white shadow-lg lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/assets/techjignyasa-logo.png"
                  alt="Tech Jignyasa Logo"
                  className="w-20 h-12 sm:w-24 sm:h-14 object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 transition hover:text-red-500"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <nav className="space-y-6 px-6 py-4" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const isDropdownOpen = openDropdown === item.label;

                return (
                  <div key={item.path}>
                    {item.dropdownItems ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                          className="flex w-full items-center justify-between text-base font-medium text-gray-800"
                          aria-expanded={isDropdownOpen}
                        >
                          <span>{item.label}</span>
                          <motion.span
                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                          >
                            <ChevronDown size={20} />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {isDropdownOpen ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-2 overflow-hidden pl-4"
                            >
                              {item.dropdownItems.map((sub) => (
                                <Link
                                  key={sub.path}
                                  to={sub.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block text-sm text-gray-600 hover:text-blue-600"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block text-base font-medium ${
                            isActive ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Top-bar contact details, which are hidden on small screens */}
            <div className="mt-2 space-y-4 border-t border-gray-200 px-6 py-6 text-sm text-gray-700">
              <a href="tel:+14195614770" className="flex items-center space-x-2 hover:text-blue-600">
                <Phone size={16} />
                <span className="font-bold text-gray-800">(419) 561-4770</span>
              </a>
              <a
                href="mailto:sales@techjignyasa.com"
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <Mail size={16} />
                <span>sales@techjignyasa.com</span>
              </a>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Dallas, TX</span>
              </div>
              <div className="flex items-center space-x-4 pt-2">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
