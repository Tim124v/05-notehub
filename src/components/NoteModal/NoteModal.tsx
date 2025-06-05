import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import css from './NoteModal.module.css';
import NoteForm from '../NoteForm/NoteForm';

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <NoteForm onCancel={onClose} />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal; 