import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  count?: number;
};

const ImageGallarySkeleton = ({ count = 10 }: Props) => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <section
        aria-busy="true"
        aria-label="Loading images"
        className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-2"
          >
            <Skeleton
              height={0}
              borderRadius={8}
              style={{ paddingTop: "100%", display: "block" }}
            />
            <Skeleton height={14} width="75%" className="mt-3" />
            <Skeleton height={12} width="45%" className="mt-2" />
          </div>
        ))}
      </section>
    </SkeletonTheme>
  );
};

export default ImageGallarySkeleton;