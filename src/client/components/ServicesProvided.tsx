import React from "react";

interface ServiceCategory {
  category: string;
  items: string[];
}

/**
 * ServicesProvided lists every out-of-the-box integration that ships with JonStack
 * so users instantly understand which moving parts are already wired up and ready
 * for AI-driven customisation. Shown on the homepage below the hero section.
 */
export default function ServicesProvided() {
  const services: ServiceCategory[] = [
    {
      category: "Front-end & UI",
      items: ["React 19", "Tailwind CSS 4", "React Router 7"],
    },
    {
      category: "Build & Tooling",
      items: [
        "Vite 6",
        "vite-tsconfig-paths",
        "TypeScript 5",
        "Node.js 18+",
      ],
    },
    {
      category: "Hosting & Deployment",
      items: ["Vercel"],
    },
    {
      category: "Database & Auth",
      items: [
        "Supabase (PostgreSQL)",
        "Drizzle ORM 0.44",
        "drizzle-kit",
      ],
    },
    {
      category: "File Uploads",
      items: ["UploadThing"],
    },
    {
      category: "OAuth Providers",
      items: ["Google", "GitHub"],
    },
    {
      category: "Developer Experience",
      items: ["Cursor IDE"],
    },
    {
      category: "Planned AI",
      items: ["T3Chat (bare-bones)"],
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900/0 via-gray-900/10 to-gray-900/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Services Included – <span className="text-purple-400">Ready on Day 1</span>
        </h2>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
          Download the starter kit and every service below is already configured. Change
          anything with a single prompt inside Cursor.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(({ category, items }) => (
            <div
              key={category}
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-300">
                {category}
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm list-disc list-inside">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 