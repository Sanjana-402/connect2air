import { useState } from 'react';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

import Hero from '@/sections/Hero';
import Statement from '@/sections/Statement';
import Services from '@/sections/Services';
import Process from '@/sections/Process';
import Campaigns from '@/sections/Campaigns';
import Showreel from '@/sections/Showreel';
import Stats from '@/sections/Stats';
import FinalCTA from '@/sections/FinalCTA';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useSmoothScroll();

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

      <main>
        <Hero ready={heroReady} />
        <Statement />
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
