/**
 * Load and render manuals from JSON
 * @returns {Promise<void>}
 */
async function loadManuals() {
  const loadingPlaceholder = document.getElementById("loading-placeholder");
  const errorPlaceholder = document.getElementById("error-placeholder");
  const manualsGrid = document.getElementById("manuals-grid");
  const hiddenManualsSection = document.getElementById("hidden-manuals");

  // Show loading, hide error
  showElement(loadingPlaceholder);
  hideElement(errorPlaceholder);

  try {
    const response = await fetch("/manuals/data/manuals.json");
    const manuals = await response.json();

    // Hide loading placeholder
    hideElement(loadingPlaceholder);

    // Filter manuals
    const visibleManuals = manuals.filter((manual) => !manual.hidden);
    const hiddenManuals = manuals.filter((manual) => manual.hidden);

    // Clear and render visible manuals
    manualsGrid.innerHTML = "";
    visibleManuals.forEach((manual) => {
      const card = createManualCard(manual);
      manualsGrid.appendChild(card);
    });

    // Setup hidden manuals if any
    if (hiddenManuals.length > 0) {
      setupHiddenManuals(hiddenManuals);
      showElement(hiddenManualsSection);
    } else {
      hideElement(hiddenManualsSection);
    }

    // Initialize animations after cards are rendered
    fadeInOnScroll();
  } catch (error) {
    console.error("Error loading manuals:", error);
    hideElement(loadingPlaceholder);
    showElement(errorPlaceholder);
  }
}

/**
 * Show element by removing hidden class
 * @param {HTMLElement} element
 */
function showElement(element) {
  if (element) element.classList.remove("hidden");
}

/**
 * Hide element by adding hidden class
 * @param {HTMLElement} element
 */
function hideElement(element) {
  if (element) element.classList.add("hidden");
}

/**
 * Setup hidden manuals functionality
 * @param {Array} hiddenManuals
 */
function setupHiddenManuals(hiddenManuals) {
  const hiddenToggle = document.getElementById("hidden-toggle");
  const hiddenCount = document.getElementById("hidden-count");
  const hiddenContainer = document.getElementById("hidden-manuals-container");
  const hiddenGrid = document.getElementById("hidden-manuals-grid");

  // Update count
  hiddenCount.textContent = `( ${hiddenManuals.length} hidden items )`;

  // Clear and populate hidden manuals
  hiddenGrid.innerHTML = "";
  hiddenGrid.className = "manuals-grid";
  hiddenManuals.forEach((manual) => {
    const card = createManualCard(manual);
    hiddenGrid.appendChild(card);
  });

  // Remove existing event listeners by cloning the element
  const newToggle = hiddenToggle.cloneNode(true);
  hiddenToggle.parentNode.replaceChild(newToggle, hiddenToggle);

  // Add toggle functionality
  newToggle.addEventListener("click", (event) => {
    event.preventDefault();

    const isExpanded = newToggle.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    newToggle.setAttribute("aria-expanded", newState);
    hiddenContainer.classList.toggle("expanded", newState);

    // Re-run fade-in animation for newly visible hidden cards
    if (newState) {
      setTimeout(() => {
        fadeInOnScroll();
      }, 100);
    }
  });
}

/**
 * Create a manual book element
 * @param {Object} manual - Manual data
 * @returns {HTMLElement} - The manual book element
 */
function createManualCard(manual) {
  const book = document.createElement("a");
  book.className = `manual-book ${manual.status}`;
  book.href = manual.url;
  book.title = `View ${manual.name} manual`;

  book.innerHTML = `
    <div class="book-cover">
      <div class="book-cover-inner">
        <img src="${manual.coverImage}" alt="${manual.name} logo" />
      </div>
    </div>
    <div class="book-title">
      <h3>${manual.name}</h3>
    </div>
  `;

  return book;
}

/**
 * Fade-in animation on scroll using Intersection Observer
 * @returns {void}
 */
function fadeInOnScroll() {
  const elements = document.querySelectorAll(".manual-book:not(.animated)");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", loadManuals);
