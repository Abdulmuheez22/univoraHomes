import type { ZodError } from "zod";

/* Turns zod issues into a { field: message } map so a form can show each
   message next to the field it belongs to, instead of one vague sentence.
   The first issue per field wins. */
export const collectFieldErrors = (error: ZodError) => {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
};

/* One sentence naming everything that is wrong, used as the headline message. */
export const summarizeFieldErrors = (fieldErrors: Record<string, string>) => {
  const messages = Object.values(fieldErrors);
  if (messages.length === 0) return "Please check the form and try again.";
  if (messages.length === 1) return messages[0];
  return `Please fix ${messages.length} problems: ${messages.join(" ")}`;
};
