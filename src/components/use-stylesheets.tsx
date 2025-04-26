import { useEffect } from "react";
export default function useStyleSheets(stylesheets: string[]) {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    stylesheets.forEach((href) => {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      links.push(link);
    });
    return () => {
      links.forEach((link) => {
        document.head.removeChild(link);
      });
    };
  }, [stylesheets]);
}
