import { Modal } from "../Modal/Modal";
import { Note } from "@/types/note";

type Props = {
  note: Note;
  onClose: () => void;
};

const NotePreview = ({ note, onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.tag}</p>
      <p>{note.createdAt}</p>
    </Modal>
  );
};

export default NotePreview;
