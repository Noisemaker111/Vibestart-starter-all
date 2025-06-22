import { useEffect, useState } from "react";
import { supabase } from "@shared/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AddInstrumentCard } from "@client/components/AddInstrumentCard";
import { InstrumentCard } from "@client/components/InstrumentCard";
import { useAuth } from "@client/context/AuthContext";
import type { Route } from "./+types/showcase";

// Example project data for showcase
interface Project {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  demo_url?: string;
  github_url?: string;
  tech_stack?: string[];
  created_at?: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Showcase - JonStack Demo" },
    { name: "description", content: "See what you can build with JonStack" },
  ];
}

export default function Showcase() {
  const { session, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'auth' | 'database' | 'upload' | 'ui'>('auth');

  // Demo projects data
  const demoProjects: Project[] = [
    {
      id: 1,
      name: "Task Management App",
      description: "A Trello-like board built with JonStack's real-time features",
      image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      tech_stack: ["React Router", "Supabase", "Tailwind CSS"],
      demo_url: "#",
      github_url: "#"
    },
    {
      id: 2,
      name: "E-commerce Starter",
      description: "Full shopping cart with Stripe integration",
      image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      tech_stack: ["TypeScript", "Drizzle ORM", "Stripe"],
      demo_url: "#",
      github_url: "#"
    },
    {
      id: 3,
      name: "Social Media Dashboard",
      description: "Analytics dashboard with beautiful charts",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      tech_stack: ["React", "Recharts", "PostgreSQL"],
      demo_url: "#",
      github_url: "#"
    }
  ];

  const features = {
    auth: {
      title: "Authentication",
      description: "Supabase Auth with social providers",
      icon: "🔐"
    },
    database: {
      title: "Database",
      description: "PostgreSQL with Drizzle ORM",
      icon: "💾"
    },
    upload: {
      title: "File Uploads",
      description: "Drag & drop with UploadThing",
      icon: "📤"
    },
    ui: {
      title: "UI Components",
      description: "Beautiful, accessible components",
      icon: "🎨"
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
              <svg className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Loading Demo...</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            JonStack Live Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the power of JonStack. This entire showcase is built with the starter kit.
            {!session && " Sign in to try the authenticated features."}
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(features).map(([key, feature]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="text-xl">{feature.icon}</span>
              <span>{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Feature Demos */}
        <div className="mb-12">
          {activeTab === 'auth' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {features.auth.icon} Authentication Demo
              </h2>
              {session ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 font-medium">✓ You're authenticated!</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Signed in as: {session.user?.email}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="font-semibold mb-3">Session Details:</h3>
                    <pre className="text-xs overflow-auto p-3 bg-gray-900 dark:bg-black text-gray-300 rounded">
{JSON.stringify({
  user_id: session.user?.id,
  email: session.user?.email,
  provider: session.user?.app_metadata?.provider,
  created_at: session.user?.created_at
}, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                    Try the authentication system. Sign up or sign in to see protected features.
                  </p>
                  <Auth 
                    supabaseClient={supabase} 
                    appearance={{ 
                      theme: ThemeSupa,
                      style: {
                        button: { borderRadius: '0.75rem', fontWeight: '600' },
                        input: { borderRadius: '0.75rem' },
                        container: { gap: '0.5rem' }
                      }
                    }}
                    providers={['google', 'github']}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {features.database.icon} Database Demo
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-semibold mb-3">Drizzle ORM Schema Example:</h3>
                  <pre className="text-sm overflow-auto p-4 bg-gray-900 dark:bg-black text-gray-300 rounded">
{`export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  image_url: text('image_url'),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});`}
                  </pre>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Type Safety</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Full TypeScript support with auto-generated types from your schema
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Migrations</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      Database migrations handled automatically with Drizzle Kit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {features.upload.icon} File Upload Demo
              </h2>
              {session ? (
                <div className="max-w-2xl mx-auto">
                  <AddInstrumentCard 
                    onSubmit={async (name, imageUrl) => {
                      console.log('Demo upload:', { name, imageUrl });
                      alert(`File uploaded successfully!\n\nName: ${name}\nURL: ${imageUrl}`);
                    }}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                    This uses the same upload component from the starter kit. Try it out!
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">Sign in to try the file upload feature</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ui' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {features.ui.icon} UI Components Demo
              </h2>
              <div className="grid gap-8">
                {/* Example Components */}
                <div>
                  <h3 className="font-semibold mb-4">Button Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Primary
                    </button>
                    <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                      Secondary
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      Outline
                    </button>
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      Ghost
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Card Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {demoProjects.map((project) => (
                      <div key={project.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                        <div className="flex gap-2">
                          {project.tech_stack?.slice(0, 2).map(tech => (
                            <span key={tech} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Example Projects Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Built with JonStack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {project.tech_stack?.slice(0, 2).map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={project.demo_url} className="text-blue-600 hover:text-blue-700 text-sm">
                        Demo
                      </a>
                      <a href={project.github_url} className="text-gray-600 hover:text-gray-700 text-sm">
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 