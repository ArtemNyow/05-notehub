import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes, type NotesResponse } from "../../services/noteService";
import Loader from "../Loader/Loader";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Paginatio";
import { useState, useEffect } from "react";
import SearchBox from "../SearchBox/SearchBox";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { Note } from "../../types/note";
import css from "./App.module.css";
import { useDebounce } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(debouncedSearch, page, perPage),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation<Note, Error, Pick<Note, "title" | "content" | "tag">>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => deleteMutation.mutate(id);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong.");
    } else if (data && data.notes.length === 0) {
      toast.error("No notes found.");
    }
  }, [isError, data]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <header className={css.toolbar}>
        <SearchBox onChange={setSearch} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <NoteList notes={data?.notes ?? []} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => createMutation.mutate(values)}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
