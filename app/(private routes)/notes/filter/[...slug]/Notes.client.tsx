'use client';

import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import css from './Notes.module.css';
import Link from 'next/link';

const NotesClient = ({ tag }: { tag?: string }) => {
  // Стан для зберігання поточної сторінки
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;
  // Стан для зберігання пошуку
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useQuery({
    queryKey: ['notes', searchQuery, currentPage, perPage, tag],
    queryFn: () => fetchNotes(searchQuery, currentPage, perPage, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });
  const { notes = [], totalPages } = data || {};

  const handleSearch = useDebouncedCallback((val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  }, 300);
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox searchQuery={searchQuery} onSearch={handleSearch} />
        {typeof totalPages === 'number' &&
          data?.notes &&
          data.notes.length > 0 && (
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        <Link className={css.link} href={'/notes/action/create'}>
          Create note +
        </Link>
      </div>
      {notes && <NoteList notes={notes} />}
    </div>
  );
};

export default NotesClient;
