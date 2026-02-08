/* ==========================================================
   PROJECTS PAGE — Fetch data, render grid, handle filtering
   ==========================================================

   This script:
   1. Fetches projects.json
   2. Builds the tag filter buttons from the data
   3. Renders a card for each project
   4. Handles click-to-filter (show/hide by tag)

   No frameworks, no dependencies. Just DOM manipulation.
   ========================================================== */


/* ----------------------------------------------------------
   Kick everything off once the DOM is ready.
   We use an async IIFE (immediately invoked function
   expression) so we can use await at the top level.
   ---------------------------------------------------------- */

(async function () {

    // -- Fetch the project data ----------------------------------

    const response = await fetch('projects.json');
    const data = await response.json();

    const baseUrl  = data.imageBaseUrl;
    const projects = data.projects;

    // -- Gather all unique tags from every project ---------------
    // flatMap grabs each project's tags array and flattens them
    // into one list. The Set removes duplicates. Sort them
    // alphabetically so the order is predictable.

    const allTags = [...new Set(projects.flatMap(p => p.tags))].sort();

    // -- Render the filter buttons -------------------------------

    const filtersContainer = document.getElementById('tag-filters');
    renderFilters(filtersContainer, allTags);

    // -- Render the project grid ---------------------------------

    const gridContainer = document.getElementById('project-grid');
    renderGrid(gridContainer, projects, baseUrl);

})();


/* ----------------------------------------------------------
   renderFilters — builds the tag filter buttons.

   Creates an "All" button (active by default) plus one
   button per tag. Clicking a button filters the grid.
   ---------------------------------------------------------- */

function renderFilters(container, tags) {

    // "All" button comes first
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.classList.add('active');
    allBtn.addEventListener('click', () => filterByTag(null, container));
    container.appendChild(allBtn);

    // One button per tag
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.textContent = tag;
        btn.addEventListener('click', () => filterByTag(tag, container));
        container.appendChild(btn);
    });
}


/* ----------------------------------------------------------
   renderGrid — builds a project card for each project.

   Each card links to the single project page via query
   parameter: project.html?slug=xxx

   Image URL is constructed from: baseUrl/slug/mainImage
   ---------------------------------------------------------- */

function renderGrid(container, projects, baseUrl) {

    projects.forEach(project => {
        const imageUrl = `${baseUrl}/${project.slug}/${project.mainImage}`;

        // Build the card HTML. Each card stores its tags in a
        // data attribute so the filter function can read them.
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.tags = JSON.stringify(project.tags);

        card.innerHTML = `
            <a href="project.html?slug=${project.slug}">
                <div class="img-wrap">
                    <img
                        src="${imageUrl}"
                        alt="${project.title}"
                        width="700"
                        height="525"
                        loading="lazy"
                    >
                </div>
                <div class="project-card-body">
                    <h3>${project.title}</h3>
                    <span class="tag">${project.tags.join(' / ')}</span>
                </div>
            </a>
        `;

        container.appendChild(card);
    });
}


/* ----------------------------------------------------------
   filterByTag — shows/hides cards based on the selected tag.

   tag = null means "show all".

   How it works:
   1. Update which filter button has the "active" class
   2. Loop through every project card
   3. Read its data-tags attribute (a JSON array of tags)
   4. If the card has the selected tag (or we're showing all),
      remove the "hidden" class; otherwise add it
   ---------------------------------------------------------- */

function filterByTag(tag, filtersContainer) {

    // Update active button
    const buttons = filtersContainer.querySelectorAll('button');
    buttons.forEach(btn => {
        // "All" button is active when tag is null;
        // otherwise the button whose text matches the tag
        const isActive = (tag === null && btn.textContent === 'All')
                      || (btn.textContent === tag);
        btn.classList.toggle('active', isActive);
    });

    // Show/hide cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardTags = JSON.parse(card.dataset.tags);
        const visible  = (tag === null) || cardTags.includes(tag);
        card.classList.toggle('hidden', !visible);
    });
}
