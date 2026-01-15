import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Instructor {
  id: string;
  name: string;
  specialization?: string;
  experience?: string;
  education?: string;
  bio?: string;
  image?: string;
}

const InstructorCarousel = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);

  // Fetch instructors from API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          "https://api.shemamusic.my.id/api/booking/available-instructors"
        );
        const result = await response.json();

        if (
          result.success &&
          result.data &&
          Array.isArray(result.data.instructors)
        ) {
          setInstructors(result.data.instructors);
        }
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
        setInstructors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Detect breakpoint (SM vs MD+)
  useEffect(() => {
    const updateVisible = () => {
      setVisible(window.innerWidth >= 768 ? 2 : 1);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, instructors.length - visible);

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  // Get default image if not provided
  const getInstructorImage = (instructor: Instructor, idx: number) => {
    if (instructor.image) return instructor.image;

    // Default placeholder images
    const defaultImages = [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    ];
    return defaultImages[idx % defaultImages.length];
  };

  if (isLoading) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">Memuat data instruktur...</p>
        </div>
      </div>
    );
  }

  if (instructors.length === 0) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">
            Tidak ada instruktur yang tersedia saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-10">
      {/* NAV */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={next}
        disabled={index === maxIndex}
        className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight />
      </button>

      {/* VIEWPORT */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / visible)}%)`,
          }}
        >
          {instructors.map((item, i) => (
            <div key={item.id} className="w-full md:w-1/2 flex-shrink-0 px-3">
              <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-6 shadow-md h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>

                  {item.specialization && (
                    <span className="inline-block mt-1 bg-red-700 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {item.specialization}
                    </span>
                  )}

                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    {item.experience && (
                      <p>
                        <strong>Pengalaman:</strong> {item.experience}
                      </p>
                    )}
                    {item.specialization && (
                      <p>
                        <strong>Spesialisasi:</strong> {item.specialization}
                      </p>
                    )}
                    {item.education && (
                      <p>
                        <strong>Pendidikan:</strong> {item.education}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {item.bio ||
                      "Passionate dalam membimbing siswa menemukan potensi musik mereka dan berkembang menjadi musisi yang percaya diri."}
                  </p>
                </div>

                <img
                  src={getInstructorImage(item, i)}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorCarousel;
