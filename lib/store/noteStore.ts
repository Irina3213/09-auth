import { create } from 'zustand';
import { NewFormNote } from '@/types/note';
import { persist } from 'zustand/middleware';

interface NoteDraftStore {
  draft: NewFormNote; // draft: об’єкт, що містить тимчасові дані форми нотатки (title, content, tag).
  setDraft: (note: NewFormNote) => void; //setDraft(note): функція для оновлення полів чернетки.
  clearDraft: () => void; //clearDraft(): функція для очищення чернетки до початкового стану. У якості початкового стану використовуйте наступний об’єкт
}

const initialDraft: NewFormNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft, // це об’єкт чернетки, який містить поля майбутньої нотатки. initialDraft - початкове значення чернетки: усі поля порожні.
      setDraft: (note) => set(() => ({ draft: note })), // оновлює чернетку при зміні будь-якого поля.
      clearDraft: () => set(() => ({ draft: initialDraft })), // очищує чернетку (наприклад, після успішного сабміту).
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
