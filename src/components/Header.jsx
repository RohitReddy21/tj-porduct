import React from 'react';
import { NavLink, Link } from 'react-router-dom';
const links=[['Platform','/platform'],['Workflows','/workflows'],['Agent Graph','/agent-graph'],['Governance','/governance'],['Use Cases','/use-cases'],['Security','/security']];
export default function Header(){return <div className="nav-wrap nav-wrap-header"><div className="container nav">
    <Link className="brand brand-logo" to="/">
    <img src="/assets/techjignyasa-logo.png" alt="TechJignyasa" /></Link>
    <nav className="nav-links">{links.map(([label,to])=><NavLink key={to} to={to}>{label}</NavLink>)}<NavLink to="/pricing">Pricing</NavLink></nav><Link className="btn btn-primary" to="/demo">Book a Demo</Link></div></div>}
