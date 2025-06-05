import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import css from './NoteModal.module.css';
import NoteForm, { NoteFormValues } from '../NoteForm/NoteForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, CreateNoteDto } from '../../services/noteService';
import { Note } from '../../types/note';

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<Note, Error, CreateNoteDto>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error) => {
      setError(error.message || '');
    }
  });

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

  const handleSubmit = async (values: NoteFormValues, helpers: any) => {
    try {
      setError(null);
      const fixedTag = (values.tag.charAt(0).toUpperCase() + values.tag.slice(1).toLowerCase()) as Note['tag'];
      const { title, content } = values;
      await mutation.mutateAsync({ title, content, tag: fixedTag });
    } catch (err) {
      helpers.setSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        {error && (
          <div className={css.error}>
            {error}
            <button 
              className={css.errorClose} 
              onClick={() => setError(null)}
              aria-label=""
            >
              ×
            </button>
          </div>
        )}
        <NoteForm
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal; 