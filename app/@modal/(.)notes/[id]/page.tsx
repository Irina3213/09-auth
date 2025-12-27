import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById as fetchServerNoteById } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";
import { cookies } from "next/headers"; // 1. Імпортуємо cookies

type NoteDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  // 2. Отримуємо куки (у Next.js 15 це асинхронно)
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    // 3. Передаємо id та куки у функцію
    queryFn: () => fetchServerNoteById(id, cookieStore.toString()),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreviewClient id={id} />
      </HydrationBoundary>
    </div>
  );
}
