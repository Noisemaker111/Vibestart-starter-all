export const availablePlatforms = [
  "web",
  "mobile-app",
  "mobile-game",
  "desktop",
  "desktop-game",
  "app",
  "game",
  "discord",
  "telegram",
  "extension",
  "vscode",
  "cli",
  "watch",
  "arvr",
] as const;

export type AvailablePlatform = typeof availablePlatforms[number]; 