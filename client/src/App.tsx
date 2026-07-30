import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CustomCursor from './components/Cursor';
import MiniTerminal from './components/MiniTerminal';
import LiveTicker from './components/LiveTicker';
import CrazyMode from './components/CrazyMode';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Experience = lazy(() => import('./pages/Experience'));
const Entertainment = lazy(() => import('./pages/Entertainment'));
const Contact = lazy(() => import('./pages/Contact'));
const Status = lazy(() => import('./pages/Status'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent/30 selection:text-white">
      <CustomCursor />
      <Navigation />
      <MiniTerminal />
      <CrazyMode />
      <LiveTicker />
      <main className="pb-9">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><LazyPage><Home /></LazyPage></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><LazyPage><Projects /></LazyPage></PageWrapper>} />
            <Route path="/projects/:slug" element={<PageWrapper><LazyPage><ProjectDetail /></LazyPage></PageWrapper>} />
            <Route path="/experience" element={<PageWrapper><LazyPage><Experience /></LazyPage></PageWrapper>} />
            <Route path="/entertainment" element={<PageWrapper><LazyPage><Entertainment /></LazyPage></PageWrapper>} />
            <Route path="/status" element={<PageWrapper><LazyPage><Status /></LazyPage></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><LazyPage><Contact /></LazyPage></PageWrapper>} />
            <Route path="*" element={<PageWrapper><LazyPage><NotFound /></LazyPage></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
