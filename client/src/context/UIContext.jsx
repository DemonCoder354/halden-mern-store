import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const UIContext = createContext(null);
const THEME_KEY = 'halden-theme';

function initialTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function UIProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, opts = {}) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, message, ...opts }]);
      setTimeout(() => dismiss(id), opts.duration ?? 3200);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      toasts,
      toast,
      dismiss,
    }),
    [theme, toasts, toast, dismiss]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
