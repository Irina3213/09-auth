import { cookies } from "next/headers";
import { nextServer } from "./api";
import { Note, NoteTag } from "@/types/note";
import { PER_PAGE } from "./clientApi";
import { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: NoteTag | undefined
): Promise<FetchNotesResponse | null> => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore) return null;
    const response = await nextServer.get<FetchNotesResponse>("/notes", {
      params: {
        search,
        page,
        perPage: PER_PAGE,
        tag,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch {
    return null;
  }
};

export const fetchNoteById = async (noteId: string): Promise<Note | null> => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore) return null;
    const response = await nextServer.get<Note>(`/notes/${noteId}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return response.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};
