import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutate, isPending } = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      // інвалідуємо список нотаток після успішного видалення
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteNoteMutate(note.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
