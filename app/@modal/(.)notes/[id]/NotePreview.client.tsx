'use client';
import css from './NotePreview.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
const NotePreviewClient = () => {
  const router = useRouter();

  const close = () => {
    router.back();
  };

  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={close}>
      <div onClick={(e) => e.stopPropagation()} className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <button
          className={css.backBtn}
          onClick={close}
          aria-label="Close modal"
        >
          Go back
        </button>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
