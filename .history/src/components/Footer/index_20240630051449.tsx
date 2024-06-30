export default function Footer() {
  return (
    <footer className="bg-gray-100 p-6">
      <div className="container mx-auto text-center">
        <p className="text-black text-sm">
          &copy; {new Date().getFullYear()} Ethereal. All rights reserved by XX.
        </p>
      </div>
    </footer>
  );
}
