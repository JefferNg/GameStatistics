import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
    stylesheets: [
        "/styles/reset.css",
        "/styles/tokens.css",
        "/styles/page.css"
    ],
    styles: [],
    scripts: [`document.body.addEventListener("dark-mode:toggle", (event) => {
                const page = event.currentTarget;
                const checked = event.detail.checked;
                page.classList.toggle("dark-mode", checked);
                });

                function toggleDarkMode(target, checked) {
                    const customEvent = new CustomEvent("dark-mode:toggle", {
                    bubbles: true,
                    detail: { checked },
                    });
                    target.dispatchEvent(customEvent);
                }
                    window.toggleDarkMode = toggleDarkMode`],
    googleFontURL: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    imports: {
        "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
};

export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
}