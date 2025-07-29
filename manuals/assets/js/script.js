class DocumentationApp {
  constructor() {
    // Ensure proper URL format before initializing
    this.ensureTrailingSlash();
    this.initializeElements();
    this.initializeState();
    this.init();
  }

  ensureTrailingSlash() {
    const currentPath = window.location.pathname;
    const currentHost = window.location.host;

    // Only apply this logic if we're on the manuals subdomain
    if (currentHost === "manuals.omakasui.org" && !currentPath.endsWith("/")) {
      const correctedUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        currentPath +
        "/" +
        window.location.search +
        window.location.hash;
      window.history.replaceState(null, "", correctedUrl);
    }
  }

  initializeElements() {
    this.sidebar = document.getElementById("sidebar");
    this.toggleBtnDesktop = document.getElementById("toggleBtnDesktop");
    this.toggleBtnMobile = document.getElementById("toggleBtnMobile");
    this.content = document.getElementById("content");
    this.navLinks = null;

    // Navigation elements
    this.pageNavigation = document.getElementById("pageNavigation");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.prevTitle = document.getElementById("prevTitle");
    this.nextTitle = document.getElementById("nextTitle");
  }

  initializeState() {
    this.config = window.DOCS_CONFIG;
    this.currentPage = this.getInitialPageFromURL();
    this.pageCache = new Map();

    // Create ordered list of pages for navigation
    this.pageOrder = Object.keys(this.config.pages);
  }

  async init() {
    this.generateNavigation();
    this.bindEvents();
    await this.preloadAllPages();
    await this.loadPage(this.currentPage);
    this.setDocumentTitle();
  }

  setDocumentTitle() {
    document.title = this.config.siteTitle;
  }

  generateNavigation() {
    const navMenu = document.getElementById("navMenu");
    navMenu.innerHTML = "";

    Object.entries(this.config.pages).forEach(([pageKey, pageData]) => {
      const navItem = this.createNavigationItem(pageKey, pageData);
      navMenu.appendChild(navItem);
    });

    this.navLinks = document.querySelectorAll(".nav-link");
  }

  createNavigationItem(pageKey, pageData) {
    const li = document.createElement("li");
    li.className = "nav-item";

    const link = this.createNavigationLink(pageKey, pageData);
    li.appendChild(link);

    return li;
  }

  createNavigationLink(pageKey, pageData) {
    const link = document.createElement("a");
    link.href = "#";
    link.className = `nav-link${
      pageKey === this.config.defaultPage ? " active" : ""
    }`;
    link.dataset.page = pageKey;

    const icon = this.createIcon(pageData.icon);
    const text = this.createText(pageData.title);

    link.appendChild(icon);
    link.appendChild(text);

    return link;
  }

  createIcon(iconText) {
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = iconText;
    return icon;
  }

  createText(textContent) {
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = textContent;
    return text;
  }

  async preloadAllPages() {
    const loadPromises = Object.entries(this.config.pages).map(
      async ([pageKey, pageData]) => {
        try {
          const html = await this.fetchPageContent(pageData.file);
          this.pageCache.set(pageKey, html);
        } catch (error) {
          this.pageCache.set(
            pageKey,
            this.createErrorContent(pageData.title, "Failed to load")
          );
        }
      }
    );

    await Promise.all(loadPromises);
  }

  async fetchPageContent(file) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  }

  createErrorContent(title, message) {
    return `<div style="text-align: center; padding: 2rem; color: #e74c3c;">
        <h2>Content Not Available</h2>
        <p>The page "${title}" is not available. ${message}</p>
      </div>`;
  }

  getInitialPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromURL = urlParams.get("page");
    return pageFromURL && this.config.pages[pageFromURL]
      ? pageFromURL
      : this.config.defaultPage;
  }

  bindEvents() {
    this.bindToggleButtons();
    this.bindDocumentClick();
    this.bindWindowResize();
    this.bindPopstate();
    this.bindHashChange();
    this.bindNavigationButtons();
  }

  bindToggleButtons() {
    const handleToggleClick = (e) => {
      e.stopPropagation();
      this.toggleSidebar();
    };

    this.toggleBtnDesktop?.addEventListener("click", handleToggleClick);
    this.toggleBtnMobile?.addEventListener("click", handleToggleClick);
  }

  bindDocumentClick() {
    document.addEventListener("click", (e) => {
      this.handleDocumentClick(e);
    });
  }

  bindWindowResize() {
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  }

  bindPopstate() {
    window.addEventListener("popstate", (e) => {
      const page = e.state?.page || this.getInitialPageFromURL();
      this.loadPage(page, false);
    });
  }

  bindHashChange() {
    window.addEventListener("hashchange", () => {
      if (window.location.hash) {
        const headingId = window.location.hash.substring(1);
        this.scrollToHeading(headingId);
      }
    });
  }

  bindNavigationButtons() {
    this.prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const prevPage = this.getPreviousPage();
      if (prevPage) {
        this.navigateToPage(prevPage);
      }
    });

    this.nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const nextPage = this.getNextPage();
      if (nextPage) {
        this.navigateToPage(nextPage);
      }
    });
  }

  handleDocumentClick(e) {
    const target = e.target;

    // Early return for toggle button clicks
    if (target.closest(".toggle-btn")) return;

    // Handle copy buttons
    if (this.handleCopyButtonClick(target, e)) return;

    // Handle navigation links
    if (this.handleNavigationClick(target, e)) return;

    // Handle internal page navigation
    if (this.handleInternalPageNavigation(target, e)) return;

    // Close sidebar if clicking outside
    this.handleOutsideClick(target);
  }

  handleCopyButtonClick(target, e) {
    const copyBtn = target.closest(".copy-btn");
    if (copyBtn) {
      e.preventDefault();
      const command = copyBtn.dataset.command;
      if (command) {
        this.handleCopyCommand(copyBtn, command);
      }
      return true;
    }
    return false;
  }

  handleNavigationClick(target, e) {
    const navLink = target.closest(".nav-link");
    if (navLink) {
      e.preventDefault();
      this.navigateToPage(navLink.dataset.page);
      if (this.isMobileView()) this.closeSidebar();
      return true;
    }
    return false;
  }

  handleInternalPageNavigation(target, e) {
    const dataPageLink = target.closest("[data-page]");
    if (dataPageLink && !target.closest(".nav-link")) {
      e.preventDefault();
      this.navigateToPage(dataPageLink.dataset.page);
      return true;
    }
    return false;
  }

  handleOutsideClick(target) {
    const sidebarOpen = this.isSidebarOpen();
    if (!target.closest(".sidebar") && sidebarOpen) {
      this.closeSidebar();
    }
  }

  handleWindowResize() {
    if (!this.isMobileView()) {
      this.sidebar.classList.remove("open");
    }
    this.updateToggleButton();
    this.updatePageNavigation(); // Update navigation layout on resize
  }

  isMobileView() {
    return window.innerWidth <= 768;
  }

  isSidebarOpen() {
    return (
      this.sidebar.classList.contains("open") ||
      this.sidebar.classList.contains("show")
    );
  }
  async handleCopyCommand(button, command) {
    try {
      await navigator.clipboard.writeText(command);
      const originalSvg = button.innerHTML;

      // Replace with check icon
      button.innerHTML = `
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      `;

      // Restore original icon after 1 second
      setTimeout(() => {
        button.innerHTML = originalSvg;
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async navigateToPage(page) {
    if (!this.config.pages[page]) return;

    const url = new URL(window.location);
    // Ensure the pathname always ends with /
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    url.searchParams.set("page", page);
    history.pushState({ page }, "", url);

    await this.loadPage(page, false);
  }

  async loadPage(page, updateHistory = true) {
    const validatedPage = this.validatePage(page);
    this.currentPage = validatedPage;
    this.updateActiveNavigation(validatedPage);

    const cachedContent = this.pageCache.get(validatedPage);
    if (cachedContent) {
      this.content.innerHTML = cachedContent;
    } else {
      await this.loadPageFromServer(validatedPage);
    }

    if (updateHistory) {
      this.updateBrowserHistory(validatedPage);
    }

    // Use requestAnimationFrame to ensure DOM is updated before scrolling and processing headings
    requestAnimationFrame(() => {
      this.scrollToTop();
      this.processHeadings();
      this.handleInitialHash();
      this.updatePageNavigation();
    });
  }

  validatePage(page) {
    return this.config.pages[page] ? page : this.config.defaultPage;
  }

  async loadPageFromServer(page) {
    this.showLoadingState();

    try {
      const response = await fetch(this.config.pages[page].file);
      const html = await response.text();
      this.content.innerHTML = html;
      this.pageCache.set(page, html);
    } catch (error) {
      this.content.innerHTML = this.createErrorContent(
        this.config.pages[page].title,
        "Failed to load"
      );
    }
  }

  showLoadingState() {
    this.content.innerHTML =
      '<div class="loading-placeholder"><h1>Loading...</h1></div>';
  }

  updateBrowserHistory(page) {
    const url = new URL(window.location);
    // Ensure the pathname always ends with /
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    url.searchParams.set("page", page);
    history.pushState({ page }, "", url);
  }

  scrollToTop() {
    // Try multiple scroll targets to ensure it works
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }

    // Also scroll the main content container if it exists
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      try {
        mainContent.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        mainContent.scrollTop = 0;
      }
    }

    // And the content wrapper
    const contentWrapper = document.querySelector(".content-wrapper");
    if (contentWrapper) {
      try {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        contentWrapper.scrollTop = 0;
      }
    }
  }

  processHeadings() {
    // Find all h2 elements in the content (both markdown-content and content-section)
    const headings = this.content.querySelectorAll("h2");

    headings.forEach((heading) => {
      this.setupHeadingAnchor(heading);
    });
  }

  setupHeadingAnchor(heading) {
    // Generate ID from heading text if it doesn't have one
    if (!heading.id) {
      heading.id = this.generateIdFromText(heading.textContent);
    }

    // Create anchor button
    const anchorBtn = this.createAnchorButton(heading.id);

    // Append anchor button to heading
    heading.appendChild(anchorBtn);
  }

  generateIdFromText(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  createAnchorButton(headingId) {
    const anchorBtn = document.createElement("button");
    anchorBtn.className = "heading-anchor";
    anchorBtn.innerHTML = "🔗";
    anchorBtn.title = "Link to this section";
    anchorBtn.setAttribute("aria-label", "Copy link to this section");

    // Add click event to copy URL and scroll to section
    anchorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleAnchorClick(headingId, anchorBtn);
    });

    return anchorBtn;
  }

  handleAnchorClick(headingId, button) {
    // Update URL with hash
    const url = new URL(window.location);
    // Ensure the pathname always ends with /
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    url.hash = headingId;
    history.pushState(null, "", url);

    // Copy URL to clipboard
    this.copyUrlToClipboard(url.toString(), button);

    // Scroll to heading
    this.scrollToHeading(headingId);
  }

  async copyUrlToClipboard(url, button) {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.warn("Failed to copy URL:", err);
    }
  }

  scrollToHeading(headingId) {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  handleInitialHash() {
    // Handle hash in URL on page load
    if (window.location.hash) {
      const headingId = window.location.hash.substring(1);
      setTimeout(() => {
        this.scrollToHeading(headingId);
      }, 100);
    }
  }

  updateActiveNavigation(activePage) {
    this.navLinks?.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === activePage);
    });
  }

  updateToggleButton() {
    const isOpen = this.isSidebarOpen();
    this.updateButtonState(this.toggleBtnDesktop, isOpen);
    this.updateButtonState(this.toggleBtnMobile, isOpen);
  }

  updateButtonState(button, isActive) {
    if (button) {
      button.classList.toggle("active", isActive);
    }
  }

  toggleSidebar() {
    const className = this.isMobileView() ? "open" : "show";
    this.sidebar.classList.toggle(className);
    this.updateToggleButton();
  }

  closeSidebar() {
    this.sidebar.classList.remove("open");
    this.sidebar.classList.remove("show");
    this.updateToggleButton();
  }

  // Navigation methods
  getPreviousPage() {
    const currentIndex = this.pageOrder.indexOf(this.currentPage);
    return currentIndex > 0 ? this.pageOrder[currentIndex - 1] : null;
  }

  getNextPage() {
    const currentIndex = this.pageOrder.indexOf(this.currentPage);
    return currentIndex < this.pageOrder.length - 1
      ? this.pageOrder[currentIndex + 1]
      : null;
  }

  updatePageNavigation() {
    if (!this.pageNavigation) return;

    const prevPage = this.getPreviousPage();
    const nextPage = this.getNextPage();

    // Show/hide navigation if there are prev/next pages
    const hasNavigation = prevPage || nextPage;
    this.pageNavigation.style.display = hasNavigation ? "block" : "none";

    if (!hasNavigation) return;

    // Get the flex container
    const flexContainer = this.pageNavigation.querySelector(
      'div[style*="display: flex"]'
    );

    // Update previous button
    if (prevPage) {
      this.prevBtn.style.display = "inline-flex";
      this.prevBtn.href = "#";

      // Different text for mobile vs desktop
      if (this.isMobileView()) {
        this.prevTitle.textContent = "Previous";
      } else {
        this.prevTitle.textContent = `Previous: ${this.config.pages[prevPage].title}`;
      }
    } else {
      this.prevBtn.style.display = "none";
    }

    // Update next button
    if (nextPage) {
      this.nextBtn.style.display = "inline-flex";
      this.nextBtn.href = "#";

      // Different text for mobile vs desktop
      if (this.isMobileView()) {
        this.nextTitle.textContent = "Next";
      } else {
        this.nextTitle.textContent = `Next: ${this.config.pages[nextPage].title}`;
      }
    } else {
      this.nextBtn.style.display = "none";
    }

    // Adjust flex container justification - same logic for all screen sizes
    if (flexContainer) {
      if (prevPage && nextPage) {
        // Both buttons: space between
        flexContainer.style.justifyContent = "space-between";
      } else if (nextPage && !prevPage) {
        // Only next button: align to right
        flexContainer.style.justifyContent = "flex-end";
      } else if (prevPage && !nextPage) {
        // Only prev button: align to left
        flexContainer.style.justifyContent = "flex-start";
      }
    }
  }
}

// Initialize application when DOM is ready
function initializeApp() {
  new DocumentationApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
