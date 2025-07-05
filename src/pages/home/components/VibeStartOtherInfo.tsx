import React from "react";

export interface RealProject {
  name: string;
  description: string;
  time: string;
  revenue: string;
}

export default function VibeStartOtherInfo({ realProjects }: { realProjects: RealProject[] }) {
  return (
    <>
      {/* Real Projects Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Apps. Real Revenue. Real Fast.</h2>
            <p className="text-gray-500">These were all someone's "weekend project" with VibeStart</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {realProjects.map((project, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
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
          <h2 className="text-4xl font-bold mb-8">Stop Learning. Start Vibing</h2>

          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
            <p>You don't need another JavaScript course. You don't need to master React hooks. You don't need to understand webpack.</p>
            <p className="text-xl text-white font-medium">You need your idea live, getting feedback, making money.</p>
            <p>VibeStart + AI = Your personal senior developer who already knows the entire codebase. Just describe what you want to build.</p>
          </div>
        </div>
      </section>
    </>
  );
} 