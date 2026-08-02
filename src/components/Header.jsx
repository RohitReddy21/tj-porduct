import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  ['Platform', '/platform'],
  ['Workflows', '/workflows'],
  ['Agent Graph', '/agent-graph'],
  ['Governance', '/governance'],
  ['Use Cases', '/use-cases'],
  ['Security', '/security'],
  ['Pricing', '/pricing'],
];

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? ' nav-link-active' : ''}`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', menuOpen);
    return () => document.body.classList.remove('mobile-nav-open');
  }, [menuOpen]);

  return (
    <div className={`nav-wrap nav-wrap-header${menuOpen ? ' nav-wrap-open' : ''}`}>
      <div className="container nav">
        <Link className="brand brand-logo" to="/" onClick={closeMenu}>
          <img src="/assets/techjignyasa-logo.png" alt="TechJignyasa" />
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="btn btn-primary nav-cta-desktop" to="/demo">
            Book a Demo
          </Link>
          <button
            className="mobile-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="mobile-toggle-box" aria-hidden="true">
              <span className="mobile-toggle-line" />
              <span className="mobile-toggle-line" />
              <span className="mobile-toggle-line" />
            </span>
            <span className="mobile-toggle-text">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-site-menu" className="mobile-menu">
          <div className="container">
            <div className="mobile-menu-panel">
              <div className="mobile-menu-heading">
                <span className="pill mobile-menu-pill">Navigate AFSv5</span>
                <p>Explore the platform, workflows, trust model, and demo flow.</p>
              </div>

              <nav className="mobile-menu-inner" aria-label="Mobile navigation">
                {links.map(([label, to]) => (
                  <NavLink key={to} to={to} className={navLinkClass} onClick={closeMenu}>
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="mobile-menu-actions">
                <Link className="btn btn-primary" to="/demo" onClick={closeMenu}>
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
