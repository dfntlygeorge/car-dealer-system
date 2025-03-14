import sanitizeHtml from "sanitize-html";
import parse from "html-react-parser";

export const HTMLParser = ({ html }: { html: string }) => {
  // sanitize the html to remove any malicious code, like cross-site scripting (XSS) attacks.
  // parse the html because react doesn't render raw html. If we don't parse it, the html will be rendered as a string.
  return parse(sanitizeHtml(html));
};
