import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyListing from "@/components/PropertyListing";

export default function Home() {
  return (
    <main className="bg-test bg-cover bg-center">
        <Navbar />
        <PropertyListing />
        <Footer />
    </main>
  );
}
