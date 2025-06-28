import type { AvailablePlatformKey } from "@shared/availablePlatforms";

export interface AppIdea {
  idea: string;
  integrations: string[];
  platform: AvailablePlatformKey;
}

export const appIdeas: AppIdea[] = [
  {
    "idea": "A website for tracking personal finance, categorizing expenses, and setting budgets.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications"]
  },
  {
    "idea": "An online platform for discovering and reviewing local restaurants, complete with user-submitted photos and ratings.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "uploads"]
  },
  {
    "idea": "A collaborative web application where users can brainstorm and organize ideas using a virtual whiteboard.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "An e-commerce site specializing in unique, handcrafted artisan goods.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "uploads"]
  },
  {
    "idea": "A community forum focused on niche hobbies, allowing users to share tips, projects, and connect with like-minded individuals.",
    "platform": "web",
    "integrations": ["analytics", "database", "discord", "notifications", "realtime"]
  },
  {
    "idea": "A web tool that uses AI to summarize long articles or documents into concise bullet points.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A platform for managing small sports leagues, including scheduling, team rosters, and score tracking.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An online marketplace for renting out tools and equipment between neighbors.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications", "uploads"]
  },
  {
    "idea": "A developer portfolio builder that integrates directly with GitHub to showcase projects.",
    "platform": "web",
    "integrations": ["analytics", "database", "github", "notifications", "uploads"]
  },
  {
    "idea": "A personal journaling website with AI prompts to help users reflect and generate entries.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A recipe sharing platform where users can upload their own recipes and discover new ones based on ingredients or dietary preferences.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "uploads"]
  },
  {
    "idea": "A language exchange website offering real-time text and voice chat with AI translation assistance.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "realtime"]
  },
  {
    "idea": "An online booking system for local service providers, such as barbers, therapists, or dog walkers.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications", "uploads"]
  },
  {
    "idea": "A virtual book club platform with discussion forums, reading schedules, and AI-generated summaries.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A task management and habit tracker website with customizable goals and progress visualizations.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "A creative writing assistant that uses AI to suggest plot points, character names, and stylistic improvements.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A platform for managing small rental properties, including tenant communication, rent collection, and maintenance requests.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications", "uploads"]
  },
  {
    "idea": "A hiking trail discovery website with user-submitted reviews, photos, and interactive maps.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps"]
  },
  {
    "idea": "An online platform for crowdfunding personal projects or creative endeavors.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications", "uploads"]
  },
  {
    "idea": "A live streaming platform for independent musicians to perform and interact with their audience.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "realtime"]
  },
  {
    "idea": "A secure online document sharing and collaboration tool with version control.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "A personalized news aggregator that curates articles based on user interests using AI.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "A platform for organizing and managing virtual study groups, with shared notes and video conferencing.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered cover letter and resume generator tailored to specific job descriptions.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A subscription management website to track all your recurring payments and trial periods.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications"]
  },
  {
    "idea": "A code snippet manager and sharing platform for developers.",
    "platform": "web",
    "integrations": ["analytics", "database", "github", "uploads"]
  },
  {
    "idea": "A personalized fitness and workout planner with AI-generated routines.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "An online ticketing system for small events or local attractions.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications"]
  },
  {
    "idea": "A virtual pet simulation game with real-time interactions.",
    "platform": "web",
    "integrations": ["analytics", "database", "realtime", "uploads"]
  },
  {
    "idea": "A career guidance platform that uses AI to recommend career paths and learning resources based on skills.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A platform for selling and buying digital art and NFTs, integrating with a blockchain.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "solana", "uploads"]
  },
  {
    "idea": "An AI-powered chatbot for customer support that learns from past interactions.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "A collaborative storytelling website where users can contribute to ongoing narratives.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "A product review aggregation site for electronics, featuring user ratings and expert analyses.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications"]
  },
  {
    "idea": "An online ideation tool that helps teams generate new business ideas using AI prompts and frameworks.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A website for creating custom greeting cards and invitations with AI-generated text options.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A peer-to-peer tutoring platform with integrated video calls and scheduling.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered diet and meal planning website based on user health goals and dietary restrictions.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A platform for generating creative prompts for artists, writers, and designers using AI.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time public transport tracker with estimated arrival times and route maps.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "notifications"]
  },
  {
    "idea": "An AI-driven personal shopping assistant that suggests products based on user style and preferences.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A platform for selling digital courses and workshops with integrated payment processing.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "uploads"]
  },
  {
    "idea": "A personalized travel itinerary planner that uses AI to suggest attractions, restaurants, and routes.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A virtual escape room game playable in real-time with friends.",
    "platform": "web",
    "integrations": ["analytics", "database", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered academic research assistant that helps find relevant papers and summarize key findings.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A website for generating unique business names and slogans using AI.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A live polling and Q&A platform for virtual events and presentations.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered platform for generating personalized workout music playlists.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A web application for creating and managing fantasy sports leagues.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A collaborative photo album and sharing website with geographic tagging.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "uploads"]
  },
  {
    "idea": "An AI-driven platform for generating social media content and post ideas.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "A version control system for non-code assets, like design files or documents, with GitHub integration.",
    "platform": "web",
    "integrations": ["analytics", "database", "github", "uploads"]
  },
  {
    "idea": "A real-time whiteboard for remote teams to sketch and collaborate on ideas.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "A simple invoice generator and tracker for freelancers.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications"]
  },
  {
    "idea": "An AI-powered smart home dashboard for managing connected devices.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A web platform for generating personalized bedtime stories for children using AI.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "An online platform for creating custom surveys and polls with data visualization.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A real-time incident management dashboard for IT teams.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered tool for generating creative marketing copy for advertisements and campaigns.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A platform for online portfolio building for creatives, allowing image and video uploads.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "An AI-driven sentiment analysis tool for social media posts.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A collaborative music playlist creation and sharing website.",
    "platform": "web",
    "integrations": ["analytics", "database", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered tool for generating personalized study guides and flashcards.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A web-based tool for converting various file formats with drag-and-drop functionality.",
    "platform": "web",
    "integrations": ["analytics", "database", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered tool for summarizing legal documents and contracts.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A platform for creating custom quizzes and tests, with image upload capabilities.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A volunteer matching platform connecting individuals with local causes, including background checks and time tracking.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "notifications", "uploads"]
  },
  {
    "idea": "A website for tracking local weather conditions and receiving severe weather alerts.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "notifications"]
  },
  {
    "idea": "A community-driven platform for sharing and discovering open-source AI models and datasets.",
    "platform": "web",
    "integrations": ["analytics", "database", "discord", "llm", "realtime"]
  },
  {
    "idea": "An online platform for designing custom t-shirts and merchandise.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "uploads"]
  },
  {
    "idea": "A web-based IDE for collaborative coding, integrating with GitHub.",
    "platform": "web",
    "integrations": ["analytics", "database", "github", "notifications", "uploads"]
  },
  {
    "idea": "An AI-powered content calendar and scheduling tool for social media managers.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time stock market tracking and portfolio management website.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "An AI-driven platform for generating personalized gift recommendations.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A website for hosting virtual hackathons with team collaboration features.",
    "platform": "web",
    "integrations": ["analytics", "database", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered tool for generating unique character backstories for role-playing games.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time project management tool with Kanban boards and Gantt charts.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "A platform for finding and booking local sports facilities, like tennis courts or soccer fields.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "uploads"]
  },
  {
    "idea": "An AI-powered platform for generating personalized workout routines based on equipment available.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A real-time collaborative document editor for remote teams.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "A web tool for creating interactive quizzes and surveys with analytics.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A real-time multiplayer online board game platform.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered tool for generating personalized email subject lines and content.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "An AI-driven platform for generating unique blog post ideas and outlines.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time chat application for customer support on e-commerce sites.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered tool for generating creative story ideas for screenwriters.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A website for tracking local events and concerts, with integrated mapping and ticketing options.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "notifications"]
  },
  {
    "idea": "An AI-driven platform for generating personalized study plans for students.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications", "realtime"]
  },
  {
    "idea": "A collaborative platform for creating and managing shared grocery lists in real-time.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "An AI-powered tool for generating unique Dungeons & Dragons campaign ideas.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A web-based platform for organizing and tracking open-source contributions, with GitHub integration.",
    "platform": "web",
    "integrations": ["analytics", "database", "github", "uploads"]
  },
  {
    "idea": "An AI-powered tool for proofreading and suggesting grammatical improvements for writing.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A website for managing personal book collections and sharing reading progress with friends.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime", "uploads"]
  },
  {
    "idea": "A platform for selling custom-made digital assets for game developers.",
    "platform": "web",
    "integrations": ["analytics", "billing", "database", "uploads"]
  },
  {
    "idea": "An AI-powered tool for generating personalized lesson plans for educators.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time collaborative code editor for interviewing developers.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered platform for generating personalized exercise routines based on available equipment and fitness levels.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "notifications"]
  },
  {
    "idea": "A web tool for creating animated explainer videos using AI-generated scripts and visuals.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm", "uploads"]
  },
  {
    "idea": "A real-time stock price tracker with customizable alerts.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered tool for generating unique podcast episode ideas and outlines.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "An AI-driven platform for generating personalized travel packing lists based on destination and weather.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A real-time whiteboard for online tutoring sessions.",
    "platform": "web",
    "integrations": ["analytics", "database", "notifications", "realtime"]
  },
  {
    "idea": "An AI-powered tool for generating creative prompts for game developers.",
    "platform": "web",
    "integrations": ["analytics", "database", "llm"]
  },
  {
    "idea": "A website for discovering local art galleries and exhibitions, with interactive maps and event listings.",
    "platform": "web",
    "integrations": ["analytics", "database", "google", "maps", "notifications"]
  }
]

export default appIdeas;