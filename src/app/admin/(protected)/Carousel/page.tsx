import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import CarouselEditor from "@/app/admin/components/CarouselEditor";
import { loadCarouselImages, updateCarousel } from "./carouselActions";

export default async function CarouselPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.EDIT_CAROUSEL);
  const entries = await loadCarouselImages();

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Photo Carousel
        </h2>
        <p className="text-gray-600">
          Add, remove, and reorder photos shown on the homepage carousel.
        </p>
      </header>
      <CarouselEditor initialEntries={entries} updateCarousel={updateCarousel} />
    </>
  );
}
