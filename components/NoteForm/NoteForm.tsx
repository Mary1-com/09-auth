"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const draft = useNoteStore((state) => state.draft);
    const setDraft = useNoteStore((state) => state.setDraft);
    const clearDraft = useNoteStore((state) => state.clearDraft);

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            clearDraft();
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            router.push("/notes/filter/all");
        },
    });
    
    const formAction = (formData: FormData) => {
        mutation.mutate({
        title: String(formData.get("title")),
        content: String(formData.get("content")),
        tag: formData.get("tag") as NoteTag,
        });
    };

    return (
        <form className={css.form} action={formAction}>
        <label className={css.label}>
            Title
            <input
            className={css.input}
            type="text"
            name="title"
            defaultValue={draft.title}
            onChange={(event) => setDraft({ title: event.target.value })}
            required
            />
        </label>

        <label className={css.label}>
            Content
            <textarea
            className={css.textarea}
            name="content"
            defaultValue={draft.content}
            onChange={(event) => setDraft({ content: event.target.value })}
            />
        </label>

        <label className={css.label}>
            Tag
            <select
            className={css.select}
            name="tag"
            defaultValue={draft.tag}
            onChange={(event) =>
                setDraft({ tag: event.target.value as NoteTag })
            }
            >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
            </select>
        </label>

        <div className={css.actions}>
            <button type="button" onClick={() => router.back()}>
            Cancel
            </button>

            <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create note"}
            </button>
        </div>
        </form>
    );
}