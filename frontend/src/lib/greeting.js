/* Dashboard greetings live here so the landlord and tenant workspaces always
   word them the same way — one place to change, both headers follow. */

export function timeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* e.g. "Thursday, 16 October" — the small line under the name. */
export function formattedToday(date = new Date()) {
  return date.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* "Abdulmuheez Yusuf" -> "Abdulmuheez", so greetings stay warm but short. */
export function firstNameOf(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}
