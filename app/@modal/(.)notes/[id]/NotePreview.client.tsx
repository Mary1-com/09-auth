"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps { id: string; }

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
    const router = useRouter();
    
    const handleClose = () => { router.back(); };
    
    const { data: note, isLoading, error, } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });
    
    if (isLoading) {
        return (
            <Modal onClose={handleClose}>
                <p>Loading, please wait...</p>
            </Modal>
        );
    }
    
    if (error || !note) {
        return (
            <Modal onClose={handleClose}>
                <p>Something went wrong.</p>
            </Modal>
        );
    }
    
    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
                <button type="button" className={css.closeBtn} onClick={handleClose}>Close </button>
                <div className={css.item}>
                    <div className={css.header}>
                        <h2>{note.title}</h2>
                    </div>
                    
                    <p className={css.tag}>{note.tag}</p>
                    <p className={css.content}>{note.content}</p>
                    <p className={css.date}>{note.createdAt}</p>
                </div>
            </div>
        </Modal>
    );
}
