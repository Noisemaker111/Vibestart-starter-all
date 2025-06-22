import { useState } from "react";
import type { Route } from "./+types/features";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Features - JonStack" },
    { name: "description", content: "Everything included in JonStack starter kit" },
  ];
}

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: "auth",
      category: "Authentication",
      title: "Complete Auth System",
      icon: "🔐",
      description: "Production-ready authentication with Supabase",
      benefits: [
        "Social logins (Google, GitHub, etc.)",
        "Email/password authentication",
        "Magic link support",
        "Row-level security",
        "Session management",
        "Protected routes"
      ],
      code: `// Using auth in your components
import { useAuth } from "@client/context/AuthContext";

function Profile() {
  const { session } = useAuth();
  return <h1>Welcome {session?.user.email}!</h1>;
}`
    },
    {
      id: "database",
      category: "Database",
      title: "Type-Safe Database",
      icon: "💾",
      description: "PostgreSQL with Drizzle ORM for bulletproof data operations",
      benefits: [
        "Full TypeScript support",
        "Auto-generated types",
        "Migration management",
        "Query builder",
        "Relationship handling",
        "Performance optimized"
      ],
      code: `// Type-safe database queries
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.role, 'admin'))
  .orderBy(desc(usersTable.createdAt));`
    },
    {
      id: "uploads",
      category: "File Management",
      title: "Seamless File Uploads",
      icon: "📤",
      description: "Drag-and-drop file uploads with UploadThing",
      benefits: [
        "Drag & drop interface",
        "Progress tracking",
        "Image optimization",
        "Secure storage",
        "CDN delivery",
        "Multiple file types"
      ],
      code: `// Simple file upload component
<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Upload complete:", res);
  }}
/>`
    },
    {
      id: "styling",
      category: "UI/UX",
      title: "Modern Styling System",
      icon: "🎨",
      description: "Tailwind CSS v4 with dark mode and custom components",
      benefits: [
        "Automatic dark mode",
        "Responsive by default",
        "Custom components",
        "Utility-first CSS",
        "Zero runtime overhead",
        "VS Code IntelliSense"
      ],
      code: `// Dark mode automatically adapts
<div className="bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white 
  shadow-lg hover:shadow-xl transition-all">
  Beautiful, responsive components
</div>`
    },
    {
      id: "routing",
      category: "Framework",
      title: "Full-Stack React Router",
      icon: "🚀",
      description: "React Router v7 with SSR and file-based routing",
      benefits: [
        "Server-side rendering",
        "Type-safe routing",
        "Data loaders",
        "Form actions",
        "Error boundaries",
        "Hot module replacement"
      ],
      code: `// Type-safe route with data loading
export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProject(params.id);
  return { project };
}

export default function Project({ loaderData }) {
  const { project } = loaderData;
  return <h1>{project.name}</h1>;
}`
    },
    {
      id: "typescript",
      category: "Developer Experience",
      title: "End-to-End TypeScript",
      icon: "📘",
      description: "100% TypeScript with strict mode enabled",
      benefits: [
        "Full type safety",
        "IntelliSense everywhere",
        "Catch errors early",
        "Better refactoring",
        "Self-documenting code",
        "Shared types"
      ],
      code: `// Shared types between client and server
export type User = SelectUser; // From Drizzle
export type NewUser = InsertUser;

// Type-safe API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}`
    }
  ];

  const additionalFeatures = [
    { icon: "⚡", name: "Hot Module Replacement", desc: "Instant updates without losing state" },
    { icon: "📱", name: "Mobile Responsive", desc: "Looks great on all devices" },
    { icon: "🔍", name: "SEO Optimized", desc: "Meta tags and SSR for better rankings" },
    { icon: "🚦", name: "Error Handling", desc: "Graceful error boundaries" },
    { icon: "📊", name: "Performance Monitoring", desc: "Built-in Web Vitals tracking" },
    { icon: "🔧", name: "Developer Tools", desc: "ESLint, Prettier, and more" },
    { icon: "🐳", name: "Docker Ready", desc: "Containerize with one command" },
    { icon: "📦", name: "Optimized Builds", desc: "Tree-shaking and code splitting" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to build modern web applications. 
              No compromises, no missing pieces.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                {/* Feature Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Benefits List */}
                  <ul className="space-y-2 mb-4">
                    {feature.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1">
                    {selectedFeature === feature.id ? 'Hide' : 'Show'} details
                    <svg className={`w-4 h-4 transition-transform ${selectedFeature === feature.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* Expanded Content */}
                {selectedFeature === feature.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="p-6">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">All Benefits:</h4>
                      <ul className="space-y-2 mb-6">
                        {feature.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Example Code:</h4>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs">
                          <code>{feature.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              And So Much More
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Every detail has been carefully considered
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get started with JonStack and ship your next project faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/yourusername/jonstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get Started Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white/50 rounded-xl hover:bg-white/10 transition-colors"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 