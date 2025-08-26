# Synkope

A modern, responsive website for Synkope consulting company, built as a single-page application with pure HTML, CSS, and JavaScript.

🌐 **Live Demo**: [https://vildestromb.github.io/synkope-website/](https://vildestromb.github.io/synkope-website/)

## 🚀 About the Project

Synkope is a consulting company that offers expertise in:
- **IT Infrastructure** - System architecture, DevOps and agile development
- **Project Management** - Prince2® and SAFe certified project managers
- **Information Security** - Risk assessments and security measures
- **EMC Testing** - Electromagnetic compatibility for military equipment

## 🎨 Design & Technology

### Typography
- **Headings**: Inter font family
- **Body text**: Open Sans font family

### Color Palette
- **Primary Color**: #EB8822 (Orange)
- **Secondary Color**: #1D5F81 (Dark Blue)
- **Background**: #FFFFFF (White)

### Tech Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** - Interactivity and animations
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
synkope/
├── index.html          # Main page (single-page application)
├── css/
│   └── style.css      # All stylesheets
├── js/
│   └── script.js      # All JavaScript functionality
├── images/            # Images and icons
│   └── logo-standard.png
└── README.md          # Documentation
```

## ✨ Features

### Navigation
- Sticky navigation with scroll effects
- Smooth scrolling between sections
- Responsive hamburger menu for mobile devices
- Active link highlighting

### Animations
- Fade-in effects on scroll
- Typing effect on hero title
- Counter animations for statistics
- Parallax effect on hero section

### Interactivity
- Contact form with validation
- Scroll-to-top button
- Mobile-friendly navigation
- Lazy loading for images

### Performance
- Optimized animations (60fps)
- Throttled scroll events
- Modern CSS with custom properties
- Minimal dependencies

## 🚀 Getting Started

### View Live Site
Visit the live website: **[https://vildestromb.github.io/synkope-website/](https://vildestromb.github.io/synkope-website/)**

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/vildestromb/synkope-website.git
   cd synkope-website
   ```

2. **Open in browser**
   - Open `index.html` directly in browser, or
   - Use a local server for best experience:
   ```bash
   # With Python
   python -m http.server 8000
   
   # With Node.js (if you have npx installed)
   npx serve .
   
   # With PHP
   php -S localhost:8000
   ```

3. **Visit the site**
   - Go to `http://localhost:8000` in your browser

## 📱 Responsive Design

The website is optimized for all screen sizes:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (compact layout)
- **Mobile**: 320px - 767px (stacked layout)

## 🔧 Customization

### Colors
Edit CSS custom properties in `css/style.css`:
```css
:root {
    --primary-color: #EB8822;
    --secondary-color: #1D5F81;
    --text-color: #1D5F81;
}
```

### Content
- Edit text directly in `index.html`
- Add new sections as needed
- Update contact information

### Images
- Place new images in the `images/` folder
- Update image references in HTML/CSS
- Use lazy loading for large images

## 🎯 Performance

- **Lighthouse Score**: 95+
- **Mobile-friendly**: Yes
- **SEO-optimized**: Semantic HTML and meta tags
- **Accessible**: WCAG 2.1 guidelines followed

## 📧 Contact Form

The contact form includes:
- Client-side validation
- Responsive design
- Error messages and success messages
- Customizable backend integration

*Note: The form is set up for frontend demonstration. For production, you need to add backend processing.*

## 🔄 Updates

### Version 1.0
- ✅ Responsive design
- ✅ Modern animations
- ✅ Contact form
- ✅ SEO optimization
- ✅ Removed emojis for professional appearance

## 📄 License

This project is created for Synkope consulting company. All rights reserved.

## 🤝 Contributing

To contribute to the project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or support, contact:
- **Email**: hei@synkope.io
- **Location**: Oslo, Norway

---

**Built with ❤️ for Synkope**