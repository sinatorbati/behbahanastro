# Mobile-First Conversion QA Checklist

## Files Delivered
- `index-mobile.html` - Mobile-first HTML with critical CSS inline
- `styles-mobile.css` - Progressive enhancement CSS with breakpoints
- `scripts-mobile.js` - Optimized JavaScript for mobile

## Testing Checklist

### 1. Viewport Testing (Device Widths)
- [ ] **320px** - Small phones (iPhone SE, small Android)
- [ ] **360px** - Standard phones (Galaxy S, Pixel)
- [ ] **375px** - iPhone 12/13/14 standard
- [ ] **414px** - iPhone 12/13/14 Pro Max, large phones
- [ ] **480px** - Large phones landscape
- [ ] **768px** - Tablets (iPad portrait)
- [ ] **1024px** - Tablets landscape, small desktops
- [ ] **1280px+** - Desktop

### 2. Navigation Testing
- [ ] Hamburger menu opens/closes on mobile (< 768px)
- [ ] Menu closes when clicking outside
- [ ] Menu closes on Escape key
- [ ] Menu closes when clicking a link (mobile)
- [ ] Focus trap works when menu is open
- [ ] Desktop shows horizontal menu (≥ 768px)
- [ ] All navigation links are ≥44x44px touch targets
- [ ] ARIA attributes present (aria-expanded, aria-label)

### 3. Touch Targets
- [ ] All buttons/links ≥ 44x44 CSS pixels
- [ ] Adequate spacing between interactive elements
- [ ] No overlapping clickable areas

### 4. Typography
- [ ] Base font size is 16px (1rem)
- [ ] Line height between 1.4-1.6
- [ ] Text is readable without zooming
- [ ] Persian/RTL text displays correctly

### 5. Images
- [ ] All images use responsive techniques (max-width: 100%)
- [ ] Images have `loading="lazy"` attribute
- [ ] AVIF format supported where available
- [ ] Images scale properly at all breakpoints

### 6. Layout & Spacing
- [ ] Single column layout on mobile (< 768px)
- [ ] Two-column layout on tablets (768px+)
- [ ] Three-column layout on desktop (1024px+)
- [ ] Safe area insets respected (notches/status bars)
- [ ] Content doesn't overflow viewport horizontally

### 7. Performance
- [ ] Critical CSS inlined in `<head>`
- [ ] Non-critical CSS loaded asynchronously
- [ ] JavaScript deferred
- [ ] Total CSS + JS < 150 KB (unminified)
- [ ] Lighthouse Mobile Score ≥ 90 (target)
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s

### 8. Accessibility
- [ ] Semantic HTML used (nav, main, article, footer)
- [ ] Skip link functional
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Reduced motion preferences respected
- [ ] Screen reader friendly (test with VoiceOver/TalkBack)

### 9. Responsive Breakpoints
- [ ] **Base (320px+)**: Single column, mobile menu, full-width
- [ ] **480px+**: Improved spacing, stats in row
- [ ] **768px+**: Two-column layouts, desktop menu
- [ ] **1024px+**: Three-column articles, optimal spacing

### 10. Forms & Interactions
- [ ] All interactive elements have proper input types
- [ ] Buttons are large enough for touch
- [ ] No hover-only functionality on mobile
- [ ] Touch events work correctly

### 11. Browser Testing
- [ ] Chrome/Edge (mobile & desktop)
- [ ] Safari iOS
- [ ] Firefox
- [ ] Samsung Internet

### 12. Features
- [ ] Articles load from API
- [ ] Stats counter animation works
- [ ] Smooth scroll works for anchor links
- [ ] Scroll animations trigger correctly
- [ ] No console errors

### 13. Edge Cases
- [ ] Very small viewport (320px) - no horizontal scroll
- [ ] Very large viewport (1920px+) - content centered
- [ ] Portrait/landscape orientation changes
- [ ] Network errors handled gracefully
- [ ] API failures don't break page

## Performance Targets
- **Mobile Lighthouse Score**: ≥ 90
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1

## Notes for Deployment
1. Replace existing `index.html`, `style.css`, `main.js` with mobile versions
2. Update image paths if structure differs
3. Test API endpoints are accessible
4. Consider minifying CSS/JS for production
5. Add service worker for offline support (optional)

## Known Limitations
- Some decorative animations may be removed on mobile for performance
- Background patterns may be simplified on small screens
- Image gallery features require additional JavaScript if needed

