"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";


interface NotesClientProps { tag?: NoteTag; }

export default function NotesClient({ tag }: NotesClientProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");    
    const { data, isLoading, error } = useQuery({
        queryKey: ["notes", page, search, tag ?? "all"],
        queryFn: () => fetchNotes({ page, search, tag }),
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });
    const totalPages = data?.totalPages ?? 0;

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const notes = data?.notes ?? [];

    return (
        <>
            <SearchBox onSearch={handleSearch} />
            <Link href="/notes/action/create">
                {/* className={css.button} */}
                Create note + 
                </Link>
            
            {totalPages > 1 && (
                <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={setPage}
                />
            )}
            {isLoading && <p>Loading, please wait...</p>}
            {error && <p>Something went wrong.</p>}
            <h1>Notes</h1>
            {/* <NoteList notes={data?.notes ?? []} /> */}
            {notes.length > 0 && (
                <NoteList notes={notes} />)
            }
        </>
    );
}
