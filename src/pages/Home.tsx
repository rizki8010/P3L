import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Class from "../components/Class";
import Instructure from "../components/InstructureCard";

import hero from "../assets/hero-image.png";
import abouthero from "../assets/abouthero.png";
import piano from "../assets/piano.png";
import keyboard from "../assets/keyboard.png";
import guitar from "../assets/guitar.png";
import biola from "../assets/biola.png";
import vokal from "../assets/vocal.png";
import drum from "../assets/drum.png";
import bass from "../assets/bass.png";
import saxophone from "../assets/saxophone.png";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  const items = [
    { title: "PIANO", image: piano },
    { title: "KEYBOARD", image: keyboard },
    { title: "GITAR", image: guitar },
    { title: "BIOLA", image: biola },
    { title: "VOKAL", image: vokal },
    { title: "DRUM", image: drum },
    { title: "BASS", image: bass },
    { title: "SAXOPHONE", image: saxophone },
  ];

  return (
    <MainLayout>
      <div className="w-full flex flex-col overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] sm:h-screen overflow-hidden pt-16 sm:pt-20">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
          >
            <img
              src={hero}
              alt="Music Class"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center sm:items-end px-4 sm:px-12 md:px-44 text-white">
            <motion.div
              className="text-center sm:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                variants={fadeInUp}
                className="text-2xl md:text-5xl lg:text-[54px] font-bold max-w-lg leading-tight"
              >
                "Wujudkan Impian Musik Anda"
              </motion.h1>
              <motion.div variants={fadeInUp}>
                <button
                  onClick={() => navigate("/registration")}
                  className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold text-sm sm:text-base cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Daftar Kursus
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mengapa Musik Section */}
        <section className="sm:mt-24 w-full py-8 sm:py-16 flex justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-10">
            {/* Left Text */}
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="tracking-widest text-red-700 text-sm md:text-lg font-semibold">
                SHEMA MUSIC DEPOK
              </h3>
              <h2 className="text-3xl md:text-[48px] font-bold mt-1 mb-1 sm:mb-4">
                MENGAPA MUSIK?
              </h2>
              <h4 className="font-semibold mb-1 sm:mb-3 text-black text-base md:text-lg italic">
                Musik Mengubah Anda, Secara Fisik dan Mental
              </h4>
              <p className="text-black text-justify text-base md:text-lg leading-relaxed">
                Musik dapat memengaruhi hidup Anda pada banyak aspek, membantu
                Anda melihat dunia dengan lebih jernih, melepaskan hal-hal yang
                tidak lagi Anda butuhkan, dan membuat Anda merasa lebih hidup.
                Sebelum mengenal apa itu musik, mungkin hari-hari Anda terasa
                sering terburu-buru dan sibuk tanpa arah yang jelas. Apa yang
                awalnya hanya bercandaan dapat menjadi burung yang melayang
                bebas ketika Anda menemukan kebebasan ekspresi dalam bermain
                musik. Mungkin pada awalnya Anda ragu, apa yang bisa dilakukan
                oleh serangkaian gerakan dan beberapa not? Namun ketika mulai
                menggenggam instrumen, pikiran bisa menjadi lebih tenang, tubuh
                lebih rileks, dan semuanya terasa lebih selaras. Sejak saat itu,
                Anda akan terus kembali pada musik, selalu menemukan kembali
                kekuatan dan kebebasan yang dibawanya bagi hidup Anda.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about")}
                className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm sm:text-base font-semibold shadow-md"
              >
                Tentang Kami
              </motion.button>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="flex-1 flex justify-center md:justify-end mt-4 md:mt-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="rounded-xl overflow-hidden shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg transform hover:-rotate-1 transition-transform duration-500">
                <img
                  src={abouthero}
                  alt="Piano Class"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Running Notes Section */}
        <section className="mt-8 sm:mt-24 w-full bg-[#8B1538] py-8 sm:py-10 flex flex-col items-center text-white overflow-hidden">
          <div className="flex gap-4 sm:gap-8 text-4xl sm:text-9xl mb-4 flex-wrap justify-center font-serif">
            {["♪", "♪", "♩", "♫", "♬", "♪", "♪", "♩"].map((note, idx) => (
              <motion.span
                key={idx}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: idx * 0.2,
                }}
                className="inline-block"
              >
                {note}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-[32px] font-light italic text-center"
          >
            "Walk Together, Learn Together, Grow Together"
          </motion.p>
        </section>

        {/* Misi Kami */}
        <section className="sm:mt-24 w-full py-8 sm:py-16 px-4 sm:px-12 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-[48px] font-bold"
              >
                MISI KAMI
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-700 max-w-3xl mx-auto leading-relaxed text-base md:text-lg mb-12"
              >
                Nilai-nilai yang kami pegang dalam setiap pembelajaran .
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12 mt-2 sm:mt-12">
                {/* Terpercaya */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4"
                  >
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path d="M17 17l-5 5-5-5m10-10l-5-5-5 5m5-5v20" />
                    </svg>
                  </motion.div>
                  <h3 className="font-bold text-base sm:text-lg">TERPERCAYA</h3>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Pengalaman lebih dari 7 tahun dalam pendidikan musik
                  </p>
                </motion.div>

                {/* Nyaman */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-4"
                  >
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path d="M12 21S5 14.5 5 9.5C5 6 7.5 4 10 4c1.5 0 2.5.75 3 1.5C13.5 4.75 14.5 4 16 4c2.5 0 5 2 5 5.5 0 5-7 11.5-7 11.5H12Z" />
                    </svg>
                  </motion.div>
                  <h3 className="font-bold text-base sm:text-lg">NYAMAN</h3>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Lingkungan belajar yang suportif dan menyenangkan
                  </p>
                </motion.div>

                {/* Terjangkau */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path d="M17 20h5V10l-8-5-8 5v10h5m6 0v-6a3 3 0 00-6 0v6" />
                    </svg>
                  </motion.div>
                  <h3 className="font-bold text-base sm:text-lg">TERJANGKAU</h3>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Biaya kursus yang kompetitif dengan kualitas terbaik
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* KURSUS YANG TERSEDIA */}
        <section className="w-full mt-12 bg-gray-200 sm:mt-24 py-16 flex justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-[48px] font-bold mb-2 tracking-wide text-center">
                KURSUS YANG TERSEDIA
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-10 text-center text-base md:text-lg">
                Pilih instrumen favorit Anda dan mulai perjalanan musik
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full lg:max-w-6xl justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                  }}
                  className="relative rounded-2xl overflow-hidden shadow-md h-24 sm:h-44 md:h-36 cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <h3 className="text-white text-xl md:text-[32px] font-semibold tracking-wide text-center drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section Kelas */}
        <section
          id="kelas"
          className="mt-12 sm:mt-24 w-full flex justify-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-5"
            >
              <h1 className="text-2xl md:text-3xl font-bold">
                Kelas yang Tersedia
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Pilih kelas musik sesuai kebutuhan dan tujuan Anda.
              </p>
            </motion.div>
            <Class />
          </div>
        </section>

        <section className="w-full flex justify-center mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="rounded-2xl text-center bg-gray-50 p-8 shadow-sm w-full"
            >
              <h2 className="text-3xl md:text-[48px] font-semibold">
                Tidak Yakin Kelas Mana yang Cocok?
              </h2>

              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Jawab beberapa pertanyaan untuk mendapatkan rekomendasi kelas
                yang tepat
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 sm:mt-6 bg-red-500 hover:bg-red-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base shadow-lg"
              >
                Dapatkan Rekomendasi Kelas
              </motion.button>
            </motion.div>
          </div>
        </section>

        <section
          id="instruktur"
          className="mt-12 sm:mt-24 w-full flex justify-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-5"
            >
              <h1 className="text-3xl md:text-[48px] font-bold">
                INSTRUKTUR BERPENGALAMAN
              </h1>
              <p className="text-gray-600 mt-2 text-base md:text-[22px]">
                Belajar dari para profesional yang berdedikasi
              </p>
            </motion.div>
            <Instructure />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
