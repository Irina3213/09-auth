import { fetchNoteById as fetchServerNoteById } from "@/lib/api/serverApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";
import { cookies } from "next/headers"; // 1. Додаємо імпорт кук

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; // У Next.js 15 params це Promise
}): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies(); // 2. Отримуємо куки для метаданих

  try {
    const note = await fetchServerNoteById(id, cookieStore.toString());
    return {
      title: note.title,
      description: note.content.substring(0, 40),
      // ... решта вашого OG коду
    };
  } catch {
    return {
      title: "Note Not Found",
    };
  }
}

type NoteDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies(); // 3. Отримуємо куки для сторінки
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    // 4. Передаємо куки у функцію запиту
    queryFn: () => fetchServerNoteById(id, cookieStore.toString()),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </div>
  );
}
