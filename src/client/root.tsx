import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import appStylesHref from "@shared/app.css?url";
import { AuthProvider } from "@client/context/AuthContext";
import { OSProvider } from "@client/context/OsContext";
import { Header } from "@client/components/Header";
import PosthogWrapper from "@client/components/integrations/analytics/PosthogWrapper";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "preload", href: appStylesHref, as: "style" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <PosthogWrapper apiKey={POSTHOG_KEY} host={POSTHOG_HOST}>
          <AuthProvider>
            <OSProvider>
              <Header />
              {children}
            </OSProvider>
          </AuthProvider>
        </PosthogWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PostHog configuration helpers – avoid runtime 404/401 when env not set
// ─────────────────────────────────────────────────────────────────────────────

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? "";

// Treat placeholder or empty string as "not configured"
const isPostHogConfigured =
  typeof POSTHOG_KEY === "string" &&
  POSTHOG_KEY.trim() !== "" &&
  POSTHOG_KEY !== "your_posthog_api_key_here";