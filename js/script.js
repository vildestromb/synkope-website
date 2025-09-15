// Utility Functions
function removeElementFocus(element) {
  element.blur(); // Remove focus to prevent sticky border
}

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", function() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    removeElementFocus(this);
  });
});

// Dropdown menu functionality
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
const dropdownMenu = document.querySelector(".nav-dropdown-menu");

if (dropdown && dropdownToggle && dropdownMenu) {
  // Toggle dropdown on click (desktop only)
  dropdownToggle.addEventListener("click", (e) => {
    if (window.innerWidth > 768) {
      e.preventDefault();
      dropdown.classList.toggle("active");
    }
    // On mobile, let the link work normally (don't prevent default)
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  // Close dropdown when clicking on dropdown links
  const dropdownLinks = document.querySelectorAll(".nav-dropdown-link");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function() {
      dropdown.classList.remove("active");
      removeElementFocus(this);
    });
  });

  // Handle hover for desktop
  dropdown.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      dropdown.classList.add("active");
    }
  });

  dropdown.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768) {
      dropdown.classList.remove("active");
    }
  });
}

// Navbar scroll effect
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const headerOffset = 80; // Height of fixed navbar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    removeElementFocus(this);
  });
});

// Active navigation link highlighting
const sections = document.querySelectorAll("section");
const navLinksAll = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.clientHeight;

    if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Fade in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(
    ".service-card, .portfolio-item, .stat, .about-text, .contact-item"
  );

  fadeElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
});

// Contact form handling
const contactForm = document.getElementById("kontaktskjema");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const navn = formData.get("navn");
    const epost = formData.get("epost");
    const emne = formData.get("emne");
    const melding = formData.get("melding");

    // Enhanced validation
    const validationResult = validateForm({ navn, epost, emne, melding });

    if (!validationResult.isValid) {
      showMessage(validationResult.message, "error");
      // Focus on the first invalid field
      if (validationResult.field) {
        const field = document.getElementById(validationResult.field);
        if (field) {
          field.focus();
          field.classList.add("error");
          setTimeout(() => field.classList.remove("error"), 3000);
        }
      }
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sender...";
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      showMessage(
        "Takk for din henvendelse! Vi kommer tilbake til deg så snart som mulig.",
        "success"
      );
      this.reset();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Email validation function
// Enhanced form validation
function validateForm({ navn, epost, emne, melding }) {
  // Check for empty fields
  if (!navn || navn.trim().length < 2) {
    return {
      isValid: false,
      message: "Navn må være minst 2 tegn langt.",
      field: "navn"
    };
  }

  if (!epost || !isValidEmail(epost)) {
    return {
      isValid: false,
      message: "Vennligst skriv inn en gyldig e-postadresse.",
      field: "epost"
    };
  }

  if (!emne || emne.trim().length < 3) {
    return {
      isValid: false,
      message: "Emne må være minst 3 tegn langt.",
      field: "emne"
    };
  }

  if (!melding || melding.trim().length < 10) {
    return {
      isValid: false,
      message: "Melding må være minst 10 tegn lang.",
      field: "melding"
    };
  }

  return { isValid: true };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Show message function
function showMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageEl = document.createElement("div");
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  // Add message after form
  contactForm.appendChild(messageEl);

  // Remove message after 5 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 5000);
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Show scroll to top button when scrolling down
let scrollToTopBtn;

document.addEventListener("DOMContentLoaded", () => {
  // Create scroll to top button
  scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #eb8822 0%, #1d5f81 100%);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(235, 136, 34, 0.3);
    `;

  scrollToTopBtn.addEventListener("click", scrollToTop);
  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(20px)";
    }
  });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + "+";
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + "+";
    }
  }

  updateCounter();
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector("h3");
        const target = parseInt(statNumber.textContent.replace("+", ""));
        animateCounter(statNumber, target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(".stat");
  stats.forEach((stat) => {
    statsObserver.observe(stat);
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-placeholder");

  if (heroImage) {
    const speed = scrolled * 0.5;
    heroImage.style.transform = `translateY(${speed}px)`;
  }
});

// Lazy loading for images (when you add real images)
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener("DOMContentLoaded", lazyLoadImages);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply throttling to scroll events for better performance
const throttledScrollHandler = throttle(() => {
  // Scroll-dependent functions can be called here
}, 16); // ~60fps

window.addEventListener("scroll", throttledScrollHandler);
