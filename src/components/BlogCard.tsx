import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string | number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export const BlogCard = ({
  id,
  title,
  excerpt,
  date,
  image,
}: BlogCardProps) => {
  const limitWords = (text: string, limit = 10) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <Link to={`/blog/${id}`} className="w-full flex justify-center">
      <div
        className="
          bg-white
          rounded-xl
          shadow-md
          overflow-hidden
          flex
          flex-col
          hover:shadow-lg
          transition
          w-full
          max-w-[460px]
          h-[420px]
        "
      >
        {/* IMAGE */}
        <div className="w-full h-[180px] overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 min-h-[56px]">
              {title}
            </h3>

            <p className="text-sm text-gray-600 min-h-[60px]">
              {limitWords(excerpt, 10)}
            </p>
          </div>

          <div className="mt-auto text-xs text-gray-400">{date}</div>
        </div>
      </div>
    </Link>
  );
};
