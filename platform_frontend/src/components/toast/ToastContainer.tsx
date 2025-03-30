import { motion, AnimatePresence } from "framer-motion";
import type { Toast as ToastType } from "../../context/ToastContext";
import { ToastMessage } from "./ToastMessage";

type Props = {
  toasts: ToastType[];
};

export const ToastContainer = ({ toasts }: Props) => {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ToastMessage message={toast.message} type={toast.type} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};