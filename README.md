# Agent Flow Website

A professional, single-page marketing website built for Agent Flow to attract and convert "Established Expert" business leaders.

## Overview

This website serves as a strategic lead-generation tool with a clean, modern design focused on professional presentation and conversion optimization.

## Features

### ✅ Completed
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Professional Styling**: Clean, modern aesthetic with defined color palette
- **Interactive Navigation**: Fixed header with smooth scroll and mobile menu
- **Scroll Animations**: Subtle fade-in effects using Intersection Observer
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Performance Optimized**: Efficient CSS and JavaScript with progressive enhancement

### 🔄 Integration Ready
- **Calendly Integration**: Placeholder ready for your event URL
- **Formspree Forms**: Contact form structure ready for endpoint
- **Google Analytics 4**: Tracking code ready for your Measurement ID

## Technical Stack

- **HTML5**: Semantic markup with accessibility focus
- **CSS3**: Custom variables, mobile-first responsive design, BEM methodology
- **JavaScript ES6+**: Modern features with progressive enhancement
- **No Frameworks**: Pure HTML/CSS/JS as specified

## Project Structure

```
/
├── index.html          # Main page with all sections
├── css/
│   └── style.css       # All styles with CSS variables
├── js/
│   └── main.js         # Interactive functionality
└── assets/
    └── images/
        └── AgentFlowLogo.svg  # Your logo
```

## Current Content Status

### ✅ Ready
- **Hero Section**: Live with your headline and subheadline
- **Navigation**: Fully functional with smooth scrolling
- **Logo**: AgentFlow logo integrated

### 📝 Awaiting Copy
- **Problem Section ("The Mirror")**: [Placeholder content visible]
- **Solution Section ("The Pathway")**: [Placeholder content visible]  
- **Why Us Section**: [Awaiting founder bios and differentiators]
- **Use Cases Section**: [Placeholder content visible]
- **Final CTA Section**: [Placeholder content visible]

## Integration Setup

### Calendly Integration
1. Get your Calendly event URL
2. Replace `CALENDLY_URL_PLACEHOLDER` in `index.html` (lines with Calendly.initPopupWidget)
3. Test the "Book a Discovery Call" buttons

### Formspree Setup
1. Create a Formspree account at https://formspree.io
2. Create a new form and get the endpoint URL
3. Replace `FORMSPREE_ENDPOINT` in `index.html` (contact form action attribute)

### Google Analytics 4
1. Create a GA4 property and get your Measurement ID
2. Replace `GA_MEASUREMENT_ID` in `index.html` (appears twice in the GA script)

## Content Management

To add your real copy:

1. **Find placeholder sections** - Look for `[Awaiting Copy - ...]` text
2. **Replace with your content** - Maintain the HTML structure, just replace the placeholder text
3. **Update placeholders** - Replace bracket placeholders like `[Problem Point 1]` with your actual content

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Optimized Assets**: Compressed CSS, efficient JavaScript
- **Progressive Enhancement**: Site works without JavaScript
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Lazy Loading**: Ready for future image optimization

## Accessibility Features

- **WCAG 2.1 AA Compliant**: Semantic HTML, proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Descriptive alt texts and labels
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user preferences

## Development Notes

- **BEM CSS Methodology**: Consistent naming convention
- **Mobile-First**: Responsive design starting from 320px
- **Progressive Enhancement**: JavaScript enhances but doesn't break the experience
- **Error Handling**: Graceful fallbacks for all interactive features

## Next Steps

1. **Add Your Content**: Replace placeholder sections with your copy
2. **Set Up Integrations**: Configure Calendly, Formspree, and GA4
3. **Test Everything**: Verify all functionality works with real data
4. **Deploy**: Upload to your hosting platform

## Support

For technical questions or modifications, refer to the comprehensive comments in the code files. All JavaScript functionality is documented and the CSS uses clear, semantic naming conventions.