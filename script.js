
const images = [
  {
    title: "Sunset by the Sea",
    category: "Nature",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "City Vibes",
    category: "City",
    src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Pink Flower",
    category: "Flowers",
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Mountain View",
    category: "Nature",
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Travel Adventure",
    category: "Travel",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Green Forest",
    category: "Nature",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Beautiful Daisy",
    category: "Flowers",
    src: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "City Lights",
    category: "City",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Desert Journey",
    category: "Travel",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Ocean Waves",
    category: "Nature",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Urban Architecture",
    category: "City",
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Tropical Paradise",
    category: "Travel",
    src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85"
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const captionTitle = document.getElementById("caption-title");
const captionCategory = document.getElementById("caption-category");
const counter = document.getElementById("counter");

let currentIndex = 0;
let visibleImages = [...images];
let lastFocusedElement = null;

function renderGallery(category = "All") {
  visibleImages = images
    .map((image, index) => ({ ...image, index }))
    .filter(image =>
      category === "All" || image.category === category
    );

  gallery.innerHTML = "";

  visibleImages.forEach(image => {
    const card = document.createElement("article");
    card.className = "gallery-item";
    card.tabIndex = 0;
    card.setAttribute("aria-label", `View ${image.title}`);

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.title;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "image-info";

    const title = document.createElement("h3");
    title.textContent = image.title;

    const categoryText = document.createElement("p");
    categoryText.textContent = image.category;

    info.append(title, categoryText);
    card.append(img, info);

    card.addEventListener("click", () => openLightbox(image.index));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image.index);
      }
    });

    gallery.appendChild(card);
  });
}

function openLightbox(index) {
  currentIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("close").focus();
}

function updateLightbox() {
  const image = images[currentIndex];

  lightboxImg.src = image.src;
  lightboxImg.alt = image.title;
  captionTitle.textContent = image.title;
  captionCategory.textContent = image.category;
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
}

function showPrevious() {
  currentIndex =
    (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")
      ?.classList.remove("active");

    button.classList.add("active");
    renderGallery(button.dataset.category);
  });
});

document.getElementById("next").addEventListener("click", showNext);
document.getElementById("prev").addEventListener("click", showPrevious);
document.getElementById("close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "Escape") closeLightbox();
});

renderGallery();
