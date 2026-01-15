import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Navbar Fixed */}
      <Navbar />

      {/* Wrapper halaman */}
      <main className="w-full overflow-x-hidden min-h-screen mx-auto lg:mb-20 md:mb-10 sm:mb-5">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
