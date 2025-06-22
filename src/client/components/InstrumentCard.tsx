import { useState } from "react";

interface InstrumentCardProps {
  id: number;
  name: string;
  imageUrl: string | null;
  onDelete: (id: number) => void;
}

export function InstrumentCard({ id, name, imageUrl, onDelete }: InstrumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  }

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-gray-400 dark:text-gray-500">No image</p>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/30 group/delete disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/delete:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  );
} 