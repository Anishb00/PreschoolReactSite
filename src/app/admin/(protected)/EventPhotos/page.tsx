import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import EventPhotosEditor from "@/app/admin/components/EventPhotosEditor";
import { loadEventPhotos, updateEventPhotos } from "./eventPhotoActions";

export default async function EventPhotosPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.EDIT_EVENT_PHOTOS);
  const events = await loadEventPhotos();

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Event Photos</h2>
        <p className="text-gray-600">
          Create event albums and upload photos shown on the public site.
        </p>
      </header>
      <EventPhotosEditor initialEvents={events} updateEventPhotos={updateEventPhotos} />
    </>
  );
}
