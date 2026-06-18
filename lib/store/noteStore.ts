import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { NoteTag } from "@/types/note";

const initialDraft = {
    title: "",
    content: "",
    tag: "Todo" as NoteTag,
};

interface DraftNote {
    title: string;
    content: string;
    tag: NoteTag;
}

interface NoteStore {
    draft: DraftNote;
    setDraft: (note: Partial<DraftNote>) => void;
    clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        ...note,
                    },
                })),
            clearDraft: () =>
                set({
                    draft: initialDraft,
                }),
        }),
        {
            name: "notehub-draft",
            partialize: (state) => ({
                draft: state.draft,
            }),
        }
    )
);