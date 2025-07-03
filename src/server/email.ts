import { Resend } from "resend";
import { z } from "zod";
import { checkBotId } from "botid/server";

const resendApiKey = process.env.RESEND_API_KEY ?? "";

// Initialise Resend client once
const resend = new Resend(resendApiKey);

// Zod schema for input validation
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(10000),
  from: z.string().email().optional().default("onboarding@resend.dev"),
});

export const emailRouteHandler = {
  async action({ request }: { request: Request }) {
    try {
      // Verify request is human
      const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
      if (botCheck.isBot) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      const json = await request.json();
      const { to, subject, html, from } = emailSchema.parse(json);

      // Send email via Resend
      const result = await resend.emails.send({ to, subject, html, from });

      if (result.error) {
        throw new Error(result.error.message ?? "Unknown Resend error");
      }

      return new Response(
        JSON.stringify({ success: true, id: result.data?.id ?? null }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || "Failed to send email" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  },
}; 