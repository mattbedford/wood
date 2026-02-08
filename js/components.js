/* ==========================================================
   WEB COMPONENTS — Shared header and footer
   ==========================================================

   Web Components let you define custom HTML elements (like
   <site-header>) that render their own markup. This means
   every page just writes <site-header></site-header> and
   gets the same nav — no copy-pasting, no PHP includes.

   How it works:
   1. You create a class that extends HTMLElement
   2. In connectedCallback() (runs when the element is added
      to the page), you set this.innerHTML to your markup
   3. You register it with customElements.define('tag-name', Class)
   4. That's it — the browser handles the rest

   No Shadow DOM here. The component's HTML lives in the
   normal document and inherits styles from style.css.
   ========================================================== */


/* ----------------------------------------------------------
   <site-header>
   ----------------------------------------------------------
   Renders the main navigation bar. Automatically highlights
   the current page's link based on the URL.
   ---------------------------------------------------------- */

class SiteHeader extends HTMLElement {

    connectedCallback() {
        // Work out which page we're on, so we can mark its nav
        // link as "active". We just check the filename in the URL.
        const path = window.location.pathname;
        const isHome     = path === '/' || path.endsWith('index.html');
        const isProjects = path.endsWith('projects.html');
        const isAbout    = path.endsWith('about.html');

        this.innerHTML = `
            <nav class="site-nav" aria-label="Main navigation">
                <a href="/" class="wordmark">Matt Bedford</a>
                <ul>
                    <li><a href="projects.html"${isProjects ? ' class="active"' : ''}>Projects</a></li>
                    <li><a href="about.html"${isAbout ? ' class="active"' : ''}>About</a></li>
                </ul>
            </nav>
        `;
    }
}


/* ----------------------------------------------------------
   <site-footer>
   ----------------------------------------------------------
   Renders the footer with contact info. No dedicated contact
   page — this is where people find you.
   ---------------------------------------------------------- */

class SiteFooter extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <p class="footer-name">Matt Bedford</p>
                <p>Handmade woodwork from a small workshop in the UK.</p>
                <p style="margin-top: var(--space-sm);">
                    <a href="mailto:matt@mattbedford.work">matt@mattbedford.work</a>
                </p>
            </footer>
        `;
    }
}


/* ----------------------------------------------------------
   Register the components.

   The tag names MUST contain a hyphen (e.g. "site-header",
   not "siteheader"). This is a Web Components rule — it
   prevents collisions with current/future HTML elements.
   ---------------------------------------------------------- */

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
