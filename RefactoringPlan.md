okayt # Refactoring Plan: VibeStart

This document outlines the plan to refactor the VibeStart project to a feature-based architecture.

## New Directory Structure

```
src/
├── features/
│   ├── ai/
│   │   ├── components/
│   │   ├── utils/
│   │   └── prompts/
│   ├── analytics/
│   │   └── components/
│   ├── auth/
│   │   ├── components/
│   │   └── context/
│   ├── core/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   ├── docs/
│   │   ├── components/
│   │   └── pages/
│   ├── home/
│   │   ├── components/
│   │   └── pages/
│   ├── maps/
│   │   └── components/
│   └── uploads/
│       └── components/
├── integrations/
│   ├── polar/
│   └── uploadthing/
├── server/
│   ├── api/
│   ├── db/
│   ├── middleware/
│   └── webhooks/
└── shared/
    ├── config/
    ├── data/
    ├── db/
    └── types/
```

## File and Function Migration Plan

### Root Level Files

*   `drizzle.config.ts` -> `src/server/db/drizzle.config.ts`
*   `react-router.config.ts` -> `router.config.ts`
*   `tailwind.config.js` -> `config/tailwind.config.js`
*   `vite.config.ts` -> `config/vite.config.ts`
*   `tsconfig.json` -> `config/tsconfig.json`

### Client Files

#### Core
*   `src/client/root.tsx` -> `src/features/core/pages/root.tsx`
*   `src/client/routes.ts` -> `src/features/core/routes.ts`
*   `src/client/components/Header.tsx` -> `src/features/core/components/Header.tsx`
*   `src/client/components/SideBar.tsx` -> `src/features/core/components/SideBar.tsx`
*   `src/client/components/Badge.tsx` -> `src/features/core/components/Badge.tsx`
*   `src/client/components/ChipDropdownMenu.tsx` -> `src/features/core/components/ChipDropdownMenu.tsx`
*   `src/client/components/IdeaTextBox.tsx` -> `src/features/core/components/IdeaTextBox.tsx`
*   `src/client/components/PlatformChip.tsx` -> `src/features/core/components/PlatformChip.tsx`
*   `src/client/components/TechStack.tsx` -> `src/features/core/components/TechStack.tsx`
*   `src/client/components/ThemeSwitcher.tsx` -> `src/features/core/components/ThemeSwitcher.tsx`
*   `src/client/context/ThemeContext.tsx` -> `src/features/core/context/ThemeContext.tsx`
*   `src/client/context/EnvironmentContext.tsx` -> `src/features/core/context/EnvironmentContext.tsx`

#### AI
*   `src/client/components/integrations/LLM/ChatBox.tsx` -> `src/features/ai/components/ChatBox.tsx`
*   `src/client/components/integrations/LLM/ImagesGrid.tsx` -> `src/features/ai/components/ImagesGrid.tsx`
*   `src/client/components/integrations/LLM/ModelSelector.tsx` -> `src/features/ai/components/ModelSelector.tsx`
*   `src/client/components/integrations/LLM/PromptInputs.tsx` -> `src/features/ai/components/PromptInputs.tsx`
*   `src/client/utils/integrationLLM.ts` -> `src/features/ai/utils/integrationLLM.ts`
*   `src/shared/cursorSetupPrompt.ts` -> `src/features/ai/prompts/cursorSetupPrompt.ts`
*   `src/shared/promptCursorSetup.ts` -> `src/features/ai/prompts/promptCursorSetup.ts`
*   `src/shared/promptHomeIdeaConverter.ts` -> `src/features/ai/prompts/promptHomeIdeaConverter.ts`
*   `src/client/pages/api/chat.tsx` -> `src/server/api/chat.ts` (and client-side hook in `src/features/ai/utils/`)
*   `src/client/pages/api/image-generate.tsx` -> `src/server/api/imageGeneration.ts` (and client-side hook in `src/features/ai/utils/`)
*   `src/client/pages/api/images.tsx` -> `src/server/api/images.ts` (and client-side hook in `src/features/ai/utils/`)

