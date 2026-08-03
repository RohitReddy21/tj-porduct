import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AgentGraphPage from './pages/AgentGraphPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import GovernancePage from './pages/GovernancePage.jsx';
import IndustriesPage from './pages/IndustriesPage.jsx';
import KnowledgePage from './pages/KnowledgePage.jsx';
import PlatformPage from './pages/PlatformPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import RunsPage from './pages/RunsPage.jsx';
import SecurityPage from './pages/SecurityPage.jsx';
import UseCasesPage from './pages/UseCasesPage.jsx';
import WorkflowsPage from './pages/WorkflowsPage.jsx';

// #region debug-point B:app-module-load
fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"react-runtime-error",runId:"post-fix",hypothesisId:"B",location:"src/App.jsx:17",msg:"[DEBUG] App module loaded",data:{url:import.meta.url},ts:Date.now()})}).catch(()=>{});
// #endregion

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

export default function App(){
// #region debug-point A:app-function-enter
fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"react-runtime-error",runId:"post-fix",hypothesisId:"A",location:"src/App.jsx:21",msg:"[DEBUG] App function entered",data:{typeofGlobalReact:typeof globalThis.React},ts:Date.now()})}).catch(()=>{});
// #endregion
return <BrowserRouter><ScrollToTop/><Header/><Routes><Route path="/" element={<HomePage />} />
<Route path="/agent-graph" element={<AgentGraphPage />} />
<Route path="/demo" element={<DemoPage />} />
<Route path="/governance" element={<GovernancePage />} />
<Route path="/industries" element={<IndustriesPage />} />
<Route path="/knowledge" element={<KnowledgePage />} />
<Route path="/platform" element={<PlatformPage />} />
<Route path="/pricing" element={<PricingPage />} />
<Route path="/runs" element={<RunsPage />} />
<Route path="/security" element={<SecurityPage />} />
<Route path="/use-cases" element={<UseCasesPage />} />
<Route path="/workflows" element={<WorkflowsPage />} /></Routes><Footer/></BrowserRouter>}
