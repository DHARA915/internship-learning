import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Heart,
  Image as ImageIcon,
  Images,
  MoreVertical,
  X,
} from "lucide-react";
import { FormField } from "../../components/form-field/FormField";
import {
  ImageGallarydata,
  type ImageGallaryType,
  type SortType,
  sortOptions,
} from "../../utils/ImageGallaryUtils/ImageGallarydata";
import ImageCard from "./ImageCard";
import { Button } from "../../components/ui/button";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Counter from "yet-another-react-lightbox/plugins/counter";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

const ImageGallary = () => {
  const [images, setImages] = useState<ImageGallaryType[]>(ImageGallarydata);
  // const [activeTab, setActiveTab] = useState<"gallery" | "favorites">(
  //   "gallery",
  // );
  const [searchParams, setSearchParams] = useSearchParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  

  const search = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "All";

  const sortParam = searchParams.get("sort");

  const sortBy: SortType = sortOptions.some(
    (option) => option.value === sortParam,
  )
    ? (sortParam as SortType)
    : "newest";

  const activeTab: "gallary" | "favorites" =
    searchParams.get("tab") === "favorites" ? "favorites" : "gallary";

  const updateParam = (key: string, value: string, defaultValue = "") => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const setSearch = (value: string) => updateParam("q", value);
  const setSelectedCategory = (value: string) =>
    updateParam("category", value, "All");
  const setSortBy = (value: SortType) => updateParam("sort", value, "newest");
  const setActiveTab = (value: "gallery" | "favorites") =>
    updateParam("tab", value, "gallery");

  const category = useMemo(
    () => ["All", ...Array.from(new Set(images.map((item) => item.category)))],
    [images],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const getTime = (item: ImageGallaryType) =>
      new Date(item.createdAt).getTime();

    return images
      .filter((item) => (activeTab === "favorites" ? item.isLike : true))
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
      .filter((item) =>
        selectedCategory === "All" ? true : item.category === selectedCategory,
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return getTime(b) - getTime(a);
          case "oldest":
            return getTime(a) - getTime(b);
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [images, activeTab, search, selectedCategory, sortBy]);

  const currentLightboxItem =
    lightboxIndex >= 0 ? filteredItems[lightboxIndex] : undefined;

  const likedCount = images.filter((item) => item.isLike).length;

  const toggleLike = (id: string) => {
    setImages((prevImages) =>
      prevImages.map((item) =>
        item.id === id ? { ...item, isLike: !item.isLike } : item,
      ),
    );
  };

  return (
    <main className="min-h-dvh w-full bg-gray-50 px-3 py-5 text-gray-900 sm:px-5 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="sticky top-0 z-20 mb-6 border-b border-gray-200 bg-white sm:mb-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
            <div className="flex min-w-0 items-center gap-2 py-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                <ImageIcon size={17} />
              </div>

              <span className="text-sm font-bold text-gray-900 sm:text-base">
                PhotoGallery
              </span>
            </div>

            <div className="hidden cursor-pointer items-center gap-7 sm:flex">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("gallery")}
                className={`h-12 gap-1.5 rounded-none border-0 border-b-2 px-1 py-0 text-sm hover:bg-transparent ${
                  activeTab === "gallary"
                    ? "border-blue-500 font-medium text-blue-600 hover:text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Images size={15} />
                Gallery
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("favorites")}
                className={`h-12 gap-1.5 rounded-none border-0 border-b-2 px-1 py-0 text-sm hover:bg-transparent ${
                  activeTab === "favorites"
                    ? "border-blue-500 font-medium text-blue-600 hover:text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Heart
                  size={15}
                  className={
                    activeTab === "favorites" ? "fill-red-500 text-red-500" : ""
                  }
                />
                Favorites
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                  {likedCount}
                </span>
              </Button>
            </div>

            <div className="relative sm:hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Open navigation menu"
                aria-expanded={isMenuOpen}
                className="size-10 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                {isMenuOpen ? <X size={21} /> : <MoreVertical size={21} />}
              </Button>
              {isMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setActiveTab("gallery");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-3 rounded-lg px-3 py-2.5 ${
                      activeTab === "gallary"
                        ? "bg-blue-50 font-medium text-blue-600 hover:bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Images size={17} />
                    Gallery
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setActiveTab("favorites");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full justify-between rounded-lg px-3 py-2.5 ${
                      activeTab === "favorites"
                        ? "bg-blue-50 font-medium text-blue-600 hover:bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Heart
                        size={17}
                        className={
                          activeTab === "favorites"
                            ? "fill-red-500 text-red-500"
                            : ""
                        }
                      />
                      Favorites
                    </span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                      {likedCount}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-4xl">
            Explore Beautiful Moments
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Discover and enjoy a collection of stunning images from around the
            world.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="min-w-[200px] flex-1">
            <FormField
              type="search"
              name="search"
              value={search}
              placeholder="Search by title, category or tag..."
              validate={false}
              onChange={(value) => setSearch(value)}
            />
          </div>

          <div className="w-40 cursor-pointer">
            <FormField
              type="select"
              name="category"
              value={selectedCategory}
              placeholder="Category"
              options={category.map((category) => ({
                label: category,
                value: category,
              }))}
              onChange={(value) => setSelectedCategory(value)}
            />
          </div>

          <div className="w-40">
            <FormField
              type="select"
              name="sort"
              value={sortBy}
              placeholder="Sort"
              options={sortOptions}
              onChange={(value) => setSortBy(value as SortType)}
            />
          </div>

          <Button
            type="button"
            onClick={() =>
              setActiveTab(activeTab === "favorites" ? "gallery" : "favorites")
            }
            className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm transition ${
              activeTab === "favorites"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Heart size={15} />
            {likedCount} Favorites
          </Button>
        </div>

        <div className="mb-6 flex cursor-pointer flex-wrap gap-2">
          {category.map((c) => (
            <Button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full border px-4 py-1 text-sm transition ${
                selectedCategory === c
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {c}
            </Button>
          ))}
        </div>

        <section className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item, index) => (
            <ImageCard
              key={item.id}
              item={item}
              toggleLike={toggleLike}
              onOpen={() => setLightboxIndex(index)}
            />
          ))}
        </section>
        <Lightbox
  open={lightboxIndex >= 0 && filteredItems.length > 0}
  index={Math.max(0, Math.min(lightboxIndex, filteredItems.length - 1))}
  close={() => setLightboxIndex(-1)}
  slides={filteredItems.map((item) => ({
    src: item.image,
    alt: item.title,
    title: item.title,
    description: item.category,
  }))}
  plugins={[Thumbnails, Zoom, Fullscreen, Slideshow, Counter]}  
  on={{ view: ({ index }) => setLightboxIndex(index) }}
  controller={{ closeOnBackdropClick: true }}
  render={{
    slideFooter: ({ slide }) => (
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-left text-white">
        {slide.title && (
          <p className="text-base font-semibold leading-tight">{slide.title}</p>
        )}
        {slide.description && (
          <p className="mt-0.5 text-sm text-white/80">{slide.description}</p>
        )}
      </div>
    ),
  }}
  styles={{
    root: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    container: {
      inset: "6vh 25vw",
      borderRadius: 16,
      overflow: "hidden",
    },
  }}
  toolbar={{
    buttons: [
      currentLightboxItem && (
        <Button
          key="like"
          type="button"
          variant="ghost"
          size="icon"
          aria-label={currentLightboxItem.isLike ? "Unlike" : "Like"}
          onClick={() => toggleLike(currentLightboxItem.id)}
          className="size-10 cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white"
        >
          <Heart
            size={22}
            className={
              currentLightboxItem.isLike ? "fill-red-500 text-red-500" : ""
            }
          />
        </Button>
      ),
      "close",
    ],
  }}
/>

        {filteredItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
            <ImageIcon className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="font-medium">No images found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search, category, or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ImageGallary;
