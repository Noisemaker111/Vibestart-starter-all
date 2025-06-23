import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "JonStack - Ship Your Next Project Faster" },
    { name: "description", content: "The ultimate starter kit with all integrations ready. Just start coding." },
  ];
}

export default function Home() {
  const features = [
    {
      icon: "⚡",
      title: "Ready in 60 Seconds",
      description: "Clone, install, and start building. No configuration headaches."
    },
    {
      icon: "🔐",
      title: "Auth That Just Works",
      description: "Supabase auth pre-configured with social logins and protected routes"
    },
    {
      icon: "💾",
      title: "Database Ready",
      description: "PostgreSQL + Drizzle ORM setup with migrations and type safety"
    },
    {
      icon: "📤",
      title: "File Uploads Built-in",
      description: "UploadThing integration for hassle-free file handling"
    },
    {
      icon: "🎨",
      title: "Beautiful by Default",
      description: "Tailwind CSS v4 with production-ready components"
    },
    {
      icon: "🚀",
      title: "Deploy Anywhere",
      description: "Optimized for Vercel, Netlify, or any Node.js host"
    }
  ];

  const techStack = [
    { name: "React Router v7", description: "Full-stack framework" },
    { name: "TypeScript", description: "End-to-end type safety" },
    { name: "Supabase", description: "Auth & real-time database" },
    { name: "Drizzle ORM", description: "Type-safe SQL" },
    { name: "Tailwind CSS v4", description: "Modern styling" },
    { name: "UploadThing", description: "File uploads" },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Full-Stack Developer",
      quote: "I shipped my MVP in a weekend. Everything I needed was already there."
    },
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      quote: "Saved me weeks of setup time. Authentication alone would've taken days."
    },
    {
      name: "Mike Rodriguez",
      role: "Freelancer",
      quote: "My go-to starter for client projects. Professional results, fast delivery."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Production-ready starter kit
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              JonStack
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-8">
              Stop Configuring. Start Building.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              The modern full-stack starter with auth, database, uploads, and gorgeous UI already wired up. 
              Skip the <em>four-year</em> grind of mastering HTML, CSS, and JavaScript just to see your idea on-screen—JonStack delivers the building blocks so you can jump straight to prototyping and iteration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ideas"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Ideas
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="https://github.com/Noisemaker111/jonstack" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Get Started
              </a>
            </div>

            {/* Quick Install */}
            <div className="mt-12 max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick start:</p>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-left">
                <code className="text-green-400 text-sm">
                  npx create-jonstack-app my-app && cd my-app && npm run dev
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            JonStack vs The Rest
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12">
            Popular stacks like <strong>T3</strong> and <strong>T4</strong> are fantastic—if you already know your way around complex tooling. JonStack is different: it's <span className="font-semibold">AI-first</span> and <span className="font-semibold">beginner-friendly</span>. Speak to the IDE, follow autogenerated best-practice rules, and ship products without memorising a single config flag.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">AI-First Workflow</h3>
              <p className="text-gray-600 dark:text-gray-400">Chat with JonStack's integrated AI IDE to scaffold pages, write queries and keep your codebase consistent.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Zero-Config Dev Env</h3>
              <p className="text-gray-600 dark:text-gray-400">Clone → install → <code>npm run dev</code>. No Prisma generators, monorepo wrangling or obscure config.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Made for Idea People</h3>
              <p className="text-gray-600 dark:text-gray-400">Focus on your idea, not boilerplate. JonStack handles auth, database, uploads and styling out-of-the-box so you can iterate fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need, Nothing You Don't
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Carefully selected tools that work perfectly together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Best-in-class tools, perfectly integrated
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Developers Love JonStack
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join hundreds of developers shipping faster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Fast Section */}
      <section className="py-20 lg:py-32 bg-gray-100 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Build a Feature in Minutes, Not Days ⚡️
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            JonStack removes all the plumbing so you can focus on what makes your product unique. Add auth, database tables,
            or file uploads with just a few lines of code.
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 text-left shadow-xl">
            <pre className="text-sm overflow-x-auto">
{`// Add a new table
await db.insert(projectsTable).values({
  name: "My Awesome Project",
  user_id: session.user.id,
});

// Fetch projects
const projects = await db.select().from(projectsTable);

// Protect route
if (!session) throw new Response("Unauthorized", { status: 401 });`}
            </pre>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Ship Your Next Project?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Stop wasting time on boilerplate. Start building features that matter.
            Get JonStack and ship faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Noisemaker111/jonstack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get JonStack Free
              <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <Link
              to="/docs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              View Documentation
            </Link>
          </div>
          <p className="mt-6 text-gray-400">
            MIT Licensed • Free Forever • No Attribution Required
          </p>
        </div>
      </section>
    </main>
  );
} 