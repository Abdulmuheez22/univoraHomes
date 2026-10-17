/* Photo rules shared by every upload input (add-property form, edit-property
   form) so both reject the same files with the same wording. */

export const IMAGE_FORMAT_LABEL = "PNG, JPG, GIF or WEBP";
export const MAX_PHOTOS = 5;

// Fallback for the odd browser that hands us a file with no MIME type.
const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|bmp|avif|heic|heif)$/i;

export function isImageFile(file) {
  if (!file) return false;
  if (file.type) return file.type.startsWith("image/");
  return IMAGE_EXTENSION.test(file.name || "");
}

/* "a.pdf isn't an image — only PNG, JPG, GIF or WEBP files can be uploaded." */
export function rejectedFilesMessage(rejected) {
  const names = rejected.map((file) => file.name || "That file");
  const shown = names.slice(0, 3).join(", ");
  const rest = names.length > 3 ? ` and ${names.length - 3} more` : "";
  return `${shown}${rest} ${
    names.length === 1 ? "isn't an image" : "aren't images"
  } — only ${IMAGE_FORMAT_LABEL} files can be uploaded.`;
}

/* Logs the rejects so an unexpected upload shows up in the console. */
export function logRejectedFiles(rejected, context) {
  if (!rejected.length) return;
  console.error(
    `Rejected ${rejected.length} non-image file${
      rejected.length === 1 ? "" : "s"
    } ${context}:`,
    rejected.map((file) => `${file.name} (${file.type || "unknown type"})`),
  );
}