#### Analytics
*   `src/client/components/integrations/analytics/PosthogWrapper.tsx` -> `src/features/analytics/components/PosthogWrapper.tsx`

#### Auth
*   `src/client/components/integrations/auth/CreateOrganizationButton.tsx` -> `src/features/auth/components/CreateOrganizationButton.tsx`
*   `src/client/components/integrations/auth/LoginModal.tsx` -> `src/features/auth/components/LoginModal.tsx`
*   `src/client/components/integrations/auth/SignInButton.tsx` -> `src/features/auth/components/SignInButton.tsx`
*   `src/client/components/integrations/auth/SignInForm.tsx` -> `src/features/auth/components/SignInForm.tsx`
*   `src/client/context/AuthContext.tsx` -> `src/features/auth/context/AuthContext.tsx`

#### Docs
*   `src/client/pages/docs.tsx` -> `src/features/docs/pages/docs.tsx`
*   `src/client/components/docs/BuildTab.tsx` -> `src/features/docs/components/BuildTab.tsx`
*   `src/client/components/docs/CliTab.tsx` -> `src/features/docs/components/CliTab.tsx`

#### Home
*   `src/client/pages/home.tsx` -> `src/features/home/pages/home.tsx`
*   `src/client/components/home/HomeIdeaInput.tsx` -> `src/features/home/components/HomeIdeaInput.tsx`
*   `src/client/components/home/MainInfo.tsx` -> `src/features/home/components/MainInfo.tsx`
*   `src/client/components/home/OtherCTA.tsx` -> `src/features/home/components/OtherCTA.tsx`
*   `src/client/components/home/OtherInfo.tsx` -> `src/features/home/components/OtherInfo.tsx`

#### Maps
*   `src/client/components/integrations/maps/BasicGoogleMap.tsx` -> `src/features/maps/components/BasicGoogleMap.tsx`
*   `src/client/components/integrations/maps/PlaceAutocompleteMap.tsx` -> `src/features/maps/components/PlaceAutocompleteMap.tsx`

#### Uploads
*   `src/client/components/integrations/uploads/SquareUploadButton.tsx` -> `src/features/uploads/components/SquareUploadButton.tsx`

### Server Files

*   `src/server/animals.ts` -> `src/server/api/animals.ts`
*   `src/server/botid.ts` -> `src/server/api/botid.ts`
*   `src/server/chat.ts` -> `src/server/api/chat.ts`
*   `src/server/email.ts` -> `src/server/api/email.ts`
*   `src/server/imageGeneration.ts` -> `src/server/api/imageGeneration.ts`
*   `src/server/tokenUsage.ts` -> `src/server/api/tokenUsage.ts`
*   `src/server/polar.ts` -> `src/integrations/polar/server.ts`
*   `src/server/polarWebhook.ts` -> `src/integrations/polar/webhook.ts`
*   `src/server/uploadthing.ts` -> `src/integrations/uploadthing/server.ts`
*   `src/server/db/index.ts` -> `src/server/db/index.ts`
*   `src/server/db/schema.ts` -> `src/server/db/schema.ts`
*   `src/server/utils/rateLimit.ts` -> `src/server/middleware/rateLimit.ts`
*   `src/server/utils/visitorToken.ts` -> `src/server/utils/visitorToken.ts`

### Shared Files

*   `src/shared/app.css` -> `src/shared/app.css`
*   `src/shared/appIdeas.ts` -> `src/shared/data/appIdeas.ts`
*   `src/shared/availableIntegrations.ts` -> `src/shared/data/availableIntegrations.ts`
*   `src/shared/availablePlatforms.ts` -> `src/shared/data/availablePlatforms.ts`
*   `src/shared/constants.ts` -> `src/shared/config/constants.ts`
*   `src/shared/supabase.ts` -> `src/shared/db/supabase.ts`
*   `src/types/raw.d.ts` -> `src/shared/types/raw.d.ts`

This plan provides a clear path to a more organized and maintainable codebase.
