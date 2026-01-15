import { useEffect, useRef, useState } from "react";
import { Award, Lightbulb, Users } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import abouthero from "../assets/aboutheroa.png";

const About = () => {
  // Load semua gambar dari folder assets/siswa
  const studentImages = import.meta.glob(
    "../assets/siswa/*.{png,jpg,jpeg,svg,webp}",
    { eager: true }
  );

  const students = Object.keys(studentImages).map((path, index) => ({
    id: index + 1,
    name: `Siswa ${index + 1}`,
    image: (studentImages[path] as any).default || studentImages[path],
  }));

  // Duplikasi list siswa agar marquee tidak terputus
  const marqueeStudents = [...students, ...students];

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {/* HERO / BANNER */}
        <section className="relative h-[300px] md:h-[380px] w-full pt-16 sm:pt-20">
          <img
            src={abouthero}
            alt="About Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wide">
              Tentang Kami
            </h1>
          </div>
        </section>

        {/* Perjalanan Kami Section */}
        <section className="mx-auto px-4 md:px-24 py-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase">
            PERJALANAN KAMI DALAM MEMBANGUN KEPERCAYAAN
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Perjalanan PT. Pusat Solis Dapick Dengan akses kepada tim "Certified
            Music Teacher" yang terampil dan berpengalaman, kami berkomitmen
            memberikan pengalaman belajar musik yang mendalam. Kami menempatkan
            belajar kepada kolaborasi dan inspirasi untuk pengembangan talent
            yang berbakat. Guru yang berdedikasi menggunakan Program Afiliasi
            Kami Gabunglah dengan mitra yang direkomendasikan oleh Guru kami
            yang mampu memberikan motivasi dan mendorong setiap siswa untuk
            mencapai potensi maksimal mereka dengan penuh keyakinan.
          </p>

          {/* Membangun Momen Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600"
                alt="Music Learning"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase">
                MEMBANGUN MOMEN, MENGABADIKAN KENANGAN
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Musik bukan hanya tentang not dan melodi — tetapi tentang
                menciptakan momen bermakna. Kami percaya dalam memupuk
                lingkungan dimana setiap siswa, terlepas dari usia atau tingkat
                pengalaman, dapat menemukan kebahagiaan dalam belajar musik.
                Dari pelajaran individu hingga pertunjukkan grup yang meriah,
                kami menciptakan kesempatan bagi siswa untuk terhubung,
                berkolaborasi, dan membangun kenangan yang akan bertahan seumur
                hidup.
              </p>
            </div>
          </div>

          {/* Kepercayaan dalam Kualitas Section */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 uppercase">
            KEPERCAYAAN DALAM KUALITAS KAMI
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 border border-red-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-orange-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Pengalaman
              </h4>
              <p className="text-gray-600 text-sm">
                Lebih dari 7 tahun mengajarkan dan menginspirasi siswa dengan
                metode pembelajaran yang terbukti efektif dan menyenangkan
              </p>
            </div>
            <div className="text-center p-6 border border-red-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-orange-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Kualitas</h4>
              <p className="text-gray-600 text-sm">
                Instruktur musik berkualitas dan berpengalaman dengan
                sertifikasi yang terakreditasi dan teruji
              </p>
            </div>
            <div className="text-center p-6 border border-red-500 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Lightbulb className="w-12 h-12 text-orange-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Inovasi</h4>
              <p className="text-gray-600 text-sm">
                Mengintegrasikan dengan pembelajaran modern yang disesuaikan
                dengan kebutuhan setiap siswa
              </p>
            </div>
          </div>

          {/* Siswa Kami Marquee Section */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10 uppercase">
            SISWA KAMI
          </h2>
          <div className="relative mb-20 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {marqueeStudents.map((student, index) => (
                <div
                  key={`${student.id}-${index}`}
                  className="px-6 flex-shrink-0"
                >
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-orange-500 shadow-md">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temukan Kami Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase">
                TEMUKAN KAMI DI SINI
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Terbuka Di Pusat Kota Depok Dengan akses kepada tim "Certified
                Music Teacher" yang terampil dan berpengalaman, kami berkomitmen
                memberikan pengalaman belajar musik yang mendalam.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami menjunjung tinggi nilai-nilai kesopanan, kejujuran. Kami
                berharap bahwa suasana belajar yang positif ini akan membantu
                para siswa berkembang tidak hanya sebagai musisi tetapi juga
                sebagai individu yang percaya diri dan kreatif.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-96 border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126891.85400585255!2d106.74668704323267!3d-6.34598826725287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec0904d0c9b7%3A0x6a1a1005a0d33b4d!2sDepok%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1711111111111!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
