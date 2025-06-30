import React from "react";

type Props = {
  images: string[];
};

export default function ImagesGrid({ images }: Props) {
  if (images.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Generated ${idx}`}
          className="w-full h-40 object-cover rounded-lg border border-gray-700"
        />
      ))}
    </div>
  );
} 