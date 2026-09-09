import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MotionEnhancer from './components/MotionEnhancer.jsx';
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

// The blog and admin routes are the only ones that pull in the Supabase client,
// so they load on demand instead of shipping it to every visitor.
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

const routeVariants = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
};

const reducedRouteVariants = {
	initial: { opacity: 1, y: 0 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 1, y: 0 },
};

function AnimatedRoutes() {
	const location = useLocation();
	const routeShellRef = useRef(null);
	const shouldReduceMotion = useReducedMotion();

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				ref={routeShellRef}
				className="route-shell"
				key={location.pathname}
				variants={shouldReduceMotion ? reducedRouteVariants : routeVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				transition={{
					duration: shouldReduceMotion ? 0 : 0.28,
					ease: [0.22, 1, 0.36, 1],
				}}
			>
				<MotionEnhancer rootRef={routeShellRef} />
				<Suspense fallback={null}>
				<Routes location={location}>
					<Route path="/" element={<HomePage />} />
					<Route path="/agent-graph" element={<AgentGraphPage />} />
					<Route path="/admin" element={<AdminPage />} />
					<Route path="/blog" element={<BlogPage />} />
					<Route path="/blog/:slug" element={<BlogPostPage />} />
					<Route path="/demo" element={<DemoPage />} />
					<Route path="/governance" element={<GovernancePage />} />
					<Route path="/industries" element={<IndustriesPage />} />
					<Route path="/knowledge" element={<KnowledgePage />} />
					<Route path="/platform" element={<PlatformPage />} />
					<Route path="/pricing" element={<PricingPage />} />
					<Route path="/runs" element={<RunsPage />} />
					<Route path="/security" element={<SecurityPage />} />
					<Route path="/use-cases" element={<UseCasesPage />} />
					<Route path="/workflows" element={<WorkflowsPage />} />
				</Routes>
				</Suspense>
			</motion.div>
		</AnimatePresence>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Header />
			<AnimatedRoutes />
			<Footer />
		</BrowserRouter>
	);
}
