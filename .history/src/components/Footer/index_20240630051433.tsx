export default function Footer() {
  return (
    <footer className="bg-indigo-800 p-6">
      <div className="container mx-auto text-center">
        <p className="text-white text-sm">
          &copy; {new Date().getFullYear()} Ethereal. All rights reserved by XX.
        </p>
      </div>
    </footer>
  );
}