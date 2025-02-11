import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PropertyManagement from "@/components/PropertyManagement";
export default function Home() {
    return(
        <div className="flex flex-col min-h-screen bg-indigo-700">
            <Navbar />
            <main className="flex-grow py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <PropertyManagement/>
            </main>
            <Footer />
        </div>
    );}