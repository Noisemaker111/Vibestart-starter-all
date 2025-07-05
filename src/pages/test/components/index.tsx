import React from "react";
import {
  AuthTest,
  DatabaseTest,
  UploadsTest,
  OrganizationsTest,
  EmailTest,
  LLMImageTest,
  LLMTextTest,
  AnalyticsTest,
  BillingTest,
  BotDetectionTest,
  MapsAutocompleteTest,
  RealtimeChatTest,
} from "./tests";

// Props allow consumers to filter which integration tests to show
interface TestIntegrationsProps {
  /**
   * Integration keys that should be displayed. If empty or omitted, all tests are shown.
   */
  selectedKeys?: string[];
}

export default function TestIntegrations({ selectedKeys = [] }: TestIntegrationsProps) {
  // Helper to decide if a given integration test should be rendered
  const shouldShow = (key: string) => selectedKeys.length === 0 || selectedKeys.includes(key);

  return (
    <div className="space-y-10 text-base w-full max-w-3xl mx-auto">
      {/* Core tests with real functionality */}
      {shouldShow("auth") && <AuthTest />}
      {shouldShow("database") && <DatabaseTest />}
      {shouldShow("uploads") && <UploadsTest />}
      {shouldShow("organizations") && <OrganizationsTest />}
      {shouldShow("email") && <EmailTest />}
      {shouldShow("llm-image") && <LLMImageTest />}
      {shouldShow("llm") && <LLMTextTest />}
      {shouldShow("analytics") && <AnalyticsTest />}
      {shouldShow("billing") && <BillingTest />}
      {/* Bot detection does not map to a specific integration; always show if any key selected */}
      {selectedKeys.length > 0 && <BotDetectionTest />}
      {shouldShow("maps") && <MapsAutocompleteTest />}

      {/* Placeholder tests – keep for integrations not yet available */}
      {shouldShow("realtime") && <RealtimeChatTest />}
    </div>
  );
} 