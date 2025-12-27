import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
import { fetchServerNotes } from "@/lib/api/serverApi";
type Props = {
  params: { slug: string[] };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Обов'язково додаємо await
  const slug = resolvedParams.slug;

  const filter = slug && slug[0] === "All" ? "All" : slug ? slug[0] : "All";

  return {
    title: `NoteHub - ${filter} notes`,
    description: `Page with notes filtred by the tag ${filter}`,
    openGraph: {
      title: `NoteHub - ${filter} notes`,
      description: `Page with notes filtred by the tag ${filter}`,
      url: `https://notehub.versel.app/notes/filter/${filter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function Notes({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const filter =
    slug && slug[0] === "All" ? undefined : slug ? slug[0] : undefined;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag: filter }],
    queryFn: () => fetchServerNotes(1, "", filter),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filter={filter} />
    </HydrationBoundary>
  );
}
