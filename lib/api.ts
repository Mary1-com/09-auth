import axios from "axios";
import type { Note, NoteTag } from "../types/note";

// const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export interface FetchNotesResponse { notes: Note[]; totalPages: number; }

interface FetchNotesParams {
    page: number;
    search: string;
    perPage?: number;
    tag?: NoteTag;
}

export async function fetchNotes({ page = 1, search = "", perPage = 12, tag, }: FetchNotesParams):
    Promise<FetchNotesResponse> {
    const response = await api.get<FetchNotesResponse>("/notes", {
        params: {
            page, perPage, search,
            ...(tag ? { tag } : {}),
        },
    });
    
    return response.data;
}

// export async function fetchNotes({ page = 1, search = "", perPage = 12 }: FetchNotesParams): Promise<FetchNotesResponse> {
//     const response = await api.get<FetchNotesResponse>("/notes", {
//         params: { page, perPage, search, },
//     });
//     return response.data;
// }

export async function fetchNoteById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
}
interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
}


export async function createNote(noteData: CreateNoteParams): Promise<Note> {
    const response = await api.post<Note>("/notes", noteData);
    return response.data;
}

export async function deleteNote( id: string ): Promise<Note> {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
}