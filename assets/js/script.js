/**
 * Load and render projects from JSON
 * @returns {Promise<void>}
 */
async function loadProjects() {
  const loadingPlaceholder = document.getElementById("loading-placeholder");
  const errorPlaceholder = document.getElementById("error-placeholder");
  const scriptsContainer = document.getElementById("scripts-container");
  const hiddenProjectsSection = document.getElementById("hidden-projects");

  // Show loading, hide error
  showElement(loadingPlaceholder);
  hideElement(errorPlaceholder);

  try {
    const response = await fetch("/data/projects.json");
    const projects = await response.json();

    // Hide loading placeholder
    hideElement(loadingPlaceholder);

    // Filter projects
    const visibleProjects = projects.filter((project) => !project.hidden);
    const hiddenProjects = projects.filter((project) => project.hidden);

    // Clear and render visible projects
    scriptsContainer.innerHTML = "";
    visibleProjects.forEach((project) => {
      const card = createProjectCard(project);
      scriptsContainer.appendChild(card);
    });

    // Setup hidden projects if any
    if (hiddenProjects.length > 0) {
      setupHiddenProjects(hiddenProjects);
      showElement(hiddenProjectsSection);
    } else {
      hideElement(hiddenProjectsSection);
    }

    // Initialize animations after cards are rendered
    fadeInOnScroll();
  } catch (error) {
    console.error("Error loading projects:", error);
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
 * Setup hidden projects functionality
 * @param {Array} hiddenProjects
 */
function setupHiddenProjects(hiddenProjects) {
  const hiddenToggle = document.getElementById("hidden-toggle");
  const hiddenCount = document.getElementById("hidden-count");
  const hiddenContainer = document.getElementById("hidden-projects-container");
  const hiddenScriptsContainer = document.getElementById(
    "hidden-scripts-container"
  );

  // Update count
  hiddenCount.textContent = `( ${hiddenProjects.length} hidden items )`;

  // Clear and populate hidden projects
  hiddenScriptsContainer.innerHTML = "";
  hiddenProjects.forEach((project) => {
    const card = createProjectCard(project);
    hiddenScriptsContainer.appendChild(card);
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
 * Create a project card element
 * @param {Object} project - Project data
 * @returns {HTMLElement} - The project card element
 */
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "script-card";

  // Build status icons HTML
  let statusIcons = "";
  if (project.status && project.status.length > 0) {
    statusIcons = project.status
      .map(
        (status) =>
          `<i class="nf ${status.icon}" aria-label="${status.label}" title="${status.title}"></i>`
      )
      .join("\n            ");
  }

  // Build project links HTML
  let projectLinks = "The ";
  const links = [];

  if (project.githubUrl) {
    links.push(
      `<a href="${project.githubUrl}" target="_blank" title="View ${project.name} source code on GitHub" rel="noopener">source code</a>`
    );
  }

  if (project.manualUrl) {
    links.push(
      `<a href="${project.manualUrl}" title="View ${project.name} documentation and manual">manual</a>`
    );
  }

  if (links.length === 2) {
    projectLinks += links.join(" and ") + " are available.";
  } else if (links.length === 1) {
    projectLinks += links[0] + " is available.";
  } else {
    projectLinks = "";
  }

  card.innerHTML = `
    <h3>
      >
      <a
        href="${project.githubUrl}"
        target="_blank"
        title="View ${project.name} source code on GitHub"
        rel="noopener"
        >${project.name}</a
      >
      ${statusIcons ? "\n            " + statusIcons : ""}
    </h3>
    <p>${project.description}</p>
    <div
      class="command-box"
      role="group"
      aria-label="Installation command for ${project.name}"
    >
      <code aria-label="Installation command"
        >${project.installCommand}</code
      >
    </div>
    ${projectLinks ? `<p class="project-links">${projectLinks}</p>` : ""}
  `;

  return card;
}

/**
 * Fade-in animation on scroll using Intersection Observer
 * @returns {void}
 */
function fadeInOnScroll() {
  const elements = document.querySelectorAll(".script-card:not(.animated)");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", loadProjects);
