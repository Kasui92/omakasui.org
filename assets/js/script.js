/**
 * Load and render projects from JSON
 * @returns {Promise<void>}
 */
async function loadProjects() {
  const scriptsSection = document.querySelector(".scripts");
  const scriptsContainer =
    scriptsSection.querySelector(".scripts-container") || scriptsSection;
  const heading = scriptsSection.querySelector("#scripts-heading");

  // Show loading placeholder
  showLoadingPlaceholder(scriptsContainer, heading);

  try {
    const response = await fetch("/data/projects.json");
    const projects = await response.json();

    // Clear loading placeholder
    clearContainer(scriptsContainer, heading);

    // Filter projects
    const visibleProjects = projects.filter((project) => !project.hidden);
    const hiddenProjects = projects.filter((project) => project.hidden);

    // Render visible projects
    visibleProjects.forEach((project) => {
      const card = createProjectCard(project);
      scriptsContainer.appendChild(card);
    });

    // Render hidden projects section if there are any
    if (hiddenProjects.length > 0) {
      createHiddenProjectsSection(scriptsContainer, hiddenProjects);
    }

    // Initialize animations after cards are rendered
    fadeInOnScroll();
  } catch (error) {
    console.error("Error loading projects:", error);
    showErrorPlaceholder(scriptsContainer, heading);
  }
}

/**
 * Show loading placeholder
 * @param {HTMLElement} container
 * @param {HTMLElement} heading
 */
function showLoadingPlaceholder(container, heading) {
  container.innerHTML = "";
  if (heading) {
    container.appendChild(heading);
  }

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-placeholder";
  loadingDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading projects...</p>
  `;
  container.appendChild(loadingDiv);
}

/**
 * Show error placeholder
 * @param {HTMLElement} container
 * @param {HTMLElement} heading
 */
function showErrorPlaceholder(container, heading) {
  container.innerHTML = "";
  if (heading) {
    container.appendChild(heading);
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "loading-placeholder";
  errorDiv.innerHTML = `
    <p>⚠️ Error loading projects. Please refresh the page.</p>
  `;
  container.appendChild(errorDiv);
}

/**
 * Clear container but keep heading
 * @param {HTMLElement} container
 * @param {HTMLElement} heading
 */
function clearContainer(container, heading) {
  container.innerHTML = "";
  if (heading) {
    container.appendChild(heading);
  }
}

/**
 * Create hidden projects section with accordion
 * @param {HTMLElement} container
 * @param {Array} hiddenProjects
 */
function createHiddenProjectsSection(container, hiddenProjects) {
  const hiddenSection = document.createElement("div");
  hiddenSection.className = "hidden-projects";

  // Create toggle button
  const toggleButton = document.createElement("button");
  toggleButton.className = "hidden-toggle";
  toggleButton.innerHTML = `
    <span>Hidden (${hiddenProjects.length})</span>
    <span class="arrow">▼</span>
  `;

  // Create hidden projects container
  const hiddenContainer = document.createElement("div");
  hiddenContainer.className = "hidden-projects-container";

  // Add hidden projects to container
  hiddenProjects.forEach((project) => {
    const card = createProjectCard(project);
    hiddenContainer.appendChild(card);
  });

  // Add toggle functionality
  toggleButton.addEventListener("click", (event) => {
    event.preventDefault();

    const isExpanded = toggleButton.classList.contains("expanded");

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
