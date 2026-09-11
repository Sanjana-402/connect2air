import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import { ContactModal } from '@/components/ContactModal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import AdminPage from '@/pages/AdminPage';

import Hero from '@/sections/Hero';
import Statement from '@/sections/Statement';
import About from '@/sections/About';
import Services from '@/sections/Services';
import Process from '@/sections/Process';
import Campaigns from '@/sections/Campaigns';
import Showreel from '@/sections/Showreel';
import Stats from '@/sections/Stats';
import FinalCTA from '@/sections/FinalCTA';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

export default function App() {
  const [isAdminPath, setIsAdminPath] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      setIsAdminPath(window.location.pathname.toLowerCase().startsWith('/admin'));
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  useSmoothScroll();

  if (isAdminPath) {
    return <AdminPage />;
  }

  return (
    <>
      {loading && (
        <Loader
          onDone={() => {
            setLoading(false);
            setHeroReady(true);
          }}
        />
      )}

      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <ContactModal />

      <main>
        <Hero ready={heroReady} />
        <Statement />
        <About />
        <Services />
        <Process />
        <Campaigns />
        <Showreel />
        <Stats />
        <FinalCTA />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
