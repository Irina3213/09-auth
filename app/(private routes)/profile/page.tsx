import Link from "next/link";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "See your profile in NoteHub application",
  metadataBase: new URL("https://notehub.com"),
  openGraph: {
    title: "Profile | NoteHub",
    description: "See your profile in NoteHub application",
    url: "https://notehub.com/profile",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile | NoteHub",
      },
    ],
    type: "website",
  },
};

const Profile = async () => {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="Your avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
