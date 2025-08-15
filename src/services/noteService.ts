import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  perPage?: number;
}

export const fetchNotes = async (
  search: string = "",
  page: number,
  perPage: number = 12
): Promise<NotesResponse> => {
  const response = await axios.get<NotesResponse>(BASE_URL, {
    params: {
      search: search.trim() || undefined,
      page,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
};

export const createNote = async (note: Pick<Note, "title" | "content" | "tag">): Promise<Note> => {
  const response = await axios.post<Note>(
    BASE_URL,
    note,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
};
