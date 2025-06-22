import { useState } from "react";
import { WaitlistSchema, type WaitlistFormData } from "@shared/schema";
import { z } from "zod";

export function WaitlistForm() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: "",
    company: "",
    occupation: "",
    state: "",
    country: "",
    level: "intern",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      WaitlistSchema.parse(formData);
      setLoading(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setSuccess(true);
      setFormData({ name: "", company: "", occupation: "", state: "", country: "", level: "intern" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">Thank you!</h3>
        <p className="text-sm text-green-600 dark:text-green-400">You've been added to the waitlist.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" />
        <input name="company" value={formData.company ?? ""} onChange={handleChange} placeholder="Company" className="input" />
        <input name="occupation" value={formData.occupation ?? ""} onChange={handleChange} placeholder="Occupation" className="input" />
        <input name="state" value={formData.state ?? ""} onChange={handleChange} placeholder="State" className="input" />
        <input name="country" value={formData.country ?? ""} onChange={handleChange} placeholder="Country" className="input" />
        <select name="level" value={formData.level} onChange={handleChange} className="input">
          <option value="college_grad">College Grad</option>
          <option value="intern">Intern</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button disabled={loading} className="btn-primary w-full md:w-auto">
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
} 