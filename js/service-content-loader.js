// Service Page Content Loader - Loads content for individual service pages
// Usage: Include this script on service pages to load content from JSON

class ServiceContentLoader {
  constructor() {
    this.content = null;
    this.language = "no";
    this.serviceName = this.detectServiceName();
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
      emc: "emc",
    };

    return serviceMap[filename] || null;
  }

  // Load content from JSON file
  async loadContent(language = "no") {
    try {
      const response = await fetch(`../content/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }
      this.content = await response.json();
      this.language = language;
      return this.content;
    } catch (error) {
      console.error("Error loading service content:", error);
      return null;
    }
  }

  // Apply content to service page HTML elements
  applyContent() {
    if (!this.content || !this.serviceName) {
      console.error("No content or service name available");
      return;
    }

    const serviceData = this.content.service_pages[this.serviceName];
    if (!serviceData) {
      console.error(`No content found for service: ${this.serviceName}`);
      return;
    }

    // Update page title and meta description
    this.updatePageMeta(serviceData);

    // Update hero section
    this.updateHeroSection(serviceData);

    // Update main content
    this.updateMainContent(serviceData);

    // Update footer
    this.updateFooter();
  }

  updatePageMeta(serviceData) {
    // Update page title
    document.title = `${serviceData.title} - Synkope`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && serviceData.meta_description) {
      metaDescription.setAttribute("content", serviceData.meta_description);
    }
  }

  updateHeroSection(serviceData) {
    // Update hero title
    const heroTitle = document.querySelector(".service-hero h1");
    if (heroTitle && serviceData.title) {
      heroTitle.textContent = serviceData.title;
    }
  }

  updateMainContent(serviceData) {
    const serviceSection = document.querySelector(".service-section");
    if (!serviceSection || !serviceData.content) {
      return;
    }

    // Clear existing content
    serviceSection.innerHTML = "";

    // Add content based on service type
    switch (this.serviceName) {
    case "ikt_infrastruktur":
      this.buildIktInfrastructureContent(serviceSection, serviceData.content);
      break;
    case "prosjektstyring":
      this.buildProjectManagementContent(serviceSection, serviceData.content);
      break;
    case "informasjonssikkerhet":
      this.buildInfoSecContent(serviceSection, serviceData.content);
      break;
    case "emc":
      this.buildEmcContent(serviceSection, serviceData.content);
      break;
    default:
      this.buildGenericContent(serviceSection, serviceData.content);
    }
  }

  buildIktInfrastructureContent(container, content) {
    // Add intro paragraphs
    content.intro.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });

    // Add competencies list
    if (content.competencies && content.competencies.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "service-list";

      content.competencies.forEach((competency) => {
        const li = document.createElement("li");
        li.textContent = competency;
        ul.appendChild(li);
      });

      container.appendChild(ul);
    }
  }

  buildProjectManagementContent(container, content) {
    // Add intro paragraphs
    content.intro.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });

    // Add service areas list
    if (content.service_areas && content.service_areas.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "service-list";

      content.service_areas.forEach((area) => {
        const li = document.createElement("li");
        li.textContent = area;
        ul.appendChild(li);
      });

      container.appendChild(ul);
    }
  }

  buildInfoSecContent(container, content) {
    // Add intro
    content.intro.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });

    // Add key competencies list
    if (content.key_competencies && content.key_competencies.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "service-list";

      content.key_competencies.forEach((competency) => {
        const li = document.createElement("li");
        li.textContent = competency;
        ul.appendChild(li);
      });

      container.appendChild(ul);
    }

    // Add standards paragraph
    if (content.standards) {
      const p = document.createElement("p");
      p.textContent = content.standards;
      container.appendChild(p);
    }

    // Add sections (like compliance section)
    if (content.sections) {
      Object.entries(content.sections).forEach(([, section]) => {
        // Add section heading
        const h2 = document.createElement("h2");
        h2.textContent = section.title;
        container.appendChild(h2);

        // Add section intro paragraphs
        if (section.intro) {
          section.intro.forEach((paragraph) => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            container.appendChild(p);
          });
        }

        // Add section services list
        if (section.services && section.services.length > 0) {
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

  buildEmcContent(container, content) {
    // Add intro paragraphs
    content.intro.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });

    // Add competencies list
    if (content.competencies && content.competencies.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "service-list";

      content.competencies.forEach((competency) => {
        const li = document.createElement("li");
        li.textContent = competency;
        ul.appendChild(li);
      });

      container.appendChild(ul);
    }
  }

  buildGenericContent(container, content) {
    // Fallback for unknown content structure
    if (content.intro) {
      content.intro.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        container.appendChild(p);
      });
    }

    // Try to find any list-type content
    const listFields = ["competencies", "service_areas", "key_competencies"];
    listFields.forEach((field) => {
      if (content[field] && Array.isArray(content[field])) {
        const ul = document.createElement("ul");
        ul.className = "service-list";

        content[field].forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });

        container.appendChild(ul);
      }
    });
  }

  updateFooter() {
    if (!this.content.footer || !this.content.footer.contact_info) {
      return;
    }

    const contactInfo = this.content.footer.contact_info;

    // Update footer contact section
    const footerSection = document.querySelector(".footer-section");
    if (footerSection) {
      const contactElements = {
        company: footerSection.children[1],
        address: footerSection.children[2],
        postal: footerSection.children[3],
        org_number: footerSection.children[4],
        email: footerSection.children[5]?.querySelector("a"),
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

    // Update footer copyright
    const footerBottom = document.querySelector(".footer-bottom p");
    if (footerBottom && this.content.footer.copyright) {
      footerBottom.textContent = this.content.footer.copyright;
    }
  }

  // Initialize content loader for service pages
  async init(language = "no") {
    if (!this.serviceName) {
      console.warn("Could not detect service name from URL");
      return;
    }

    await this.loadContent(language);
    this.applyContent();
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Only initialize on service pages (check if we have service page elements)
  const serviceHero = document.querySelector(".service-hero");
  const serviceContent = document.querySelector(".service-content");

  if (serviceHero && serviceContent) {
    window.serviceContentLoader = new ServiceContentLoader();
    await window.serviceContentLoader.init();

    console.log("Service content loaded from JSON files");
  }
});

// Export for use in other scripts
window.ServiceContentLoader = ServiceContentLoader;
