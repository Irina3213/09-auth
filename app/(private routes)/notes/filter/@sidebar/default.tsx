import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { NoteTag } from '@/types/note';
// import CreateNote from '../../action/create/page';

const staticTags: NoteTag[] = [
  'All',
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const NotesSidebar = async () => {
  return (
    <>
      <Link className={css.menuLink} href={'/notes/action/create'}>
        Create note +
      </Link>
      <ul className={css.menuList}>
        {Array.isArray(staticTags) &&
          staticTags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                {tag}
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default NotesSidebar;
