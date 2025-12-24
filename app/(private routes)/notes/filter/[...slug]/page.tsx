import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/serverApi';
import { NoteTag } from '@/types/note';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const staticTags: NoteTag[] = [
  'All',
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];
type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] ?? 'All';

  const isValidTag = tag === 'All' || staticTags.includes(tag as NoteTag);
  if (!isValidTag) notFound();
  return {
    title: `Category: ${tag}`,
    description: `List of notes for a category ${tag}`,
    openGraph: {
      title: `Category: ${tag}`,
      description: `NoteHub list of notes for a category ${tag}`,
      url: `https://08-zustand-six-opal.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] ?? 'All';

  const isValidTag = tag === 'All' || staticTags.includes(tag as NoteTag);
  if (!isValidTag) notFound();

  const queryClient = new QueryClient();
  const search = '';
  const page = 1;
  const perPage = 10;

  await queryClient.prefetchQuery({
    queryKey: ['notes', search, page, perPage, tag],
    queryFn: () => fetchNotes(search, page, perPage, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
