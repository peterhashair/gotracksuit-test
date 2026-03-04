import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

type ModalContextValue = {
  open: boolean;
  onClose(): void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal sub-components must be used within <Modal>");
  return ctx;
};

export type ModalProps = {
  open: boolean;
  onClose(): void;
  children?: ReactNode;
};

const ANIMATIONS = {
  overlay: {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { delayChildren: 0.1 },
    },
  },
  modal: {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  },
};

const Title = ({ children }: { children: ReactNode }) => (
  <h1 className={styles.title}>{children}</h1>
);

const Content = ({ children }: { children?: ReactNode }) => (
  <div className={styles.content}>{children}</div>
);

const CloseIcon = () => {
  const { onClose } = useModal();
  return <XIcon className={styles.close} onClick={onClose} />;
};

const Footer = ({ children }: { children?: ReactNode }) => (
  <div className={styles.footer}>{children}</div>
);

export const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <ModalContext.Provider value={{ open, onClose }}>
      {createPortal(
        <AnimatePresence>
          {open && (
            <LayoutGroup>
              <motion.div
                className={styles.overlay}
                variants={ANIMATIONS.overlay}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={onClose}
                data-testid="overlay"
              >
                <motion.div
                  className={styles.modal}
                  variants={ANIMATIONS.modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </motion.div>
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </ModalContext.Provider>
  );
};

Modal.Title = Title;
Modal.Content = Content;
Modal.CloseIcon = CloseIcon;
Modal.Footer = Footer;
