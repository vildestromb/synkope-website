// Unified Content Loader - Handles content for both main site and service pages
// Consolidates previous content-loader.js and service-content-loader.js functionality

class ContentLoader {
  constructor() {
    this.content = null;
    this.language = "no"; // Default to Norwegian
    this.pageType = this.detectPageType();
    this.serviceName =
      this.pageType === "service" ? this.detectServiceName() : null;

    // Fallback content for local development when JSON loading fails
    this.fallbackContent = {
      navigation: {
        home: "Hjem",
        about: "Om Oss",
        team: "Team",
        services: "Tjenester",
        contact: "Kontakt"
      }
    };
  }

  // Detect whether we're on the main site or a service page
  detectPageType() {
    const path = window.location.pathname;
    const isServicePage =
      path.includes("/tjenester/") ||
      path.match(
        /\/(ikt-infrastruktur|prosjektstyring|informasjonssikkerhet|emc)\.html$/
      );

    // Also check for service page elements
    const hasServiceElements = document.querySelector(
      ".service-hero, .service-content"
    );

    return isServicePage || hasServiceElements ? "service" : "main";
  }

  // Detect which service page we're on based on URL
  detectServiceName() {
    const path = window.location.pathname;
    const filename = path.split("/").pop().replace(".html", "");

    // Map filenames to JSON keys
    const serviceMap = {
      "ikt-infrastruktur": "ikt_infrastruktur",
      prosjektstyring: "prosjektstyring",
      informasjonssikkerhet: "informasjonssikkerhet",
      emc: "emc"
    };

    return serviceMap[filename] || null;
  }

