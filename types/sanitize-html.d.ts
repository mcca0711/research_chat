declare module 'sanitize-html' {
  export default function sanitizeHtml(
    html: string,
    options?: {
      allowedTags?: string[];
      allowedAttributes?: { [key: string]: string[] };
    }
  ): string;
}
