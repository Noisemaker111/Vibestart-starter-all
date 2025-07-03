# Intern-Proof Refactoring Plan: VibeStart

**Objective:** To restructure the project into a feature-based architecture that is intuitive, scalable, and easy for new developers to understand.

**Golden Rule:** After every major step, run `npm run typecheck` and `npm run build` to catch errors early. Do not proceed if there are errors.

---

### Step 1: Create the New Directory Structure

First, create all the new folders. This ensures you have a place for all the files you'll be moving.

```bash
# Run this command from the project root directory
mkdir -p src/features/ai/components src/features/ai/utils src/features/ai/prompts
mkdir -p src/features/analytics/components
mkdir -p src/features/auth/components src/features/auth/context
mkdir -p src/features/core/components src/features/core/pages src/features/core/context
mkdir -p src/features/docs/components src/features/docs/pages
mkdir -p src/features/home/components src/features/home/pages
mkdir -p src/features/maps/components
mkdir -p src/features/uploads/components
mkdir -p src/integrations/polar src/integrations/uploadthing
mkdir -p src/server/api src/server/db/migrations/meta src/server/db/queries src/server/middleware src/server/webhooks
mkdir -p src/shared/config src/shared/data src/shared/db src/shared/types
mkdir -p config
```

---

### Step 2: Update Configuration Files

Configuration files need to be updated to know where to find things after the move.

**1. `package.json`:**
   - No changes needed to scripts, as they use `react-router` which should handle the new structure.

**2. `tsconfig.json` -> `config/tsconfig.json`:**
   - Move the file: `mv tsconfig.json config/tsconfig.json`
   - **Update its content:** The path aliases need to be completely changed to reflect the new structure.

   ```json
   // OLD PATHS
   "paths": {
     "@client/*": ["./src/client/*"],
     "@server/*": ["./src/server/*"],
     "@shared/*": ["./src/shared/*"]
   }

   // NEW PATHS
   "paths": {
     "@features/*": ["./src/features/*"],
     "@integrations/*": ["./src/integrations/*"],
     "@server/*": ["./src/server/*"],
     "@shared/*": ["./src/shared/*"]
   }
   ```

**3. `vite.config.ts` -> `config/vite.config.ts`:**
   - Move the file: `mv vite.config.ts config/vite.config.ts`
   - **Update its content:** Update the path aliases to match the new `tsconfig.json`.

   ```typescript
   // OLD ALIASES
   alias: {
     "@client": path.resolve(__dirname, "src/client"),
     "@server": path.resolve(__dirname, "src/server"),
     "@shared": path.resolve(__dirname, "src/shared"),
   },

   // NEW ALIASES
   alias: {
     "@features": path.resolve(__dirname, "src/features"),
     "@integrations": path.resolve(__dirname, "src/integrations"),
     "@server": path.resolve(__dirname, "src/server"),
     "@shared": path.resolve(__dirname, "src/shared"),
   },
   ```

---

### Step 3: Move Files and Update Imports

This is the most critical part. Move each file or folder as listed below. **After each move, you must find and replace the import paths in the rest of the codebase.**

**Example:**
- You move `src/client/components/Header.tsx` to `src/features/core/components/Header.tsx`.
- You must search the entire project for `import Header from '@client/components/Header.tsx'` and change it to `import Header from '@features/core/components/Header.tsx'`.

#### **File Migration Map:**

**Root Level Files:**
- `drizzle.config.ts` -> `src/server/db/drizzle.config.ts`
- `react-router.config.ts` -> `router.config.ts`
- `tailwind.config.js` -> `config/tailwind.config.js`

**Core Feature:**
- `src/client/root.tsx` -> `src/features/core/pages/root.tsx`
- `src/client/routes.ts` -> `src/features/core/routes.ts`
- `src/client/components/{Header,SideBar,Badge,ChipDropdownMenu,IdeaTextBox,PlatformChip,TechStack,ThemeSwitcher}.tsx` -> `src/features/core/components/`
- `src/client/context/{ThemeContext,EnvironmentContext}.tsx` -> `src/features/core/context/`

**AI Feature:**
- `src/client/components/integrations/LLM/*.tsx` -> `src/features/ai/components/`
- `src/client/utils/integrationLLM.ts` -> `src/features/ai/utils/integrationLLM.ts`
- `src/shared/{cursorSetupPrompt,promptCursorSetup,promptHomeIdeaConverter}.ts` -> `src/features/ai/prompts/`

**Auth Feature:**
- `src/client/components/integrations/auth/*.tsx` -> `src/features/auth/components/`
- `src/client/context/AuthContext.tsx` -> `src/features/auth/context/AuthContext.tsx`

**And so on for all files listed in the original `RefactoringPlan.md`...**

---

### Step 4: Special Handling for API Routes

The files in `src/client/pages/api/` are currently `.tsx` files. They need to be converted into proper server-side `.ts` files.

**Action:** For each file (e.g., `src/client/pages/api/chat.tsx`):
1.  **Move and Rename:** Move it to `src/server/api/chat.ts`.
2.  **Extract Logic:** The original file contains a React component. You need to pull the server-side logic (e.g., the part that calls the AI SDK) out of the component.
3.  **Create an API Handler:** Wrap this logic in a function that can be called by your server framework (e.g., an `export async function POST(request: Request)`).
4.  **Update Client-Side Code:** The client-side code that was calling this API route (e.g., using `fetch`) will now need to be updated to call the new endpoint. You should create a client-side utility function (e.g., in `src/features/ai/utils/`) that handles this `fetch` call.

---

### Step 5: Verification Checklist

After completing all the steps above, perform the following checks to ensure nothing is broken:

1.  [ ] **Delete `node_modules` and `package-lock.json`:** Run `rm -rf node_modules package-lock.json`.
2.  [ ] **Reinstall dependencies:** Run `npm install`. This will ensure all dependencies are fresh and there are no caching issues.
3.  [ ] **Run Type Check:** Run `npm run typecheck`. This will catch any TypeScript errors, including incorrect import paths. **Fix all errors.**
4.  [ ] **Run Build:** Run `npm run build`. This will attempt to build the project for production. **Fix all errors.**
5.  [ ] **Run Development Server:** Run `npm run dev`. Open the application in your browser and click through every page and feature to manually test that everything works as expected.

This detailed plan should be sufficient to guide an intern through the refactoring process with minimal risk.
