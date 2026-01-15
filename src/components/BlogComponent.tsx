import React from "react";
import { useNavigate } from "react-router-dom";

interface BlogComponentProps {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const BlogComponent: React.FC<BlogComponentProps> = ({
  id,
  title,
  excerpt,
  date,
  image,
}) => {
  const navigate = useNavigate();

  const limitWords = (text: string, limit = 10) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div
      onClick={() => navigate(`/blog/${id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full
                 hover:shadow-lg transition cursor-pointer group"
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title & Excerpt */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 min-h-[56px]">
            {title}
          </h3>

          <p className="text-sm text-gray-600 min-h-[60px]">
            {limitWords(excerpt, 10)}
          </p>
        </div>

        {/* Date */}
        <div className="mt-auto text-xs text-gray-400">{date}</div>
      </div>
    </div>
  );
};

export default BlogComponent;
