import React from "react";
import { PostHogProvider } from "posthog-js/react";

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
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: host || undefined,
        capture_exceptions: true,
        debug: false,
      }}
    >
      {children}
    </PostHogProvider>
  );
} 