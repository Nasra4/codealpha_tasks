
const images = [
    {
        title: "Sunset by the Sea",
        category: "Nature",
        src: "images/sunset.jpg"
    },
    {
        title: "City Vibes",
        category: "City",
        src: "images/city.jpg"
    },
    {
        title: "Pink Flower",
        category: "Flowers",
        src: "images/flower.jpg"
    },
    {
        title: "Mountain View",
        category: "Travel",
        src: "images/mountain.jpg"
    },
    {
        title: "Forest Path",
        category: "Nature",
        src: "images/forest.jpg"
    },
    {
        title: "Old Town",
        category: "City",
        src: "images/old-town.jpg"
    },
    {
        title: "Desert Journey",
        category: "Travel",
        src: "images/desert.jpg"
    },
    {
        title: "White Daisy",
        category: "Flowers",
        src: "images/daisy.jpg"
    },
    {
        title: "Ocean Escape",
        category: "Nature",
        src: "images/ocean.jpg"
    },
    {
        title: "Night Lights",
        category: "City",
        src: "images/night-city.jpg"
    },
    {
        title: "Tropical Beach",
        category: "Travel",
        src: "images/beach.jpg"
    },
    {
        title: "Quiet Garden",
        category: "Flowers",
        src: "images/garden.jpg"
    }
];


/* =================================
   2. SELECT HTML ELEMENTS
================================= */

const gallery = document.querySelector("#gallery");

const lightbox = document.querySelector("#lightbox");

const lightboxImg = document.querySelector("#lightbox-img");

const captionTitle = document.querySelector("#caption-title");

const captionCategory = document.querySelector("#caption-category");

const counter = document.querySelector("#counter");

const resultsCount = document.querySelector("#results-count");

const closeButton = document.querySelector("#close");


/* =================================
   3. VARIABLES
================================= */

// Index of the image currently shown in the lightbox.
let currentIndex = 0;

// Images currently displayed after applying a filter.
let visibleImages = [...images];

// Remember which element was focused before opening the lightbox.
let lastFocusedElement = null;


/* =================================
   4. DISPLAY GALLERY IMAGES
================================= */

function renderGallery(category = "All") {

    // Add the original position to each image.
    // This allows the lightbox to navigate all images.
    visibleImages = images
        .map((image, index) => ({
            ...image,
            index
        }))
        .filter(image =>
            category === "All" ||
            image.category === category
        );

    // Remove the old gallery cards.
    gallery.replaceChildren();

    // Update the image count.
    resultsCount.textContent =
        `${visibleImages.length} photo` +
        `${visibleImages.length === 1 ? "" : "s"}`;

    // Create one card for each matching image.
    visibleImages.forEach((image, cardIndex) => {

        const card = document.createElement("button");

        card.type = "button";
        card.className = "gallery-card";

        card.style.animationDelay =
            `${Math.min(cardIndex * 35, 250)}ms`;

        card.setAttribute(
            "aria-label",
            `Open ${image.title}`
        );

        // Create the image element.
        const img = document.createElement("img");

        img.src = image.src;
        img.alt = image.title;
        img.loading = "lazy";
        img.width = 800;
        img.height = 600;

        // Create the information container.
        const info = document.createElement("div");

        info.className = "card-info";

        // Create the image title.
        const title = document.createElement("h2");

        title.textContent = image.title;

        // Create the image category.
        const categoryText = document.createElement("p");

        categoryText.textContent = image.category;

        // Put the title and category inside the card.
        info.append(title, categoryText);

        // Put the image and information inside the card.
        card.append(img, info);

        // Open the selected image when clicked.
        card.addEventListener("click", () => {
            openLightbox(image.index);
        });

        // Add the completed card to the gallery.
        gallery.append(card);
    });
}


/* =================================
   5. UPDATE LIGHTBOX CONTENT
================================= */

function updateLightbox() {

    // Get the currently selected image.
    const image = images[currentIndex];

    // Update the large image.
    lightboxImg.src = image.src;
    lightboxImg.alt = image.title;

    // Update its title and category.
    captionTitle.textContent = image.title;

    captionCategory.textContent = image.category;

    // Display the current image number.
    counter.textContent =
        `${currentIndex + 1} / ${images.length}`;
}


/* =================================
   6. OPEN LIGHTBOX
================================= */

function openLightbox(index) {

    // Remember the selected image.
    currentIndex = index;

    // Remember the element that opened the viewer.
    lastFocusedElement = document.activeElement;

    // Display the selected image.
    updateLightbox();

    // Make the lightbox visible.
    lightbox.classList.add("open");

    lightbox.setAttribute("aria-hidden", "false");

    // Prevent background scrolling.
    document.body.style.overflow = "hidden";

    // Move keyboard focus to the close button.
    closeButton.focus();
}


/* =================================
   7. CLOSE LIGHTBOX
================================= */

function closeLightbox() {

    // Hide the lightbox.
    lightbox.classList.remove("open");

    lightbox.setAttribute("aria-hidden", "true");

    // Restore normal page scrolling.
    document.body.style.overflow = "";

    // Return focus to the previous element.
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}


/* =================================
   8. NEXT IMAGE
================================= */

function showNext() {

    // Move forward by one image.
    // Return to the first image after the last.
    currentIndex =
        (currentIndex + 1) % images.length;

    updateLightbox();
}


/* =================================
   9. PREVIOUS IMAGE
================================= */

function showPrevious() {

    // Move backward by one image.
    // Wrap around to the last image if needed.
    currentIndex =
        (currentIndex - 1 + images.length) %
        images.length;

    updateLightbox();
}


/* =================================
   10. CATEGORY FILTERS
================================= */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        // Remove the active style from the old filter.
        document
            .querySelector(".filter.active")
            ?.classList.remove("active");

        // Reset the previous filter's accessibility state.
        document
            .querySelector('.filter[aria-pressed="true"]')
            ?.setAttribute("aria-pressed", "false");

        // Activate the clicked filter.
        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");

        // Render only the selected category.
        renderGallery(button.dataset.category);
    });
});


/* =================================
   11. BUTTON EVENT LISTENERS
================================= */

// Next button.
document
    .querySelector("#next")
    .addEventListener("click", showNext);

// Previous button.
document
    .querySelector("#prev")
    .addEventListener("click", showPrevious);

// Close button.
closeButton.addEventListener("click", closeLightbox);


/* =================================
   12. CLOSE BY CLICKING BACKGROUND
================================= */

lightbox.addEventListener("click", event => {

    // Close only when the dark background is clicked,
    // not when the image or navigation buttons are clicked.
    if (event.target === lightbox) {
        closeLightbox();
    }
});


/* =================================
   13. KEYBOARD NAVIGATION
================================= */

document.addEventListener("keydown", event => {

    // Ignore these keys when the lightbox is closed.
    if (!lightbox.classList.contains("open")) {
        return;
    }

    // Right arrow: next image.
    if (event.key === "ArrowRight") {
        showNext();
    }

    // Left arrow: previous image.
    if (event.key === "ArrowLeft") {
        showPrevious();
    }

    // Escape: close the lightbox.
    if (event.key === "Escape") {
        closeLightbox();
    }
});


/* =================================
   14. INITIALIZE THE GALLERY
================================= */

// Display all images when the page loads.
renderGallery();
