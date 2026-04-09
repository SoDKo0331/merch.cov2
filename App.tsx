import React, { useState } from 'react';
import Header from './components/Header';
import LabModal from './components/LabModal';
import ContactModal from './components/ContactModal';
import Magnetic from './components/Magnetic';
import ProcessCard from './components/ProcessCard';
import SolutionsSlider from './components/SolutionsSlider';
import AboutUs from './components/AboutUs';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import { PROMISES, COLLECTIONS, CATEGORIES, PROCESS_STEPS } from './constants';
import heroImage from './assets/image.jpg';
import BackgroundLogo from './components/BackgroundLogo';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);

  const { scrollY } = useScroll();

  React.useEffect(() => {
    return scrollY.onChange((latest) => {
      setShowStickyButton(latest > window.innerHeight * 0.8);
    });
  }, [scrollY]);

  React.useEffect(() => {
    const handleLoad = () => {
      const loader = document.getElementById('global-loader');
      if (loader) {
        // Add a small delay to ensure React has fully rendered the initial frame
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.remove();
          }, 600);
        }, 100);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-yellow selection:text-deep-black">
      <Header
        onNavigate={setCurrentPage}
        onScrollToSection={handleScrollToSection}
      />

      <main className="relative w-full overflow-hidden">
        {currentPage === 'home' ? (
          <>
            <section id="home" className="relative w-screen h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-white m-0 p-0">
              <div className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-white-studio-2735-large.mp4" type="video/mp4" />
                </video>
              </div>

              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 z-0"
              >
                <img
                  src={heroImage}
                  alt="High Fashion Editorial"
                  className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
                <div className="w-[120vw] max-w-[1200px] text-brand-yellow/20 blur-[60px] md:blur-[100px] mix-blend-screen scale-150">
                  <BackgroundLogo className="w-full h-auto" />
                </div>
              </div>

              <div className="absolute bottom-40 md:bottom-48 left-0 right-0 z-20 flex flex-col items-center gap-12 px-6">
                <div className="max-w-8xl text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.2,
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-5xl md:text-9xl lg:text-8xl font-display font-bold text-white uppercase leading-[1.1] drop-shadow-2xl mb-24"
                  >
                    Бид таны брэндийг <br />
                    <span className="text-brand-yellow">бодит болгоно</span>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.6,
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="flex flex-col items-center"
                  >
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="group relative px-12 py-6 overflow-hidden border border-brand-yellow bg-brand-yellow transition-transform duration-300 hover:scale-105 active:scale-95 rounded-full"
                    >
                      <span className="relative z-10 text-[14px] font-bold text-deep-black transition-colors duration-500 group-hover:text-white">
                        Customize your merch
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-deep-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                      />
                    </button>
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40 hidden md:block">
                <div className="w-[1px] h-12 bg-white/50 animate-pulse"></div>
              </div>
            </section>

            <div className="bg-brand-yellow border-y-[1px] border-deep-black/10 py-3 overflow-hidden flex whitespace-nowrap">
              <div className="animate-marquee flex gap-8 md:gap-12 items-center">
                {Array(10).fill(null).map((_, i) => (
                  <React.Fragment key={i}>
                    <span className="text-xl md:text-2xl font-display tracking-widest opacity-80 text-deep-black">Events</span>
                    <span className="text-lg text-brand-blue/40">•</span>
                    <span className="text-xl md:text-2xl font-display tracking-widest opacity-80 text-deep-black">People</span>
                    <span className="text-lg text-brand-blue/40">•</span>
                    <span className="text-xl md:text-2xl font-display tracking-widest opacity-80 text-deep-black">Partner Companies</span>
                    <span className="text-lg text-brand-blue/40">•</span>
                    <span className="text-xl md:text-2xl font-display tracking-widest opacity-80 text-deep-black">Customized Merch</span>
                    <span className="text-lg text-electric-blue/40">•</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <section className="bg-brand-blue py-24 md:py-32 px-6 overflow-hidden border-b-[1px] border-deep-black/10">
              <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="max-w-5xl"
                >
                  <p className="text-xl md:text-3xl lg:text-5xl font-display text-white leading-[0.9] cursor-default">
                    94% of employees receiving swag monthly reported being <span className="text-brand-yellow">very satisfied</span> with the their jobs.<br />
                  </p>
                </motion.div>
              </div>
            </section>

            <section id="products" className="bg-white py-20 px-6 border-b-[1px] border-deep-black/10">
              <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                  <div className="relative">
                    <h2 className="text-3xl md:text-5xl font-display text-deep-black leading-tight">
                      <span className="text-brown">Products</span>
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                  {CATEGORIES.map((cat, i) => (
                    <Magnetic key={i} strength={0.1} className={`${cat.span || ''} group/card`}>
                      <div className={`relative border-[1px] border-deep-black/10 overflow-hidden h-full w-full interactive cursor-pointer ${cat.bgColor}`}>
                        <div className="absolute inset-0 opacity-10 pointer-events-none group-hover/card:opacity-20 transition-opacity">
                          <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
                            {Array(16).fill(0).map((_, idx) => (
                              <div key={idx} className="border-[0.5px] border-deep-black/20"></div>
                            ))}
                          </div>
                        </div>

                        <img
                          alt={cat.name}
                          className="w-full h-full object-cover grayscale transition-all duration-700 scale-100 group-hover/card:scale-105 group-hover/card:grayscale-0"
                          src={cat.image}
                          loading="lazy"
                          width="400"
                          height="400"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-500"></div>

                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <div className="flex flex-col transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                            <span className="font-display text-4xl text-white leading-none mb-2">{cat.name}</span>
                            <div className="h-[1px] w-0 group-hover/card:w-full bg-brand-yellow transition-all duration-700 mb-4" />
                            <span className="text-[10px] font-bold text-white opacity-60 group-hover/card:opacity-100 transition-opacity">Explore Collection</span>
                          </div>
                        </div>

                        <div className="absolute top-6 right-6 bg-brand-yellow text-deep-black font-display text-[10px] px-3 py-1.5 border border-deep-black opacity-0 group-hover/card:opacity-100 transition-all transform -rotate-12 group-hover/card:rotate-0 duration-500">
                          Limited Edition
                        </div>
                      </div>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </section>

            <div id="corporate">
              <SolutionsSlider />
            </div>
          </>
        ) : (
          <AboutUs
            onNavigate={setCurrentPage}
            onContact={() => setIsContactOpen(true)}
          />
        )}
      </main>

      <Footer
        onNavigate={setCurrentPage}
        onScrollToSection={handleScrollToSection}
        onContact={() => setIsContactOpen(true)}
      />

      <AnimatePresence>
        {showStickyButton && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-10 right-10 z-[110]"
          >
            <Magnetic strength={0.4}>
              <button
                onClick={() => setIsContactOpen(true)}
                className="group relative px-10 py-4 border-[1px] border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-white/10 backdrop-blur-lg"
              >
                <div className="absolute inset-0 bg-brand-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />

                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow group-hover:bg-deep-black animate-pulse" />
                  <span className="font-display text-lg text-white group-hover:text-deep-black transition-colors duration-500">
                    Start
                  </span>
                </div>
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

      <LabModal isOpen={isLabOpen} onClose={() => setIsLabOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Analytics />
    </div>
  );
};

export default App;