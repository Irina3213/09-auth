import css from "./SidebarNotes.module.css";
import { tagsArr } from "@/types/note";

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {tagsArr.map((tag) => {
        return (
          <li key={tag} className={css.menuItem}>
            <a href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
