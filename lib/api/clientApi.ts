import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse { notes: Note[]; totalPages: number; }


interface FetchNotesParams {
    page: number;
    search: string;
    perPage?: number;
    tag?: NoteTag;
}

interface CreateNoteParams { title: string; content: string; tag: NoteTag; }

interface AuthParams { email: string; password: string; }

interface UpdateUserParams { username: string; }

export async function fetchNotes({
    page = 1,
    search = "",
    perPage = 12,
    tag,
    }: FetchNotesParams): Promise<FetchNotesResponse> {
        const response = await api.get<FetchNotesResponse>("/notes", {
        params: {
        page,
        perPage,
        search,
        ...(tag ? { tag } : {}),
        },
    });
    return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
}

export async function createNote(noteData: CreateNoteParams): Promise<Note> {
    const response = await api.post<Note>("/notes", noteData);
    return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
}

export async function register(data: AuthParams): Promise<User> {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
}

export async function login(data: AuthParams): Promise<User> {
    const response = await api.post<User>("/auth/login", data);
    return response.data;
}

export async function logout(): Promise<void> { await api.post("/auth/logout"); }


export async function checkSession(): Promise<User | null> {
    const response = await api.get<User | null>("/auth/session");
    return response.data ?? null;
}

export async function getMe(): Promise<User> {
    const response = await api.get<User>("/users/me");
    return response.data;
}

export async function updateMe(data: UpdateUserParams): Promise<User> {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
}