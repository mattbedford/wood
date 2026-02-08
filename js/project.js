/* ==========================================================
   SINGLE PROJECT PAGE — Detail view with gallery & lightbox
   ==========================================================

   This script:
   1. Reads the slug from the URL query parameter
   2. Fetches projects.json and finds the matching project
   3. Renders the main image, info, and gallery
   4. Builds prev/next project navigation
   5. Handles the lightbox (open, close, navigate)

   ========================================================== */


(async function () {

    // -- Get the slug from the URL --------------------------------
    // e.g. project.html?slug=oak-coffee-table → "oak-coffee-table"

    const params = new URLSearchParams(window.location.search);
    const slug   = params.get('slug');

    if (!slug) {
        document.getElementById('project-info').innerHTML =
            '<p>Project not found. <a href="projects.html">Back to projects</a></p>';
        return;
    }

    // -- Fetch project data --------------------------------------

    const response = await fetch('projects.json');
    const data     = await response.json();

    const baseUrl  = data.imageBaseUrl;
    const projects = data.projects;

    // Find this project and its position in the list
    const index   = projects.findIndex(p => p.slug === slug);
    const project = projects[index];

    if (!project) {
        document.getElementById('project-info').innerHTML =
            '<p>Project not found. <a href="projects.html">Back to projects</a></p>';
        return;
    }

    // -- Update the page title ------------------------------------

    document.title = `${project.title} — Matt Bedford Woodwork`;

    // -- Render the main image ------------------------------------

    const heroUrl = `${baseUrl}/${project.slug}/${project.mainImage}`;

    document.getElementById('project-hero').innerHTML = `
        <img
            src="${heroUrl}"
            alt="${project.title}"
            width="1200"
            height="800"
        >
    `;

    // -- Render project info --------------------------------------

    // Format the date nicely (e.g. "August 2024")
    const date = new Date(project.date);
    const formattedDate = date.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
    });

    document.getElementById('project-info').innerHTML = `
        <h1>${project.title}</h1>
        <p class="project-meta">
            ${formattedDate} &middot; ${project.tags.join(' / ')}
        </p>
        <p class="description">${project.description}</p>
    `;

    // -- Render the gallery ---------------------------------------
    // Only show the gallery section if there are gallery images

    if (project.gallery && project.gallery.length > 0) {

        // Build the full URL for each gallery image
        const galleryUrls = project.gallery.map(
            filename => `${baseUrl}/${project.slug}/${filename}`
        );

        const galleryHtml = galleryUrls.map((url, i) => `
            <img
                src="${url}"
                alt="${project.title} — photo ${i + 1}"
                width="700"
                height="525"
                loading="lazy"
                data-index="${i}"
            >
        `).join('');

        document.getElementById('gallery').innerHTML = `
            <h2>Gallery</h2>
            <div class="gallery-grid">${galleryHtml}</div>
        `;

        // -- Set up the lightbox ----------------------------------
        initLightbox(galleryUrls);
    }

    // -- Render prev/next navigation ------------------------------

    const prevProject = projects[index - 1];
    const nextProject = projects[index + 1];

    let navHtml = '';

    if (prevProject) {
        navHtml += `
            <a href="project.html?slug=${prevProject.slug}">
                &larr; Previous
                <span class="label">${prevProject.title}</span>
            </a>`;
    } else {
        // Empty spacer to keep "next" aligned right
        navHtml += '<span></span>';
    }

    if (nextProject) {
        navHtml += `
            <a href="project.html?slug=${nextProject.slug}" style="text-align: right;">
                Next &rarr;
                <span class="label">${nextProject.title}</span>
            </a>`;
    }

    document.getElementById('project-nav').innerHTML = navHtml;

})();


/* ==========================================================
   LIGHTBOX
   ==========================================================
   A simple full-screen image viewer. No libraries.

   - Click a gallery thumbnail → opens lightbox at that image
   - Click close button or the backdrop → closes
   - Click prev/next arrows or use arrow keys → navigate
   - Press Escape → closes
   ========================================================== */

function initLightbox(imageUrls) {

    const lightbox  = document.getElementById('lightbox');
    const lbImg     = lightbox.querySelector('img');
    const btnClose  = lightbox.querySelector('.lightbox-close');
    const btnPrev   = lightbox.querySelector('.lightbox-prev');
    const btnNext   = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;

    // -- Show a specific image ------------------------------------

    function showImage(index) {
        currentIndex = index;
        lbImg.src = imageUrls[index];
        lbImg.alt = `Photo ${index + 1} of ${imageUrls.length}`;

        // Hide prev/next if at the start/end
        btnPrev.style.display = (index === 0) ? 'none' : '';
        btnNext.style.display = (index === imageUrls.length - 1) ? 'none' : '';
    }

    // -- Open the lightbox ----------------------------------------

    function open(index) {
        showImage(index);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';  // prevent background scroll
    }

    // -- Close the lightbox ---------------------------------------

    function close() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    // -- Attach event listeners -----------------------------------

    // Click a gallery thumbnail to open
    document.querySelectorAll('.gallery-grid img').forEach(img => {
        img.addEventListener('click', () => {
            open(parseInt(img.dataset.index, 10));
        });
    });

    // Close button
    btnClose.addEventListener('click', close);

    // Click the dark backdrop (but not the image itself) to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Prev / Next buttons
    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) showImage(currentIndex - 1);
    });

    btnNext.addEventListener('click', () => {
        if (currentIndex < imageUrls.length - 1) showImage(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'Escape')                                close();
        if (e.key === 'ArrowLeft'  && currentIndex > 0)        showImage(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < imageUrls.length - 1) showImage(currentIndex + 1);
    });
}
