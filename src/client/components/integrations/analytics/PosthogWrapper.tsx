import React, { Suspense } from "react";

const LazyPostHogProvider = React.lazy(() =>
  import("posthog-js/react").then((m) => ({ default: m.PostHogProvider }))
);

interface Props {
  children: React.ReactNode;
  apiKey: string;
  host?: string;
}

export default function PosthogWrapper({ children, apiKey, host }: Props) {
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_posthog_api_key_here") {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={children}>
      <LazyPostHogProvider
        apiKey={apiKey}
        options={{
          api_host: host || undefined,
          capture_exceptions: true,
          debug: false,
        }}
      >
        {children}
      </LazyPostHogProvider>
    </Suspense>
  );
} 