import NoteListClient from "./Notes.client";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchServerNotes } from "@/lib/api/serverApi";
import { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ slug: string[] }>; // ✅ params — Promise
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ чекаємо на Promise
  const tag = slug[0];

  const title = `Notes filtered by: ${tag}`;
  const description = `Review of notes filtered by "${tag}".`;
  const url = `https://09-auth-six-zeta.vercel.app/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Title",
        },
      ],
      type: "website",
    },
  };
}

export default async function App({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];

  const queryClient = new QueryClient();
  const cookieStore = await cookies(); // Отримуємо куки

  await queryClient.prefetchQuery({
    queryKey: ["notes", { query: "", page: 1, tag }],
    // Передаємо об'єкт { page, search, tag } та рядок кук
    queryFn: () =>
      fetchServerNotes({ page: 1, search: "", tag }, cookieStore.toString()),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteListClient tag={tag} />
      </HydrationBoundary>
    </div>
  );
}
