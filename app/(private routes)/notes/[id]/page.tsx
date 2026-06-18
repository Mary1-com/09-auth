import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/serverApi";

import { HydrationBoundary, QueryClient, dehydrate, } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
interface NoteDetailsPageProps {    params: Promise<{ id: string }>;}

const baseUrl = "https://notehub.com/";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const note = await fetchNoteById(id);

    return {
        title: `${note.title} | NoteHub`,
        description: note.content.slice(0, 120),
        openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.slice(0, 120),
        url: `${baseUrl}notes/${id}`,
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

export default async function NoteDetailsPage({ params, }: NoteDetailsPageProps) {
    const { id } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
}