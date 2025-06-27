import type { AvailablePlatform } from "@shared/availablePlatforms";

export interface AppIdea {
  idea: string;
  integrations: string[];
  platform: string;
}

export const appIdeas: AppIdea[] = [
  {
    idea: "AI-powered personal stylist app with virtual try-on",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Real-time collaborative whiteboard for remote teams",
    integrations: ["realtime", "database", "google"],
    platform: "web",
  },
  {
    idea: "Personalized meditation app with mood tracking and AI-generated soundscapes",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Virtual language exchange platform with integrated voice and video chat",
    integrations: ["realtime", "database", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Local community event discovery app with skill-based volunteering",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Fractional ownership platform for rare collectibles (art, wine, etc.)",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "AI-driven career coach that helps users discover and prepare for new roles",
    integrations: ["llm", "uploads", "google", "database"],
    platform: "desktop",
  },
  {
    idea: "Subscription box management tool with automated cancellation and renewal reminders",
    integrations: ["database", "billing", "notifications", "analytics"],
    platform: "web",
  },
  {
    idea: "Sustainable product marketplace with carbon footprint tracking",
    integrations: ["search", "analytics", "database", "llm"],
    platform: "web",
  },
  {
    idea: "Immersive VR fitness game with personalized workout routines",
    integrations: ["realtime", "llm", "analytics", "notifications"],
    platform: "game",
  },
  {
    idea: "Neighborhood-based tool lending library with online booking",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "mobile",
  },
  {
    idea: "AI-powered personalized nutrition app that provides meal recommendations and recipes",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "mobile",
  },
  {
    idea: "Virtual escape room platform for remote team building",
    integrations: ["realtime", "analytics", "database", "llm"],
    platform: "web",
  },
  {
    idea: "On-demand personal chef service with customizable meal plans",
    integrations: ["database", "uploads", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "AI-powered closet organizer that suggests outfits based on weather and events",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Waste reduction app that tracks food expiration dates and suggests recipes to use up ingredients",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Blockchain-based voting platform for secure and transparent elections",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "Skill-sharing marketplace where people can trade services and learn new skills",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "Local farmer's market delivery service with online ordering and tracking",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "Smart parking app that finds available parking spots and allows users to pay and reserve",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "AI-powered writing assistant that provides feedback on grammar, style, and tone",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "web",
  },
  {
    idea: "Real-time translation app that works with audio and text",
    integrations: ["realtime", "llm", "google", "database"],
    platform: "mobile",
  },
  {
    idea: "Personalized news aggregator that filters out fake news and biases",
    integrations: ["llm", "search", "database", "analytics"],
    platform: "web",
  },
  {
    idea: "Virtual museum tour app with augmented reality features",
    integrations: ["uploads", "database", "maps", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Interactive story-telling game where players make choices that affect the outcome",
    integrations: ["database", "llm", "realtime", "analytics"],
    platform: "game",
  },
  {
    idea: "Social media platform for sharing and discovering recipes",
    integrations: ["database", "uploads", "google", "realtime"],
    platform: "web",
  },
  {
    idea: "Personal finance app that tracks spending and provides budget recommendations",
    integrations: ["database", "billing", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Job board specifically for remote workers",
    integrations: ["database", "search", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Online therapy platform with licensed therapists and secure video sessions",
    integrations: ["database", "realtime", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "Language learning app that uses AI to personalize the learning experience",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Virtual art gallery where artists can showcase and sell their work",
    integrations: ["database", "uploads", "billing", "google"],
    platform: "web",
  },
  {
    idea: "Travel planning app that uses AI to recommend destinations and activities",
    integrations: ["llm", "maps", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "Crowdfunding platform for environmental conservation projects",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "AI-powered personal trainer app that creates customized workout plans",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Social networking app for book lovers",
    integrations: ["database", "realtime", "uploads", "search"],
    platform: "mobile",
  },
  {
    idea: "Platform for creating and selling online courses",
    integrations: ["database", "billing", "uploads", "notifications"],
    platform: "web",
  },
  {
    idea: "Music streaming app that uses AI to create personalized playlists",
    integrations: ["database", "analytics", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Augmented reality app for interior design",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Mobile app for tracking and managing personal carbon footprint",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Blockchain-based platform for tracking and verifying supply chains",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "Skill-sharing platform for freelancers with integrated escrow payments",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "Virtual farmers market with local delivery logistics and online payments",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Smart parking app with reservation and payment features",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "AI-powered writing tutor that provides personalized feedback and guidance",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "web",
  },
  {
    idea: "Real-time translation app with support for multiple languages and dialects",
    integrations: ["realtime", "llm", "google", "database"],
    platform: "mobile",
  },
  {
    idea: "Personalized news aggregator that filters out fake news and provides context",
    integrations: ["llm", "search", "database", "analytics"],
    platform: "web",
  },
  {
    idea: "Virtual museum tour app with interactive exhibits and gamified challenges",
    integrations: ["uploads", "database", "maps", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Interactive storytelling game with branching narratives and multiple endings",
    integrations: ["database", "llm", "realtime", "analytics"],
    platform: "game",
  },
  {
    idea: "Social media platform for sharing and discovering new recipes",
    integrations: ["database", "uploads", "google", "realtime"],
    platform: "web",
  },
  {
    idea: "Personal finance app with automated budgeting and savings tools",
    integrations: ["database", "billing", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Job board exclusively for remote workers",
    integrations: ["database", "search", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Online therapy platform with certified therapists and secure messaging",
    integrations: ["database", "realtime", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "AI-powered language learning app with personalized lessons and feedback",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Virtual art gallery for emerging artists to showcase and sell their artwork",
    integrations: ["database", "uploads", "billing", "google"],
    platform: "web",
  },
  {
    idea: "Travel planning app that uses AI to suggest destinations and activities based on user preferences",
    integrations: ["llm", "maps", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "Crowdfunding platform for environmental conservation and sustainability initiatives",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "AI-powered personal training app that creates customized workout plans and tracks progress",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Social networking app for book lovers to connect and share recommendations",
    integrations: ["database", "realtime", "uploads", "search"],
    platform: "mobile",
  },
  {
    idea: "Platform for creating and selling online courses with integrated payment processing",
    integrations: ["database", "billing", "uploads", "notifications"],
    platform: "web",
  },
  {
    idea: "Music streaming app that uses AI to create personalized playlists based on user listening habits",
    integrations: ["database", "analytics", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Augmented reality app for interior design that allows users to visualize furniture and decor in their homes",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Mobile app for tracking and reducing personal carbon footprint with gamified challenges",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Blockchain-based platform for tracking and verifying the authenticity of luxury goods",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "Skill-sharing platform for freelancers with integrated escrow payments and dispute resolution",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "Virtual farmers market with local delivery logistics and online payments",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Smart parking app that finds available parking spots in real-time and allows users to reserve and pay",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A social media platform where users can share and discover new and unique travel destinations.",
    integrations: ["database", "uploads", "maps", "analytics"],
    platform: "web",
  },
  {
    idea: "A language learning app that focuses on immersive, real-world conversations with AI tutors.",
    integrations: ["llm", "realtime", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting local artisans with customers looking for handmade goods.",
    integrations: ["database", "uploads", "billing", "search"],
    platform: "web",
  },
  {
    idea: "An AI-powered fitness app that creates personalized workout plans based on user biometrics and goals.",
    integrations: ["llm", "analytics", "database", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A virtual reality game where players explore historical events and interact with historical figures.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "A mobile app for tracking and reducing food waste at home, with recipe suggestions based on available ingredients.",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A platform for organizing and managing volunteer opportunities in local communities.",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "web",
  },
  {
    idea: "A personal finance app that helps users invest in sustainable and ethical companies.",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "mobile",
  },
  {
    idea: "A dating app that matches users based on shared environmental values and sustainable lifestyles.",
    integrations: ["database", "google", "search", "realtime"],
    platform: "mobile",
  },
  {
    idea: "A platform for renting out unused household items to neighbors.",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "An AI-powered writing assistant that helps users craft compelling resumes and cover letters.",
    integrations: ["llm", "database", "uploads", "google"],
    platform: "web",
  },
  {
    idea: "A mobile app for tracking and managing subscriptions, with automatic cancellation reminders.",
    integrations: ["database", "billing", "notifications", "analytics"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting local farmers with restaurants and consumers looking for fresh, seasonal produce.",
    integrations: ["database", "maps", "billing", "search"],
    platform: "web",
  },
  {
    idea: "An augmented reality app that allows users to virtually try on clothes before buying them online.",
    integrations: ["uploads", "llm", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "A virtual reality game where players collaborate to build and manage a sustainable city.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "A mobile app for tracking and rewarding sustainable transportation choices, such as walking, biking, and public transit.",
    integrations: ["database", "maps", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A platform for sharing and discovering eco-friendly products and services.",
    integrations: ["database", "search", "uploads", "analytics"],
    platform: "web",
  },
  {
    idea: "An AI-powered meditation app that creates personalized soundscapes based on user's mood and environment.",
    integrations: ["llm", "database", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting people with local repair shops and DIY resources for fixing broken items.",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "web",
  },
  {
    idea: "A personal stylist app using AI to recommend outfits.",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "A collaborative whiteboard for remote teams.",
    integrations: ["realtime", "database", "google"],
    platform: "web",
  },
  {
    idea: "Meditation app with mood tracking.",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A virtual language exchange platform.",
    integrations: ["realtime", "database", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Community event discovery app.",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Ownership platform for collectibles.",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "A career coach using AI.",
    integrations: ["llm", "uploads", "google", "database"],
    platform: "desktop",
  },
  {
    idea: "Box management tool.",
    integrations: ["database", "billing", "notifications", "analytics"],
    platform: "web",
  },
  {
    idea: "Product marketplace tracking carbon footprint.",
    integrations: ["search", "analytics", "database", "llm"],
    platform: "web",
  },
  {
    idea: "Fitness game.",
    integrations: ["realtime", "llm", "analytics", "notifications"],
    platform: "game",
  },
  {
    idea: "Lending library with online booking.",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A nutrition app.",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "mobile",
  },
  {
    idea: "A remote team building.",
    integrations: ["realtime", "analytics", "database", "llm"],
    platform: "web",
  },
  {
    idea: "A personal chef service.",
    integrations: ["database", "uploads", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Closet organizer.",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Waste reduction app.",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Voting platform.",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "Skill-sharing marketplace.",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "Local farmer's market.",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "Parking app.",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Writing tutor with guidance.",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "web",
  },
  {
    idea: "Translation app.",
    integrations: ["realtime", "llm", "google", "database"],
    platform: "mobile",
  },
  {
    idea: "News aggregator.",
    integrations: ["llm", "search", "database", "analytics"],
    platform: "web",
  },
  {
    idea: "A museum tour app.",
    integrations: ["uploads", "database", "maps", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Storytelling game.",
    integrations: ["database", "llm", "realtime", "analytics"],
    platform: "game",
  },
  {
    idea: "Media platform to discover recipes.",
    integrations: ["database", "uploads", "google", "realtime"],
    platform: "web",
  },
  {
    idea: "Finance App.",
    integrations: ["database", "billing", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A board for jobs.",
    integrations: ["database", "search", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Therapy platform with sessions.",
    integrations: ["database", "realtime", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "Learn AI languages.",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Artists can showcase their art.",
    integrations: ["database", "uploads", "billing", "google"],
    platform: "web",
  },
  {
    idea: "Travel by AI.",
    integrations: ["llm", "maps", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "Crowd funds to conserve.",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "Training App.",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Loverbook.",
    integrations: ["database", "realtime", "uploads", "search"],
    platform: "mobile",
  },
  {
    idea: "For people selling courses.",
    integrations: ["database", "billing", "uploads", "notifications"],
    platform: "web",
  },
  {
    idea: "A music streaming app.",
    integrations: ["database", "analytics", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "AR interior design.",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Tracking of carbon",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Platform verify supplies with block",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "freelance platform",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "marketplace",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "parking made easy.",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "AI-powered job interview simulator with personalized feedback",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "web",
  },
  {
    idea: "Real-time collaborative music composition tool for musicians",
    integrations: ["realtime", "uploads", "database", "google"],
    platform: "web",
  },
  {
    idea: "Personalized learning app that adapts to the user's learning style",
    integrations: ["llm", "database", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Virtual reality travel app with interactive tours and cultural experiences",
    integrations: ["uploads", "database", "maps", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Interactive storytelling game where players create their own narratives",
    integrations: ["database", "llm", "realtime", "analytics"],
    platform: "game",
  },
  {
    idea: "Social media platform for sharing and discovering unique travel experiences",
    integrations: ["database", "uploads", "google", "realtime"],
    platform: "web",
  },
  {
    idea: "Personal finance app that helps users manage debt and build wealth",
    integrations: ["database", "billing", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Job board for connecting freelancers with short-term projects",
    integrations: ["database", "search", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Online therapy platform that connects users with licensed therapists",
    integrations: ["database", "realtime", "billing", "notifications"],
    platform: "web",
  },
  {
    idea: "Language learning app with personalized lessons",
    integrations: ["llm", "database", "google", "analytics"],
    platform: "mobile",
  },
  {
    idea: "Virtual art gallery that allows artists to sell their artwork",
    integrations: ["database", "uploads", "billing", "google"],
    platform: "web",
  },
  {
    idea: "Travel planning app with AI that suggests destinations",
    integrations: ["llm", "maps", "database", "google"],
    platform: "mobile",
  },
  {
    idea: "Crowdfunding platform for community projects and initiatives",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "Personal fitness app",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Social networking app that connects book lovers",
    integrations: ["database", "realtime", "uploads", "search"],
    platform: "mobile",
  },
  {
    idea: "Online courses platform",
    integrations: ["database", "billing", "uploads", "notifications"],
    platform: "web",
  },
  {
    idea: "Music streaming app with AI-personalized playlists",
    integrations: ["database", "analytics", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Interior design with augmented reality",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Mobile app that helps users track personal carbon",
    integrations: ["database", "analytics", "llm", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Platform using blockchain to authenticate supplies",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "A freelance platform where users can hire services",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "A simple map locator mobile app",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Mobile app making parking simpler",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A community-based platform for sharing and borrowing tools and equipment.",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "An AI-powered personal shopping assistant that helps users find the best deals on clothing and accessories.",
    integrations: ["llm", "uploads", "search", "billing"],
    platform: "mobile",
  },
  {
    idea: "A virtual reality game where players collaborate to solve puzzles and escape from a haunted house.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "A mobile app for tracking and managing personal energy consumption, with tips on how to reduce usage.",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting local artists with businesses looking for unique artwork for their offices and retail spaces.",
    integrations: ["database", "uploads", "billing", "search"],
    platform: "web",
  },
  {
    idea: "A social media platform where users can share and discover local events and activities.",
    integrations: ["database", "maps", "google", "realtime"],
    platform: "mobile",
  },
  {
    idea: "An AI-powered meal planning app that creates personalized menus based on dietary restrictions and preferences.",
    integrations: ["llm", "database", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting people with local tutors and educational resources.",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "web",
  },
  {
    idea: "A mobile app for tracking and managing personal water usage, with tips on how to conserve water.",
    integrations: ["database", "analytics", "notifications", "maps"],
    platform: "mobile",
  },
  {
    idea: "A virtual reality game where players explore and colonize a new planet.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "A social media platform for sharing and discovering sustainable living tips and practices.",
    integrations: ["database", "search", "uploads", "analytics"],
    platform: "web",
  },
  {
    idea: "An AI-powered personal assistant that helps users manage their daily tasks and schedule appointments.",
    integrations: ["llm", "database", "google", "notifications"],
    platform: "mobile",
  },
  {
    idea: "A platform for connecting people with local food banks and donation centers.",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "A personal shopping.",
    integrations: ["llm", "uploads", "search", "billing"],
    platform: "mobile",
  },
  {
    idea: "Solving puzzles in VR.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "Tracking mobile apps.",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "mobile",
  },
  {
    idea: "Display works to show businesses.",
    integrations: ["database", "uploads", "billing", "search"],
    platform: "web",
  },
  {
    idea: "Share events in mobile.",
    integrations: ["database", "maps", "google", "realtime"],
    platform: "mobile",
  },
  {
    idea: "Meal planner.",
    integrations: ["llm", "database", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "connects with people.",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "web",
  },
  {
    idea: "Personal usage tracker.",
    integrations: ["database", "analytics", "notifications", "maps"],
    platform: "mobile",
  },
  {
    idea: "Collaborating game.",
    integrations: ["database", "realtime", "llm", "analytics"],
    platform: "game",
  },
  {
    idea: "Media to search living tips.",
    integrations: ["database", "search", "uploads", "analytics"],
    platform: "web",
  },
  {
    idea: "assisting AI.",
    integrations: ["llm", "database", "google", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Donation site.",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "web",
  },
  {
    idea: "Browser extension that auto-fills forms and summarises pages with AI assistance",
    integrations: ["llm", "database", "analytics", "search"],
    platform: "extension",
  },
  {
    idea: "VS Code extension that generates contextual code snippets and refactors on demand",
    integrations: ["llm", "database", "realtime", "analytics"],
    platform: "vscode",
  },
  {
    idea: "Slack app that summarises channels and schedules stand-ups using AI",
    integrations: ["realtime", "llm", "notifications", "analytics"],
    platform: "slack",
  },
  {
    idea: "CLI tool that scaffolds serverless functions with best-practice templates",
    integrations: ["llm", "database", "search"],
    platform: "cli",
  },
  {
    idea: "Smart-watch fitness coach that tracks workouts and suggests routines",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "watch",
  },
  {
    idea: "AR/VR museum experience with interactive exhibits and multiplayer tours",
    integrations: ["realtime", "uploads", "llm", "analytics"],
    platform: "arvr",
  },
];

export default appIdeas;