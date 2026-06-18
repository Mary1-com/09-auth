import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate, } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const validTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NotesFilterPageProps {
    params: Promise<{ slug: string[]; }>;
}

const baseUrl = "https://notehub.com/";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: NotesFilterPageProps): Promise<Metadata> {
    const { slug } = await params;
    const selectedTag = slug[0];

    const title =
        selectedTag === "all"
        ? "All notes | NoteHub"
        : `${selectedTag} notes | NoteHub`;

    const description =
        selectedTag === "all"
        ? "Browse all notes in NoteHub."
        : `Browse notes filtered by ${selectedTag} tag.`;

    return {
        title,
        description,
        openGraph: {
        title,
        description,
        url: `${baseUrl}notes/filter/${selectedTag}`,
        images: [
            {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "NoteHub preview",
            },
        ],
        },
    };
}

export default async function NotesFilterPage({ params, }: NotesFilterPageProps) {
    const { slug } = await params;
    const selectedTag = slug[0];
    const isAllNotes = selectedTag === "all";
    const isValidTag = validTags.includes(selectedTag as NoteTag);
    
    if (!isAllNotes && !isValidTag) {
        notFound();
    }
    
    const tag = isAllNotes ? undefined : (selectedTag as NoteTag);
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["notes", 1, "", tag ?? "all"],
        queryFn: () => fetchNotes({ page: 1, search: "", tag }),
    });
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
        </HydrationBoundary>
    );
}