// Functionality for copying commands to clipboard
document.addEventListener("DOMContentLoaded", function () {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const command = this.getAttribute("data-command");

      try {
        await navigator.clipboard.writeText(command);

        // Visual feedback
        this.classList.add("copied");

        // Remove feedback after 2 seconds
        setTimeout(() => {
          this.classList.remove("copied");
        }, 2000);
      } catch (err) {
        // Fallback for browsers that don't support navigator.clipboard
        fallbackCopyTextToClipboard(command, this);
      }
    });
  });
});

// Fallback function for copying
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid page scrolling
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      button.classList.add("copied");

      setTimeout(() => {
        button.classList.remove("copied");
      }, 2000);
    } else {
      console.error("Unable to copy text");
    }
  } catch (err) {
    console.error("Error during copy:", err);
  }

  document.body.removeChild(textArea);
}

// Fade-in animation for elements on scroll
function fadeInOnScroll() {
  const elements = document.querySelectorAll(".script-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
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

// Initialize animations when DOM is ready
document.addEventListener("DOMContentLoaded", fadeInOnScroll);
