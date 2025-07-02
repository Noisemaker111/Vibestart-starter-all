import type { AvailablePlatformKey } from "@shared/availablePlatforms";

export interface AppIdea {
  idea: string;
  integrations: string[];
  platform: AvailablePlatformKey;
}

export const appIdeas: AppIdea[] = [
  {
    "idea": "Website to generate a 4x4 amount of images based on user prompt with slight variance in each one, pay per 4x4 or 16 images",
    "platform": "web",
    "integrations": [
      "analytics",
      "external api",
      "authentication",
      "billing",
      "database",
      "email",
      "llm text",
      "llm image",
      "notifications",
      "uploads"
    ]
  },
  {
  "idea":"Personal finance dashboard tracking expenses with customizable charts",
  "platform":"web",
  "integrations":["analytics","api","database","notifications"]
  },
  {
  "idea":"Online book club platform with discussion forums and reading schedules",
  "platform":"web",
  "integrations":["database","email","notifications","realtime"]
  },
  {
  "idea":"Recipe sharing community with ingredient-based search filters",
  "platform":"web",
  "integrations":["database","notifications","uploads"]
  },
  {
  "idea":"Virtual event platform offering ticketing and attendee networking",
  "platform":"web",
  "integrations":["api","billing","email","notifications"]
  },
  {
  "idea":"Eco-friendly product marketplace with carbon footprint analytics",
  "platform":"web",
  "integrations":["analytics","api","billing","google"]
  },
  {
  "idea":"AI-powered code review tool highlighting vulnerabilities and suggestions",
  "platform":"web",
  "integrations":["api","github","llm","notifications"]
  },
  {
  "idea":"Customizable portfolio site builder with drag-and-drop templates",
  "platform":"web",
  "integrations":["api","database","files","uploads"]
  },
  {
  "idea":"Online tutoring platform matching students with certified educators",
  "platform":"web",
  "integrations":["database","email","notifications","realtime","sms"]
  },
  {
  "idea":"Language exchange network pairing learners for real-time practice",
  "platform":"web",
  "integrations":["database","notifications","realtime","sms"]
  },
  {
  "idea":"Virtual coworking space with Pomodoro timers and focus rooms",
  "platform":"web",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Real-time collaborative spreadsheet for budgeting and data analysis",
  "platform":"web",
  "integrations":["api","database","notifications","realtime"]
  },
  {
  "idea":"Subscription box management tool tracking deliveries and preferences",
  "platform":"web",
  "integrations":["api","billing","database","notifications"]
  },
  {
  "idea":"Interactive map for local hiking trails with user reviews",
  "platform":"web",
  "integrations":["database","maps","notifications"]
  },
  {
  "idea":"Digital art gallery showcasing NFT collections and artist profiles",
  "platform":"web",
  "integrations":["database","solana","uploads"]
  },
  {
  "idea":"Smart grocery list app that suggests items based on recipes",
  "platform":"mobile-app",
  "integrations":["analytics","database","notifications","uploads"]
  },
  {
  "idea":"Habit tracker with streak rewards and community leaderboards",
  "platform":"mobile-app",
  "integrations":["api","database","notifications","realtime"]
  },
  {
  "idea":"Offline language learning app with spaced repetition flashcards",
  "platform":"mobile-app",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"Fitness coaching app offering custom workout and meal plans",
  "platform":"mobile-app",
  "integrations":["billing","database","llm","notifications"]
  },
  {
  "idea":"Travel itinerary planner with real-time flight updates",
  "platform":"mobile-app",
  "integrations":["api","maps","notifications","realtime"]
  },
  {
  "idea":"Augmented reality home design preview with furniture overlays",
  "platform":"mobile-app",
  "integrations":["api","database","llm-image-gen","uploads"]
  },
  {
  "idea":"Mobile payment wallet enabling peer-to-peer cryptocurrency transfers",
  "platform":"mobile-app",
  "integrations":["api","billing","solana"]
  },
  {
  "idea":"Sleep tracking app analyzing patterns and offering wellness tips",
  "platform":"mobile-app",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"Voice recording app transcribing audio with keyword search",
  "platform":"mobile-app",
  "integrations":["api","database","files","notifications"]
  },
  {
  "idea":"Event discovery app with personalized recommendations and ticket purchases",
  "platform":"mobile-app",
  "integrations":["api","billing","database","notifications"]
  },
  {
  "idea":"Mental health journaling app with mood analytics and reminders",
  "platform":"mobile-app",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"Language dictionary app offering pronunciation audio and offline mode",
  "platform":"mobile-app",
  "integrations":["api","database","files","notifications"]
  },
  {
  "idea":"Shopping assistant scanning barcodes for price comparisons",
  "platform":"mobile-app",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Parking finder app showing available spots in real time",
  "platform":"mobile-app",
  "integrations":["api","maps","notifications","realtime"]
  },
  {
  "idea":"Pet care reminder app scheduling vaccinations and feeding times",
  "platform":"mobile-app",
  "integrations":["database","notifications","sms"]
  },
  {
  "idea":"Cross-platform markdown editor with live preview and export options",
  "platform":"desktop-app",
  "integrations":["database","files","notifications"]
  },
  {
  "idea":"Video editing tool offering AI-generated transitions and effects",
  "platform":"desktop-app",
  "integrations":["api","files","llm-image-gen","notifications"]
  },
  {
  "idea":"Time tracking app with project billing and analytics dashboard",
  "platform":"desktop-app",
  "integrations":["analytics","billing","database"]
  },
  {
  "idea":"Desktop email client with unified inbox and smart filtering",
  "platform":"desktop-app",
  "integrations":["database","email","notifications"]
  },
  {
  "idea":"Password manager with browser autofill and secure vault sync",
  "platform":"desktop-app",
  "integrations":["database","google","notifications","uploads"]
  },
  {
  "idea":"Music production DAW with collaborative cloud project sharing",
  "platform":"desktop-app",
  "integrations":["database","files","notifications","realtime","uploads"]
  },
  {
  "idea":"2D animation studio software with onion skin and timeline editor",
  "platform":"desktop-app",
  "integrations":["database","files","notifications"]
  },
  {
  "idea":"Virtual machine manager for lightweight development environments",
  "platform":"desktop-app",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Screen capture tool with annotation and instant sharing options",
  "platform":"desktop-app",
  "integrations":["api","files","notifications","uploads"]
  },
  {
  "idea":"Mind mapping app with real-time collaboration and export templates",
  "platform":"desktop-app",
  "integrations":["api","database","notifications","realtime"]
  },
  {
  "idea":"Casual puzzle adventure blending physics and story-driven levels",
  "platform":"mobile-game",
  "integrations":["analytics","billing","notifications","realtime"]
  },
  {
  "idea":"Idle farming game with unlockable recipes and marketplace trading",
  "platform":"mobile-game",
  "integrations":["analytics","billing","database","notifications"]
  },
  {
  "idea":"AR treasure hunt game using GPS and user-generated clues",
  "platform":"mobile-game",
  "integrations":["maps","notifications","realtime"]
  },
  {
  "idea":"Multiplayer trivia challenge with social sharing and leaderboards",
  "platform":"mobile-game",
  "integrations":["discord","notifications","realtime"]
  },
  {
  "idea":"Rhythm game syncing to user playlists and visualizers",
  "platform":"mobile-game",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Strategy simulation game with AI opponents and scenario editor",
  "platform":"mobile-game",
  "integrations":["files","llm","notifications"]
  },
  {
  "idea":"Virtual pet game with health tracking and mini-games",
  "platform":"mobile-game",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"Open-world exploration RPG with dynamic weather system",
  "platform":"desktop-game",
  "integrations":["analytics","api","notifications"]
  },
  {
  "idea":"Co-op dungeon crawler featuring procedural level generation",
  "platform":"desktop-game",
  "integrations":["analytics","notifications","realtime"]
  },
  {
  "idea":"Simulation city builder with economic and environmental modeling",
  "platform":"desktop-game",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"First-person shooter with VR support and customizable loadouts",
  "platform":"desktop-game",
  "integrations":["api","files","notifications"]
  },
  {
  "idea":"Puzzle-platformer combining time manipulation and physics puzzles",
  "platform":"desktop-game",
  "integrations":["analytics","notifications","realtime"]
  },
  {
  "idea":"Retro-style shooter with online leaderboards and achievements",
  "platform":"desktop-game",
  "integrations":["analytics","api","notifications","realtime"]
  },
  {
  "idea":"Educational history game with interactive timelines and quizzes",
  "platform":"desktop-game",
  "integrations":["database","notifications","realtime"]
  },
  {
  "idea":"Server moderation bot auto-moderating bad language and spam",
  "platform":"discord",
  "integrations":["api","database","discord"]
  },
  {
  "idea":"Music playback bot streaming from multiple audio platforms",
  "platform":"discord",
  "integrations":["api","discord","realtime"]
  },
  {
  "idea":"Study group bot scheduling sessions and sharing resources",
  "platform":"discord",
  "integrations":["database","discord","notifications"]
  },
  {
  "idea":"Gaming stats bot tracking player performance and leaderboards",
  "platform":"discord",
  "integrations":["analytics","api","database","discord"]
  },
  {
  "idea":"Language practice bot offering daily vocabulary quizzes",
  "platform":"discord",
  "integrations":["database","discord","notifications"]
  },
  {
  "idea":"Poll creation bot collecting votes and generating results charts",
  "platform":"discord",
  "integrations":["analytics","database","discord"]
  },
  {
  "idea":"Reminder bot DMing scheduled alerts and recurring notifications",
  "platform":"discord",
  "integrations":["database","discord","notifications"]
  },
  {
  "idea":"Trivia quiz bot with themed question packs and scoreboards",
  "platform":"discord",
  "integrations":["database","discord","notifications","realtime"]
  },
  {
  "idea":"NFT showcase bot displaying new drops and artist info",
  "platform":"discord",
  "integrations":["api","discord","notifications"]
  },
  {
  "idea":"Weather update bot posting hourly forecasts to designated channels",
  "platform":"discord",
  "integrations":["api","discord","notifications","realtime"]
  },
  {
  "idea":"Daily news summary bot delivering headlines based on interests",
  "platform":"telegram",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Expense tracker bot logging purchases and sending weekly summaries",
  "platform":"telegram",
  "integrations":["database","email","notifications"]
  },
  {
  "idea":"Language translation bot replying with multiple language options",
  "platform":"telegram",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Workout coach bot sending daily exercise routines and tips",
  "platform":"telegram",
  "integrations":["database","notifications","sms"]
  },
  {
  "idea":"Stock alert bot notifying price changes and market news",
  "platform":"telegram",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Password generator extension creating secure credentials with one click",
  "platform":"extension",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Shopping assistant extension comparing prices across e-commerce sites",
  "platform":"extension",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Read-it-later extension syncing articles across devices",
  "platform":"extension",
  "integrations":["api","database","uploads"]
  },
  {
  "idea":"Grammar checker extension offering context-aware writing suggestions",
  "platform":"extension",
  "integrations":["api","llm","notifications"]
  },
  {
  "idea":"Dark mode scheduler extension adapting themes based on time",
  "platform":"extension",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"Live share plugin for VSCode with voice chat integration",
  "platform":"vscode",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Code snippet manager extension with searchable templates database",
  "platform":"vscode",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"AI code assistant suggesting completions and refactoring tips",
  "platform":"vscode",
  "integrations":["api","llm","notifications"]
  },
  {
  "idea":"Task runner extension visualizing build pipelines and logs",
  "platform":"vscode",
  "integrations":["api","files","notifications"]
  },
  {
  "idea":"Dark theme generator previewing color schemes in real time",
  "platform":"vscode",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Docker integration extension for managing containers from editor",
  "platform":"vscode",
  "integrations":["api","files","notifications"]
  },
  {
  "idea":"Git conflict resolver extension automating merge suggestions",
  "platform":"vscode",
  "integrations":["api","github","notifications"]
  },
  {
  "idea":"Terminal emulator integrated into VSCode with customizable themes",
  "platform":"vscode",
  "integrations":["api","files","notifications"]
  },
  {
  "idea":"CLI tool for batch image compression and format conversion",
  "platform":"cli",
  "integrations":["api","files","notifications","uploads"]
  },
  {
  "idea":"Command-line password strength tester with breach database check",
  "platform":"cli",
  "integrations":["api","database","notifications"]
  },
  {
  "idea":"CLI for deploying static sites to multiple cloud providers",
  "platform":"cli",
  "integrations":["api","billing","notifications"]
  },
  {
  "idea":"Terminal-based task manager with Pomodoro and analytics reporting",
  "platform":"cli",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"CLI tool for monitoring server performance and sending alerts",
  "platform":"cli",
  "integrations":["analytics","api","notifications","realtime"]
  },
  {
  "idea":"File synchronization CLI supporting FTP, S3, and local backups",
  "platform":"cli",
  "integrations":["api","files","notifications","uploads"]
  },
  {
  "idea":"Automated database migration CLI with rollback and logging",
  "platform":"cli",
  "integrations":["database","files","notifications"]
  },
  {
  "idea":"CLI chat client connecting to popular messaging platforms",
  "platform":"cli",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Fitness watch face displaying heart rate and step goals",
  "platform":"watch",
  "integrations":["api","notifications","realtime"]
  },
  {
  "idea":"Medication reminder watch app sending dosage alerts",
  "platform":"watch",
  "integrations":["database","notifications","sms"]
  },
  {
  "idea":"Sleep cycle watch face tracking movements and sleep quality",
  "platform":"watch",
  "integrations":["analytics","database","notifications"]
  },
  {
  "idea":"Calendar watch app showing upcoming events with quick RSVP",
  "platform":"watch",
  "integrations":["api","email","notifications","realtime"]
  },
  {
  "idea":"Voice memo watch app recording quick audio notes",
  "platform":"watch",
  "integrations":["files","notifications","uploads"]
  },
  {
  "idea":"AR furniture placement app mapping 3D models in real spaces",
  "platform":"arvr",
  "integrations":["api","database","llm-image-gen","uploads"]
  },
  {
  "idea":"VR meditation experience with guided sessions and ambient visuals",
  "platform":"arvr",
  "integrations":["llm","llm-image-gen","notifications"]
  },
  {
  "idea":"AR navigation app overlaying directions onto live camera feed",
  "platform":"arvr",
  "integrations":["maps","notifications","realtime"]
  },
  {
  "idea":"VR training simulator for industrial equipment operation safety",
  "platform":"arvr",
  "integrations":["analytics","llm","notifications"]
  },
  {
  "idea":"AR language translator overlaying subtitles in real time",
  "platform":"arvr",
  "integrations":["api","llm","realtime"]
  },
  {
  "idea":"Contact form spam filter with AI-driven bot detection",
  "platform":"web",
  "integrations":["analytics","bot-detection","database","api"]
  }
  ]

export default appIdeas;