"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps { children: ReactNode; onClose: () => void; }

export default function Modal({ children, onClose }: ModalProps) {
    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        
        return () => { document.body.style.overflow = originalBodyOverflow; };
    }, []);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);
        
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);
    
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    
    return createPortal(
        <div className={css.backdrop} onClick={handleBackdropClick}>
            <div className={css.modal}>{children}</div>
        </div>,
        document.body
    );
}