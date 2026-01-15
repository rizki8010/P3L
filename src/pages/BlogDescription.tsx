import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import blogDummy from "../data/blogDummy";

const BlogDescription = () => {
  const { id } = useParams();

  const blog = blogDummy.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Blog tidak ditemukan</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mx-auto px-24 py-12 mt-20">
        {/* Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />

        {/* Date */}
        <p className="text-sm text-gray-400 mb-2">{blog.date}</p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 mb-6">{blog.excerpt}</p>

        {/* Description */}
        <div className="text-gray-700 leading-relaxed text-justify">
          {blog.description}
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogDescription;
