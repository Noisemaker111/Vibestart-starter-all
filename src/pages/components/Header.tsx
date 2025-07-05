import { Link } from "react-router";

export function Header() {
  return (
    <header className="bg-gray-900 sticky top-0 z-50">
      <div className="mx-auto px-4 max-w-7xl h-16 flex items-center">
        <Link to="/" className="text-white text-xl font-bold">
          VibeStart
        </Link>
      </div>
    </header>
  );
} 