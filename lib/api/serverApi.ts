import { cookies } from "next/headers";

import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
    }
interface FetchNotesParams {
    page: number;
    search: string;
    perPage?: number;
    tag?: NoteTag;
    }

async function getCookieHeader() {
    const cookieStore = await cookies();

    return cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
    }

export async function fetchNotes({
    page = 1,
    search = "",
    perPage = 12,
    tag,
    }: FetchNotesParams): Promise<FetchNotesResponse> {
    const cookieHeader = await getCookieHeader();

    const response = await api.get<FetchNotesResponse>("/notes", {
        params: {
        page,
        perPage,
        search,
        ...(tag ? { tag } : {}),
        },
        headers: {
        Cookie: cookieHeader,
        },
    });

    return response.data;
    }

export async function fetchNoteById(id: string): Promise<Note> {
    const cookieHeader = await getCookieHeader();

    const response = await api.get<Note>(`/notes/${id}`, {
        headers: {
        Cookie: cookieHeader,
        },
    });

    return response.data;
    }

export async function checkSession(): Promise<User | null> {
    try {
        const cookieHeader = await getCookieHeader();

        const response = await api.get<User | null>("/auth/session", {
        headers: {
            Cookie: cookieHeader,
        },
        });

        return response.data;
    } catch {
        return null;
    }
    }

export async function getMe(): Promise<User | null> {
    try {
        const cookieHeader = await getCookieHeader();

        const response = await api.get<User>("/users/me", {
        headers: {
            Cookie: cookieHeader,
        },
        });

        return response.data;
    } catch {
        return null;
    }
}