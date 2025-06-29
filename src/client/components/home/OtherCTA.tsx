import React from "react";
import { Link } from "react-router";

interface Props {
  buildLink: string;
  onClick?: () => void;
}

export default function HomeOtherCTA({ buildLink, onClick }: Props) {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-12 border border-gray-800">
          <h2 className="text-3xl font-bold mb-4">Your competitors are shipping. Are you?</h2>
          <p className="text-gray-400 mb-8">Every day you spend learning is a day someone else is building your idea.</p>
          <Link
            to={buildLink}
            onClick={onClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Get Building
          </Link>
        </div>
      </div>
    </section>
  );
} 