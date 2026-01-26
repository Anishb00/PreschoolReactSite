import { notFound } from "next/navigation";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import EventAlbumEditor from "@/app/admin/components/EventAlbumEditor";
import { loadEventAlbum, updateEventAlbum } from "../eventPhotoActions";

type PageProps = {
  params: Promise<{ event: string }>;
};

export default async function EventPhotoDetailPage({ params }: PageProps) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.EDIT_EVENT_PHOTOS);
  const resolvedParams = await params;
  const eventName = decodeURIComponent(resolvedParams.event);
  const images = await loadEventAlbum(eventName);

  if (!images) {
    notFound();
  }

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          {eventName} Photos
        </h2>
        <p className="text-gray-600">
          Upload and remove photos for this event.
        </p>
      </header>
      <EventAlbumEditor
        eventName={eventName}
        initialImages={images}
        updateEventAlbum={updateEventAlbum}
      />
    </>
  );
}