  // Load content from JSON file
  async loadContent(language = "no") {
    try {
      const basePath = this.pageType === "service" ? "../content/" : "content/";
      const isLocal = window.location.protocol === "file:";

      if (isLocal) {
        console.warn(
          "Local development detected - JSON loading may fail due to CORS restrictions"
        );
        console.log(
          "To fix: serve the site with 'make serve' or 'python -m http.server'"
        );
      }

      const response = await fetch(`${basePath}${language}.json`);

      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }

      this.content = await response.json();
      this.language = language;
      return this.content;
    } catch (error) {
      const isLocal = window.location.protocol === "file:";
      console.error("Error loading content:", error);

      if (isLocal) {
        console.warn(
          "⚠️  Local development issue: Cannot load JSON files via file:// protocol"
        );
        console.log(
          "🔧 Solution: Run 'make serve' or 'python -m http.server 8000' and visit http://localhost:8000"
        );
        console.log("📝 Navigation will use fallback content for now");
      } else {
        console.error(
          "Content loading failed on live server - check network and file paths"
        );
      }

      return null;
    }
  }

  // Apply content to HTML elements based on page type
  applyContent() {
    if (!this.content) {
      console.error("No content loaded");
      return;
    }

    if (this.pageType === "service") {
      this.applyServicePageContent();
    } else {
      this.applyMainPageContent();
    }
  }

  // Apply content for main homepage
  applyMainPageContent() {
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

    // Apply all main page sections
    this.applyNavigation();
    this.applyHero();
    this.applyAbout();
    this.applyTeam();
    this.applyServices();
    this.applyContact();
    this.applyFooter();
  }

  // Apply content for service pages
  applyServicePageContent() {
    if (!this.serviceName) {
      console.error("No service name detected for service page");
      return;
    }

    const serviceData = this.content.service_pages[this.serviceName];
    if (!serviceData) {
      console.error(`No content found for service: ${this.serviceName}`);
      return;
    }

    // Update page metadata
    this.updateServicePageMeta(serviceData);

    // Update service page sections
    this.updateServiceHero(serviceData);
    this.updateServiceMainContent(serviceData);
    this.applyFooter(); // Service pages also have footer
  }

  // === MAIN PAGE CONTENT METHODS ===

  applyNavigation() {
    // Use content navigation if available, otherwise use fallback
    const nav = this.content?.navigation || this.fallbackContent.navigation;
    if (!nav) {
      return;
    }

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

    // Hero title - handle HTML content safely
    const title = document.querySelector(".hero-title, #hero-title");
    if (title && hero.title) {
      const titleParts = hero.title.split("<br />");
      title.textContent = "";
      titleParts.forEach((part, index) => {
        if (index > 0) {
          title.appendChild(document.createElement("br"));
        }
        title.appendChild(document.createTextNode(part));
      });
    }

    // Hero subtitle
    const subtitle = document.querySelector(".hero-subtitle");
    if (subtitle && hero.subtitle) {
      subtitle.textContent = hero.subtitle;
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

  // === SERVICE PAGE CONTENT METHODS ===

  updateServicePageMeta(serviceData) {
    document.title = `${serviceData.title} - Synkope`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && serviceData.meta_description) {
      metaDescription.setAttribute("content", serviceData.meta_description);
    }
  }

  updateServiceHero(serviceData) {
    const heroTitle = document.querySelector(".service-hero h1");
    if (heroTitle && serviceData.title) {
      heroTitle.textContent = serviceData.title;
    }
  }

  updateServiceMainContent(serviceData) {
    const serviceSection = document.querySelector(".service-section");
    if (!serviceSection || !serviceData.content) {
      return;
    }

    // Clear existing content
    serviceSection.innerHTML = "";

    // Build content using unified method
    this.buildServiceContent(serviceSection, serviceData.content);
  }

  // Generic service content builder - replaces 4 duplicate functions
  buildServiceContent(container, content) {
    // Add intro paragraphs
    if (content.intro && Array.isArray(content.intro)) {
      content.intro.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        container.appendChild(p);
      });
    }

    // Add lists - check for various list field names
    const listFields = ["competencies", "service_areas", "key_competencies"];
    listFields.forEach((fieldName) => {
      if (
        content[fieldName] &&
        Array.isArray(content[fieldName]) &&
        content[fieldName].length > 0
      ) {
        const ul = document.createElement("ul");
        ul.className = "service-list";

        content[fieldName].forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });

        container.appendChild(ul);
      }
    });

    // Add standards paragraph (for info sec)
    if (content.standards) {
      const p = document.createElement("p");
      p.textContent = content.standards;
      container.appendChild(p);
    }

    // Add sections (for complex content like info sec)
    if (content.sections) {
      Object.entries(content.sections).forEach(([, section]) => {
        // Add section heading
        const h2 = document.createElement("h2");
        h2.textContent = section.title;
        container.appendChild(h2);

        // Add section intro paragraphs
        if (section.intro && Array.isArray(section.intro)) {
          section.intro.forEach((paragraph) => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            container.appendChild(p);
          });
        }

        // Add section services list
        if (
          section.services &&
          Array.isArray(section.services) &&
          section.services.length > 0
        ) {
          const ul = document.createElement("ul");
          ul.className = "service-list";

          section.services.forEach((service) => {
            const li = document.createElement("li");
            li.textContent = service;
            ul.appendChild(li);
          });

          container.appendChild(ul);
        }
      });
    }
  }

  // === SHARED METHODS ===

  applyFooter() {
    const footer = this.content.footer;
    if (!footer) {
      return;
    }

    // Handle main page footer
    const copyright = document.querySelector(".footer p:last-child");
    if (copyright && footer.copyright) {
      copyright.textContent = footer.copyright;
    }

    // Handle service page footer
    if (footer.contact_info) {
      const contactInfo = footer.contact_info;
      const footerSection = document.querySelector(".footer-section");

      if (footerSection) {
        const contactElements = {
          company: footerSection.children[1],
          address: footerSection.children[2],
          postal: footerSection.children[3],
          org_number: footerSection.children[4],
          email: footerSection.children[5]?.querySelector("a")
        };

        if (contactElements.company) {
          contactElements.company.textContent = contactInfo.company;
        }
        if (contactElements.address) {
          contactElements.address.textContent = contactInfo.address;
        }
        if (contactElements.postal) {
          contactElements.postal.textContent = contactInfo.postal;
        }
        if (contactElements.org_number) {
          contactElements.org_number.textContent = contactInfo.org_number;
        }
        if (contactElements.email) {
          contactElements.email.textContent = contactInfo.email;
          contactElements.email.href = `mailto:${contactInfo.email}`;
        }
      }

      // Update footer copyright for service pages
      const footerBottom = document.querySelector(".footer-bottom p");
      if (footerBottom && footer.copyright) {
        footerBottom.textContent = footer.copyright;
      }
    }
  }

  // === UTILITY METHODS ===

  // Get validation messages for forms
  getValidationMessage(field) {
    return this.content?.contact?.validation?.[field] || "Ugyldig verdi";
  }

  // Get form messages
  getFormMessage(key) {
    return this.content?.contact?.form?.[key] || "";
  }

  // Public method to initialize content loader
  async init(language = "no") {
    const success = await this.loadContent(language);
    if (success) {
      this.applyContent();
      return true;
    }
    return false;
  }

  // Get current page type (for debugging/external use)
  getPageType() {
    return this.pageType;
  }

  // Get current service name (for debugging/external use)
  getServiceName() {
    return this.serviceName;
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Check if content should be loaded from JSON (backward compatibility)
  const useContentLoader = document.querySelector(
    'meta[name="use-content-loader"]'
  );
  const shouldLoad =
    !useContentLoader || useContentLoader.getAttribute("content") !== "false";

  if (shouldLoad) {
    window.contentLoader = new ContentLoader();
    const success = await window.contentLoader.init();

    if (success) {
      console.log(
        `Content loaded for ${window.contentLoader.getPageType()} page`
      );
      if (window.contentLoader.getServiceName()) {
        console.log(`Service: ${window.contentLoader.getServiceName()}`);
      }
    } else {
      const isLocal = window.location.protocol === "file:";
      if (isLocal) {
        console.warn(
          "🔧 Content loading failed locally - applying navigation fallback"
        );
        console.log(
          "💡 For full functionality, serve the site with: make serve"
        );
      } else {
        console.error("❌ Content loading failed on live server");
      }

      // Still apply navigation with fallback content so menu works
      window.contentLoader.applyNavigation();
    }
  } else {
    console.log("Content loading is disabled");
  }
});

// Export for use in other scripts
window.ContentLoader = ContentLoader;
