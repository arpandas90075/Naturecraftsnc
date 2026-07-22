import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchCatalogue } from "./lib/api";
import type { CartItem, Product, Settings } from "./types";

interface Toast {
  id: number;
  text: string;
}

interface Store {
  products: Product[];
  settings: Settings;
  loading: boolean;
  loadError: string;
  reload: () => void;

  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  toasts: Toast[];
  toast: (text: string) => void;
}

const Ctx = createContext<Store | null>(null);

const CART_KEY = "nc_cart";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({ deliveryCharge: 0, referralDiscount: 0, firstOrderPct: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadError("");
    fetchCatalogue()
      .then(({ products, settings }) => {
        setProducts(products);
        setSettings(settings);
      })
      .catch(() =>
        setLoadError(
          "We couldn't load the shop right now. Check your connection and try again."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  // hydrate cart, then re-sync prices once products arrive (owner may have changed them)
  useEffect(() => {
    try {
      const saved: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved);
    } catch {
      /* ignore corrupt cart */
    }
  }, []);

  useEffect(() => {
    if (!products.length) return;
    setCart((prev) =>
      prev
        .map((item) => {
          const fresh = products.find((p) => p.id === item.product.id);
          return fresh ? { ...item, product: fresh } : null;
        })
        .filter(Boolean) as CartItem[]
    );
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const toast = useCallback((text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === p.id);
        if (existing)
          return prev.map((i) =>
            i.product.id === p.id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
          );
        return [...prev, { product: p, qty }];
      });
      toast(`${p.name} added to cart`);
    },
    [toast]
  );

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) =>
            i.product.id === productId ? { ...i, qty: Math.min(qty, 99) } : i
          )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const subtotal = useMemo(
    () => cart.reduce((n, i) => n + i.qty * i.product.price, 0),
    [cart]
  );

  const value: Store = {
    products,
    settings,
    loading,
    loadError,
    reload,
    cart,
    cartCount,
    subtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toasts,
    toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
