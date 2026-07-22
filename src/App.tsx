import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar, ToastHost } from "./components/Chrome";
import { ErrorBoundary } from "./components/ErrorBoundary";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Coupons from "./pages/Coupons";
import Home from "./pages/Home";
import { OrderPlaced, Track } from "./pages/Orders";
import Shop from "./pages/Shop";
import { StoreProvider } from "./store";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Defensive: some browser extensions replace window.scrollTo with a
    // broken function; never let a scroll reset crash the app.
    try {
      window.scrollTo(0, 0);
    } catch {
      try {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {
        /* give up scrolling, never crash */
      }
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ErrorBoundary>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-placed" element={<OrderPlaced />} />
              <Route path="/track" element={<Track />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="*" element={<Home />} />
            </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
          <ToastHost />
        </div>
        </ErrorBoundary>
      </HashRouter>
    </StoreProvider>
  );
}
