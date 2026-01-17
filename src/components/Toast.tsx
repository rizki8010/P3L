import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "error" | "success" | "info";
  duration?: number;
}

const Toast = ({
  message,
  isVisible,
  onClose,
  type = "error",
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-24 left-1/2 min-w-[320px] max-w-md z-50 flex items-center justify-center pointer-events-none"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 ${
              type === "error"
                ? "bg-red-50/90 text-red-800"
                : type === "success"
                  ? "bg-green-50/90 text-green-800"
                  : "bg-blue-50/90 text-blue-800"
            }`}
          >
            {type === "error" && (
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-full text-red-600 font-bold text-lg">
                !
              </span>
            )}
            {type === "success" && (
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600 font-bold text-lg">
                ✓
              </span>
            )}
            {type === "info" && (
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-bold text-lg">
                i
              </span>
            )}
            <div>
              <p className="font-bold text-sm">
                {type === "error"
                  ? "Perhatian"
                  : type === "success"
                    ? "Berhasil"
                    : "Info"}
              </p>
              <p className="text-sm font-medium opacity-90">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity p-1"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
