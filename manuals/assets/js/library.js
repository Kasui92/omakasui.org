/**
 * Load and render manuals from JSON
 * @returns {Promise<void>}
 */
async function loadManuals() {
  const manualsSection = document.querySelector(".manuals-library");

  // Show loading placeholder
  showLoadingPlaceholder(manualsSection);

  try {
    const response = await fetch("/manuals/data/manuals.json");
    const manuals = await response.json();

    // Clear loading placeholder
    clearLoadingPlaceholder(manualsSection);

    // Filter manuals
    const visibleManuals = manuals.filter((manual) => !manual.hidden);
    const hiddenManuals = manuals.filter((manual) => manual.hidden);

    // Create manuals grid
    const manualsGrid = document.createElement("div");
    manualsGrid.className = "manuals-grid";

    // Render visible manuals
    visibleManuals.forEach((manual) => {
      const card = createManualCard(manual);
      manualsGrid.appendChild(card);
    });

    manualsSection.appendChild(manualsGrid);

    // Render hidden manuals section if there are any
    if (hiddenManuals.length > 0) {
      createHiddenManualsSection(manualsSection, hiddenManuals);
    }

    // Initialize animations after cards are rendered
    fadeInOnScroll();
  } catch (error) {
    console.error("Error loading manuals:", error);
    showErrorPlaceholder(manualsSection);
  }
}

/**
 * Show loading placeholder
 * @param {HTMLElement} container
 */
function showLoadingPlaceholder(container) {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-placeholder";
  loadingDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading manuals...</p>
  `;
  container.appendChild(loadingDiv);
}

/**
 * Show error placeholder
 * @param {HTMLElement} container
 */
function showErrorPlaceholder(container) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "loading-placeholder";
  errorDiv.innerHTML = `
    <p>⚠️ Error loading manuals. Please refresh the page.</p>
  `;
  container.appendChild(errorDiv);
}

/**
 * Clear loading placeholder
 * @param {HTMLElement} container
 */
function clearLoadingPlaceholder(container) {
  const loadingPlaceholder = container.querySelector(".loading-placeholder");
  if (loadingPlaceholder) {
    loadingPlaceholder.remove();
  }
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
 * Create hidden manuals section with accordion
 * @param {HTMLElement} container
 * @param {Array} hiddenManuals
 */
function createHiddenManualsSection(container, hiddenManuals) {
  const hiddenSection = document.createElement("div");
  hiddenSection.className = "hidden-manuals";

  // Create toggle button
  const toggleButton = document.createElement("button");
  toggleButton.className = "hidden-toggle";
  toggleButton.innerHTML = `
    <span>Hidden (${hiddenManuals.length})</span>
    <span class="arrow">▼</span>
  `;

  // Create hidden manuals container with grid
  const hiddenContainer = document.createElement("div");
  hiddenContainer.className = "hidden-manuals-container";

  const hiddenGrid = document.createElement("div");
  hiddenGrid.className = "manuals-grid";

  // Add hidden manuals to grid
  hiddenManuals.forEach((manual) => {
    const card = createManualCard(manual);
    hiddenGrid.appendChild(card);
  });

  hiddenContainer.appendChild(hiddenGrid);

  // Add toggle functionality
  toggleButton.addEventListener("click", (event) => {
    event.preventDefault();

    toggleButton.classList.toggle("expanded");
    hiddenContainer.classList.toggle("expanded");

    // Re-run fade-in animation for newly visible hidden cards
    if (hiddenContainer.classList.contains("expanded")) {
      setTimeout(() => {
        fadeInOnScroll();
      }, 100);
    }
  });

  hiddenSection.appendChild(toggleButton);
  hiddenSection.appendChild(hiddenContainer);
  container.appendChild(hiddenSection);
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
