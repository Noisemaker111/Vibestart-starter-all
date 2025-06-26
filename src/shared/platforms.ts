export const PLATFORMS = [
  "web",
  "mobile",
  "desktop",
  "game",
  "discord",
  "telegram",
  "extension",
  "vscode",
  "slack",
  "cli",
  "watch",
  "arvr",
] as const;

export type Platform = typeof PLATFORMS[number]; 