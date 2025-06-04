import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import css from './NoteModal.module.css';
import NoteForm, { NoteFormValues } from '../NoteForm/NoteForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { Note } from '../../types/note';

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation<Note, Error, NoteFormValues>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (values: NoteFormValues) => {
    const fixedTag = (values.tag.charAt(0).toUpperCase() + values.tag.slice(1).toLowerCase()) as Note['tag'];
    const fixedValues: NoteFormValues = { ...values, tag: fixedTag };
    await mutation.mutateAsync(fixedValues);
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <NoteForm
          onCancel={onClose}
          onSuccess={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal; 