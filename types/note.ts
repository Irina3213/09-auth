export type NoteTag =
  | 'All'
  | 'Todo'
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}

export interface NewFormNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface notesHttpResponse {
  notes: Note[];
  totalPages: number;
}
