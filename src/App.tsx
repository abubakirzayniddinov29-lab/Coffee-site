import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { hasWebGL } from './lib/webgl';
import { initSmoothScroll, startScroll, stopScroll, ScrollTrigger } from './lib/scroll';
import { OrderContext } from './lib/order-context';
import { Loader } from './components/ui/Loader';
import { Cursor, Grain } from './components/ui/Cursor';
import { Navbar } from './components/ui/Navbar';
import { OrderModal } from './components/ui/OrderModal';
import { Hero } from './components/sections/Hero';
import { Story } from './components/sections/Story';
import { Process } from './components/sections/Process';
import { Menu } from './components/sections/Menu';
import { Signature } from './components/sections/Signature';
import { Testimonials } from './components/sections/Testimonials';
import { CallToAction, Contact, Footer } from './components/sections/Closing';

// 3D scene is lazy-loaded → three.js is not part of the initial bundle
const Scene = lazy(() => import('./components/three/Scene'));

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error('[3D] scene failed, using fallback', err);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const webgl = useMemo(hasWebGL, []);
  const [sceneFailed, setSceneFailed] = useState(!webgl);
  const [sceneReady, setSceneReady] = useState(!webgl);
  const [fontsReady, setFontsReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [order, setOrder] = useState<{ open: boolean; drink?: string }>({ open: false });

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    const t = setTimeout(() => setFontsReady(true), 3000);
    document.fonts?.ready.then(() => setFontsReady(true));
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaderGone) {
      window.scrollTo(0, 0);
      stopScroll();
    } else {
      startScroll();
      ScrollTrigger.refresh();
    }
  }, [loaderGone]);

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onSceneError = useCallback(() => {
    setSceneFailed(true);
    setSceneReady(true);
  }, []);
  const openOrder = useCallback((drink?: string) => setOrder({ open: true, drink }), []);
  const closeOrder = useCallback(() => setOrder((o) => ({ ...o, open: false })), []);
  const ctx = useMemo(() => ({ openOrder }), [openOrder]);

  return (
    <OrderContext.Provider value={ctx}>
      {webgl && (
        <SceneBoundary onError={onSceneError}>
          <Suspense fallback={null}>
            <Scene onReady={onSceneReady} />
          </Suspense>
        </SceneBoundary>
      )}

      <Navbar />
      <main className="relative z-10">
        <Hero ready={revealed} fallback={sceneFailed} />
        <Story />
        <Process />
        <Menu />
        <Signature />
        <Testimonials />
        <Contact />
        <CallToAction />
      </main>
      <Footer />

      <OrderModal open={order.open} drinkId={order.drink} onClose={closeOrder} />
      <Grain />
      <Cursor />
      {!loaderGone && (
        <Loader done={sceneReady && fontsReady} onReveal={() => setRevealed(true)} onFinish={() => setLoaderGone(true)} />
      )}
    </OrderContext.Provider>
  );
}
