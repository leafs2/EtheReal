import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PropertyManagement from "@/components/PropertyManagement";

export default function Home() {
    return(
        <main className="bg-test bg-cover bg-center">
            <Navbar />
            <PropertyManagement/>
            <Footer />
        </main>
    )
}