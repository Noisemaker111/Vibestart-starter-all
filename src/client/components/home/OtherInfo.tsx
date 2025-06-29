import ServicesProvided from "@client/components/ServicesProvided";
import React from "react";

interface RealProject {
  name: string;
  description: string;
  time: string;
  revenue: string;
}

interface Props {
  realProjects: RealProject[];
}

export default function VibeStartOtherInfo({ realProjects }: Props) {
  return (
    <>
      {/* Services Provided Section */}
      <ServicesProvided />

      {/* Real Projects Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Apps. Real Revenue. Real Fast.</h2>
            <p className="text-gray-400">These were all someone's "weekend project" with VibeStart</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {realProjects.map((project, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.time}</span>
                    <span className="text-green-400 font-semibold">{project.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Stop Learning. Start Shipping.</h2>

          <div className="space-y-6 text-lg text-gray-400">
            <p>You don't need another JavaScript course. You don't need to master React hooks. You don't need to understand webpack.</p>
            <p className="text-xl text-white font-medium">You need your idea live, getting feedback, making money.</p>
            <p>VibeStart + AI = Your personal senior developer who already knows the entire codebase. Just describe what you want to build.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
              <h3 className="text-red-400 font-semibold mb-3">Without VibeStart</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• 2 weeks setting up auth</li>
                <li>• 1 week configuring database</li>
                <li>• 3 days on file uploads</li>
                <li>• Endless debugging sessions</li>
                <li>• Ship in 2-3 months (maybe)</li>
              </ul>
            </div>
            <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
              <h3 className="text-green-400 font-semibold mb-3">With VibeStart</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Auth works instantly</li>
                <li>• Database ready to go</li>
                <li>• Uploads pre-configured</li>
                <li>• AI writes the boilerplate</li>
                <li>• Ship today, iterate tomorrow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership & Differentiator Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Own&nbsp;Your&nbsp;Stack—No Black&nbsp;Boxes</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-10">
            Tools like Replit, Vercel&nbsp;v0, Convex or Lovable are fantastic for rapid tinkering—but their databases, auth layers and hosting stay locked behind closed dashboards. VibeStart flips the script by <strong>open-sourcing the entire production starter</strong>—database, auth, uploads, UI and tests—into <em>your</em> GitHub repository from the very first commit.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Traditional AI Builders</h3>
              <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
                <li>Private DB tables you can't export</li>
                <li>Usage-based billing on every message/API call</li>
                <li>No direct access to infra—migration is painful</li>
                <li>Proprietary components &amp; closed-source code</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 rounded-2xl p-8 border border-purple-700 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">VibeStart Approach</h3>
              <ul className="space-y-2 text-purple-200 text-sm list-disc pl-4">
                <li>PostgreSQL schema lives in <code>src/server/db/schema.ts</code></li>
                <li>Supabase auth—bring your own keys, zero vendor lock-in</li>
                <li>All source in a public MIT-licensed repo <em>you</em> control</li>
                <li>Scale anywhere—Vercel, Fly.io, bare metal—no rewrite</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-500 mt-10 text-sm max-w-3xl mx-auto">
            Build on a stack you fully understand today and can scale tomorrow—without paying per-message fees or reverse-engineering someone else's infrastructure.
          </p>
        </div>
      </section>
    </>
  );
} 