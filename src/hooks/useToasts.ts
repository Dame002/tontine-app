import { useState, useRef } from "react";
import type { Toast } from "../types";

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tid = useRef(0);

  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = ++tid.current;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return { toasts, addToast };
}
