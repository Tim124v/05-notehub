import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import NoteModal from '../NoteModal/NoteModal';
import { fetchNotes, FetchNotesResponse } from '../../services/noteService';
import { useDebounce } from 'use-debounce';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
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
      {isError && <Error message={error?.message || ''} />}
      {data && data.notes && (
        <NoteList notes={data.notes} />
      )}
      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default App;