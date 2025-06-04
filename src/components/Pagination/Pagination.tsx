import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}

function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <nav className={css.pagination}>
      <ReactPaginate
        pageCount={pageCount}
        forcePage={currentPage - 1}
        onPageChange={selected => onPageChange(selected.selected + 1)}
        previousLabel={"←"}
        nextLabel={"→"}
        breakLabel={"..."}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        containerClassName={css.pagination}
        activeClassName={css.active}
      />
    </nav>
  );
}

export default Pagination; 