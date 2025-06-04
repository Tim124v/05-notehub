import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import NoteModal from '../NoteModal/NoteModal';
import { fetchNotes, deleteNote, FetchNotesResponse } from '../../services/noteService';
import { Note } from '../../types/note';
import { useDebounce } from 'use-debounce';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

const queryClient = new QueryClient();
const PER_PAGE = 12;

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const queryClientInst = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const mutation = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => queryClientInst.invalidateQueries({ queryKey: ['notes'] }),
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <Error message={error?.message || 'Ошибка загрузки'} />}
      {data && data.notes && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}
      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;