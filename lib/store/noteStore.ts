import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNoteDto } from "@/types/note";

interface NoteDraftState {
  draft: Partial<CreateNoteDto>;
  setDraft: (draft: Partial<CreateNoteDto>) => void;
  clearDraft: () => void;
}

export const useNoteDraftStore = create<NoteDraftState>()(
  persist(
    (set) => ({
      draft: { title: "", content: "", tag: "Todo" },
      setDraft: (newDraft) => set({ draft: newDraft }),
      clearDraft: () => set({ draft: { title: "", content: "", tag: "Todo" } }),
    }),
    { name: "note-draft-storage" }
  )
);
