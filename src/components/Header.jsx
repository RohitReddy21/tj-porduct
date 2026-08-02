import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
const links=[['Platform','/platform'],['Workflows','/workflows'],['Agent Graph','/agent-graph'],['Governance','/governance'],['Use Cases','/use-cases'],['Security','/security']];
export default function Header(){
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return <div className="nav-wrap nav-wrap-header">
    <div className="container nav">
      <Link className="brand brand-logo" to="/" onClick={closeMenu}>
        <img src="/assets/techjignyasa-logo.png" alt="TechJignyasa" />
      </Link>

      <nav className="nav-links">
        {links.map(([label,to])=><NavLink key={to} to={to}>{label}</NavLink>)}
        <NavLink to="/pricing">Pricing</NavLink>
      </nav>

      <div className="nav-actions">
        <Link className="btn btn-primary nav-cta-desktop" to="/demo">Book a Demo</Link>
        <button
          className="mobile-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </div>

    {menuOpen ? (
      <div id="mobile-site-menu" className="mobile-menu">
        <div className="container mobile-menu-inner">
          {links.map(([label,to])=><NavLink key={to} to={to} onClick={closeMenu}>{label}</NavLink>)}
          <NavLink to="/pricing" onClick={closeMenu}>Pricing</NavLink>
          <Link className="btn btn-primary" to="/demo" onClick={closeMenu}>Book a Demo</Link>
        </div>
      </div>
    ) : null}
  </div>}
