export const availablePlatforms = [
  "web",
  "mobile-app",
  "mobile-game",
  "desktop",
  "desktop-game",
  "discord",
  "telegram",
  "extension",
  "vscode",
  "slack",
  "cli",
  "watch",
  "arvr",
] as const;

export type AvailablePlatform = typeof availablePlatforms[number]; 