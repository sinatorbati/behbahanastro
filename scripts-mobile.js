// Mobile-First JavaScript - Minimal, Performance Optimized

(function() {
  'use strict';

  // Mobile Navigation Menu
  function initMobileMenu() {
    const menuButton = document.querySelector('.mainNav__icon');
    const menuLinks = document.querySelector('.mainNav__links');
    
    if (!menuButton || !menuLinks) return;

    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      menuLinks.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', isOpen);
      
      // Focus trap when menu is open (mobile)
      if (window.innerWidth < 768) {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
          // Focus first link
          const firstLink = menuLinks.querySelector('.mainNav__link');
          if (firstLink) firstLink.focus();
        } else {
          document.body.style.overflow = '';
        }
      }
    }

    menuButton.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !menuLinks.contains(e.target) && !menuButton.contains(e.target)) {
        if (window.innerWidth < 768) {
          toggleMenu();
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
        menuButton.focus();
      }
    });

    // Close menu when clicking a link (mobile only)
    menuLinks.querySelectorAll('.mainNav__link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768 && isOpen) {
          toggleMenu();
        }
      });
    });

    // Update on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768 && isOpen) {
          toggleMenu();
        }
      }, 250);
    });
  }

  // Smooth Scroll for Anchor Links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80; // Account for fixed nav
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Lazy Load Articles
  function loadArticles() {
    const container = document.getElementById('latest-articles');
    if (!container) return;

    const base = (location.protocol === 'file:') ? 'http://localhost:3000' : '';
    const apiUrl = base + '/api/articles?featured=1&limit=4';
    const linkBase = base;

    fetch(apiUrl)
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(items => {
        if (!items || items.length === 0) {
          container.innerHTML = '<p>مقاله‌ای در حال حاضر موجود نیست.</p>';
          return;
        }

        container.innerHTML = items.map(a => {
          const img = a.image ? `
            <div class="article-image">
              <picture>
                <source srcset="/${a.image}" type="image/avif">
                <img src="/${a.image}" alt="${a.title}" loading="lazy">
              </picture>
            </div>` : '';
          const section = a.type === 'NEWS' ? 'news' : 'articles';
          return `
            <article class="article-card" role="listitem">
              ${img}
              <div class="article-content">
                <h3>${escapeHtml(a.title)}</h3>
                <p>${escapeHtml(a.summary || '')}</p>
                <a href="${linkBase}/${section}/${a.id}" class="read-more">ادامه مطلب</a>
              </div>
            </article>`;
        }).join('');
      })
      .catch(err => {
        console.error('Error loading articles:', err);
        container.innerHTML = '<p>خطا در بارگذاری مقالات. لطفاً بعداً تلاش کنید.</p>';
      });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Stats Counter Animation (with reduced motion support)
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function persianToEnglish(str) {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      let result = str;
      persianDigits.forEach((persian, index) => {
        result = result.replace(new RegExp(persian, 'g'), englishDigits[index]);
      });
      const numberMatch = result.match(/\d+/);
      return numberMatch ? parseInt(numberMatch[0], 10) : 0;
    }

    function animateCounter(element, finalValue) {
      if (prefersReducedMotion) {
        element.textContent = finalValue + '+';
        return;
      }

      const startValue = 0;
      const duration = 2000;
      const increment = finalValue / (duration / 16);
      let currentValue = startValue;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          currentValue = finalValue;
          clearInterval(timer);
        }
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishStr = Math.floor(currentValue).toString();
        const persianStr = englishStr.split('').map(d => persianDigits[parseInt(d)]).join('');
        element.textContent = persianStr + '+';
      }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const finalNumber = persianToEnglish(entry.target.textContent);
          animateCounter(entry.target, finalNumber);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // Intersection Observer for fade-in animations (with reduced motion support)
  function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations if reduced motion preferred
      document.querySelectorAll('.about-item, .article-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.about-item, .article-card');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(1.5rem)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Initialize all features when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileMenu();
      initSmoothScroll();
      initStatsCounter();
      initScrollAnimations();
      loadArticles();
    });
  } else {
    initMobileMenu();
    initSmoothScroll();
    initStatsCounter();
    initScrollAnimations();
    loadArticles();
  }

  // Service Worker Registration (if available)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Service worker would be registered here if needed
      // navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
})();

