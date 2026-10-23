import DOMPurify from "isomorphic-dompurify";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "IMG") {
    node.setAttribute("loading", "lazy");
    node.setAttribute("decoding", "async");
  }
});

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};