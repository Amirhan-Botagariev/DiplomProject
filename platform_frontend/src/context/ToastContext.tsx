import { createContext, useContext, useState, ReactNode } from "react";
import {ToastContainer} from "../components/toast/ToastContainer";

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
};

type ToastContextType = {
  addToast: (message: string, type: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = toastId++;
    const newToast: Toast = { id, message, type };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, 5); // максимум 5 тостов
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000); // исчезает через 5 сек
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}