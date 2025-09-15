// Content Loader - Separates text content from HTML structure
// Usage: Include this script after the DOM is loaded

class ContentLoader {
  constructor() {
    this.content = null;
    this.language = "no"; // Default to Norwegian
  }

  // Load content from JSON file
  async loadContent(language = "no") {
    try {
      const response = await fetch(`content/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }
      this.content = await response.json();
      this.language = language;
      return this.content;
    } catch (error) {
      console.error("Error loading content:", error);
      return null;
    }
  }

  // Apply content to HTML elements
  applyContent() {
    if (!this.content) {
      console.error("No content loaded");
      return;
    }

    // Site metadata
    if (this.content.site) {
      document.title = this.content.site.title;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", this.content.site.description);
      }
    }

    // Navigation
    this.applyNavigation();

    // Hero section
    this.applyHero();

    // About section
    this.applyAbout();

    // Team section
    this.applyTeam();

    // Services section
    this.applyServices();

    // Contact section
    this.applyContact();

    // Footer
    this.applyFooter();
  }

  applyNavigation() {
    const nav = this.content.navigation;
    if (!nav) {
      return;
    }

    // Update navigation links
    const navLinks = {
      hjem: nav.home,
      om: nav.about,
      team: nav.team,
      tjenester: nav.services,
      kontakt: nav.contact
    };

    Object.entries(navLinks).forEach(([href, text]) => {
      const links = document.querySelectorAll(`a[href="#${href}"]`);
      links.forEach((link) => {
        if (link.textContent.trim() && !link.querySelector("img")) {
          link.textContent = text;
        }
      });
    });
  }

  applyHero() {
    const hero = this.content.hero;
    if (!hero) {
      return;
    }

    // Hero title and subtitle
    const title = document.querySelector(".hero-title, #hero-title");
    if (title && hero.title) {
      // Safely handle HTML content by splitting on <br /> tags
      const titleParts = hero.title.split("<br />");
      title.textContent = "";
      titleParts.forEach((part, index) => {
        if (index > 0) {
          title.appendChild(document.createElement("br"));
        }
        title.appendChild(document.createTextNode(part));
      });
    }

    const subtitle = document.querySelector(".hero-subtitle");
    if (subtitle && hero.subtitle) {
      subtitle.textContent = hero.subtitle;
    }

    // CTA button
    const ctaButton = document.querySelector(".hero-content .btn");
    if (ctaButton && hero.cta) {
      ctaButton.textContent = hero.cta;
    }
  }

  applyAbout() {
    const about = this.content.about;
    if (!about) {
      return;
    }

    // Section heading
    const heading = document.querySelector("#about-heading");
    if (heading && about.title) {
      heading.textContent = about.title;
    }

    // Description
    const description = document.querySelector("#om .section-header p");
    if (description && about.description) {
      description.textContent = about.description;
    }

    // Focus areas
    if (about.focus_areas) {
      const focusTitle = document.querySelector(".about-features h2");
      if (focusTitle) {
        focusTitle.textContent = about.focus_areas.title;
      }

      const focusItems = document.querySelectorAll(
        ".about-features .feature-item"
      );
      if (focusItems.length >= about.focus_areas.areas.length) {
        about.focus_areas.areas.forEach((area, index) => {
          const item = focusItems[index];
          if (item) {
            const title = item.querySelector("h3");
            const desc = item.querySelector("p");
            if (title) {
              title.textContent = area.title;
            }
            if (desc) {
              desc.textContent = area.description;
            }
          }
        });
      }
    }
  }

  applyTeam() {
    const team = this.content.team;
    if (!team) {
      return;
    }

    // Section heading
    const heading = document.querySelector("#team-heading");
    if (heading && team.title) {
      heading.textContent = team.title;
    }

    const subtitle = document.querySelector("#team .section-header p");
    if (subtitle && team.subtitle) {
      subtitle.textContent = team.subtitle;
    }

    // Team members
    const teamMembers = document.querySelectorAll(".team-member");
    if (teamMembers.length >= team.members.length) {
      team.members.forEach((member, index) => {
        const memberElement = teamMembers[index];
        if (memberElement) {
          const name = memberElement.querySelector("h3");
          const title = memberElement.querySelector(
            ".team-info p:first-of-type"
          );
          const desc = memberElement.querySelector(
            ".team-info p:nth-of-type(2)"
          );
          const expertise = memberElement.querySelector(
            ".team-info p:nth-of-type(3)"
          );

          if (name) {
            name.textContent = member.name;
          }
          if (title) {
            title.textContent = "";
            const strong = document.createElement("strong");
            strong.textContent = member.title;
            title.appendChild(strong);
          }
          if (desc) {
            desc.textContent = member.description;
          }
          if (expertise) {
            expertise.textContent = member.expertise;
          }

          // Update LinkedIn link
          const linkedinLink = memberElement.querySelector(
            'a[href*="linkedin"]'
          );
          if (linkedinLink && member.linkedin) {
            linkedinLink.href = member.linkedin;
          }
        }
      });
    }
  }

  applyServices() {
    const services = this.content.services;
    if (!services) {
      return;
    }

    // Section heading
    const heading = document.querySelector("#services-heading");
    if (heading && services.title) {
      heading.textContent = services.title;
    }

    const subtitle = document.querySelector("#tjenester .section-header p");
    if (subtitle && services.subtitle) {
      subtitle.textContent = services.subtitle;
    }

    // Service items
    const serviceElements = document.querySelectorAll(".service-card");
    if (serviceElements.length >= services.list.length) {
      services.list.forEach((service, index) => {
        const serviceElement = serviceElements[index];
        if (serviceElement) {
          const title = serviceElement.querySelector("h3");
          const desc = serviceElement.querySelector("p:first-of-type");
          const details = serviceElement.querySelector("p:nth-of-type(2)");
          const link = serviceElement.querySelector("a");

          if (title) {
            title.textContent = service.title;
          }
          if (desc) {
            desc.textContent = service.description;
          }
          if (details) {
            details.textContent = service.details;
          }
          if (link && service.link) {
            link.href = service.link;
          }
        }
      });
    }
  }

  applyContact() {
    const contact = this.content.contact;
    if (!contact) {
      return;
    }

    // Section heading
    const heading = document.querySelector("#contact-heading");
    if (heading && contact.title) {
      heading.textContent = contact.title;
    }

    // Form labels and placeholders
    if (contact.form) {
      const form = contact.form;

      // Name field
      const nameLabel = document.querySelector('label[for="navn"]');
      const nameInput = document.querySelector("#navn");
      if (nameLabel) {
        nameLabel.textContent = form.name_label + " *";
      }
      if (nameInput) {
        nameInput.placeholder = form.name_placeholder;
      }

      // Email field
      const emailLabel = document.querySelector('label[for="epost"]');
      const emailInput = document.querySelector("#epost");
      if (emailLabel) {
        emailLabel.textContent = form.email_label + " *";
      }
      if (emailInput) {
        emailInput.placeholder = form.email_placeholder;
      }

      // Subject field
      const subjectLabel = document.querySelector('label[for="emne"]');
      const subjectInput = document.querySelector("#emne");
      if (subjectLabel) {
        subjectLabel.textContent = form.subject_label + " *";
      }
      if (subjectInput) {
        subjectInput.placeholder = form.subject_placeholder;
      }

      // Message field
      const messageLabel = document.querySelector('label[for="melding"]');
      const messageTextarea = document.querySelector("#melding");
      if (messageLabel) {
        messageLabel.textContent = form.message_label + " *";
      }
      if (messageTextarea) {
        messageTextarea.placeholder = form.message_placeholder;
      }

      // Submit button
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = form.submit_button;
      }
    }
  }

  applyFooter() {
    const footer = this.content.footer;
    if (!footer) {
      return;
    }

    const copyright = document.querySelector(".footer p:last-child");
    if (copyright && footer.copyright) {
      copyright.textContent = footer.copyright;
    }
  }

  // Get validation messages for forms
  getValidationMessage(field) {
    return this.content?.contact?.validation?.[field] || "Ugyldig verdi";
  }

  // Get form messages
  getFormMessage(key) {
    return this.content?.contact?.form?.[key] || "";
  }

  // Initialize content loader
  async init(language = "no") {
    await this.loadContent(language);
    this.applyContent();
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Check if content should be loaded from JSON
  const useContentLoader = document.querySelector(
    'meta[name="use-content-loader"]'
  );

  if (useContentLoader && useContentLoader.getAttribute("content") === "true") {
    window.contentLoader = new ContentLoader();
    await window.contentLoader.init();

    console.log("Content loaded from JSON files");
  }
});

// Export for use in other scripts
window.ContentLoader = ContentLoader;
