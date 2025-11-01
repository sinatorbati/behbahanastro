// ===== ADVANCED ANIMATIONS & INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.mainNav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            // Only intercept in-page anchors starting with '#'
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.about-item, .article-card, .package-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });

    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.about-society::before, .featured-articles::before, .package-section::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.article-card, .about-image, .package-image');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Floating animation for stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animationDelay = `${1 + index * 0.2}s`;
        item.style.animation = 'fadeInUp 0.8s ease forwards';
    });

    // Interactive package features
    const packageFeatures = document.querySelectorAll('.package-features li');
    packageFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px)';
            this.style.color = '#fff';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = 'rgba(255, 255, 255, 0.95)';
        });
    });

    // Enhanced CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta, .view-all-btn, .package-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth reveal for section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = entry.target.querySelector('h2');
                    const description = entry.target.querySelector('p');
                    
                    if (title) title.style.animation = 'slideInLeft 0.8s ease forwards';
                    if (description) description.style.animation = 'slideInRight 0.8s ease 0.2s forwards';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(header);
    });

    // Enhanced navigation hover effects
    const navItems = document.querySelectorAll('.mainNav__link');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Social media icon animations
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.2) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });

    // Footer link animations
    const footerLinks = document.querySelectorAll('.footer-links a, .social-link');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-8px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Scroll progress indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (scrolled / maxScroll) * 100;
            
            if (scrollProgress > 10) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    }

    // Enhanced image hover effects
    const images = document.querySelectorAll('.about-image img, .article-image img, .package-image img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(1deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Floating card animation enhancement
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard) {
        floatingCard.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.style.transform = 'translateY(-12px) scale(1.05)';
        });
        
        floatingCard.addEventListener('mouseleave', function() {
            this.style.animation = 'gentleFloat 4s ease-in-out infinite';
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Convert Persian/Arabic digits to English digits
    function persianToEnglish(str) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let result = str;
        persianDigits.forEach((persian, index) => {
            result = result.replace(new RegExp(persian, 'g'), englishDigits[index]);
        });
        // Extract only numbers and + sign
        const numberMatch = result.match(/\d+/);
        return numberMatch ? parseInt(numberMatch[0], 10) : 0;
    }

    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const finalNumber = persianToEnglish(originalText);
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(stat, finalNumber);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });

    function animateCounter(element, finalValue) {
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
            // Convert back to Persian digits for display
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            const englishStr = Math.floor(currentValue).toString();
            const persianStr = englishStr.split('').map(d => persianDigits[parseInt(d)]).join('');
            element.textContent = persianStr + '+';
        }, 16);
    }

    // Enhanced mobile menu functionality
    const mobileMenuIcon = document.querySelector('.mainNav__icon');
    const mobileNavLinks = document.querySelector('.mainNav__links');
    
    if (mobileMenuIcon && mobileNavLinks) {
        let isOpen = false;
        
        mobileMenuIcon.addEventListener('click', function() {
            isOpen = !isOpen;
            mobileNavLinks.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', isOpen);
            
            // Prevent body scroll when menu is open (mobile only)
            if (window.innerWidth < 800) {
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });

        // Close menu when clicking outside (mobile only)
        document.addEventListener('click', function(e) {
            if (isOpen && window.innerWidth < 800) {
                if (!mobileNavLinks.contains(e.target) && !mobileMenuIcon.contains(e.target)) {
                    isOpen = false;
                    mobileNavLinks.classList.remove('active');
                    mobileMenuIcon.classList.remove('active');
                    mobileMenuIcon.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                mobileNavLinks.classList.remove('active');
                mobileMenuIcon.classList.remove('active');
                mobileMenuIcon.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileMenuIcon.focus();
            }
        });

        // Close menu when clicking a link (mobile only)
        mobileNavLinks.querySelectorAll('.mainNav__link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 800 && isOpen) {
                    isOpen = false;
                    mobileNavLinks.classList.remove('active');
                    mobileMenuIcon.classList.remove('active');
                    mobileMenuIcon.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 800 && isOpen) {
                    isOpen = false;
                    mobileNavLinks.classList.remove('active');
                    mobileMenuIcon.classList.remove('active');
                    mobileMenuIcon.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // Smooth reveal for about items
    const aboutItems = document.querySelectorAll('.about-item');
    aboutItems.forEach((item, index) => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(item);
    });

    console.log('🚀 Advanced animations and interactions loaded successfully!');

    // ===== Latest 4 Articles on Homepage =====
    const latestContainer = document.getElementById('latest-articles');
    if (latestContainer) {
        const base = (location.protocol === 'file:') ? 'http://localhost:3000' : '';
        const apiUrl = base + '/api/articles?featured=1';
        const linkBase = base;
        fetch(apiUrl)
            .then(r => r.json())
            .then(items => {
                latestContainer.innerHTML = items.map(a => {
                    const img = a.image ? `<div class=\"article-image\"><img src=\"/${a.image}\" alt=\"${a.title}\"></div>` : '';
                    const section = a.type === 'NEWS' ? 'news' : 'articles';
                    return `
                    <article class=\"article-card\">
                        ${img}
                        <div class=\"article-content\">
                            <h3>${a.title}</h3>
                            <p>${a.summary}</p>
                            <a href=\"${linkBase}/${section}/${a.id}\" class=\"read-more\">ادامه مطلب</a>
                        </div>
                    </article>`;
                }).join('');
            })
            .catch(() => {
                latestContainer.innerHTML = '<p>خطا در بارگذاری مقالات.</p>';
            });
    }

    // Fix links for file:// usage (use absolute server URL)
    const viewAllLink = document.getElementById('view-all-articles-link');
    if (viewAllLink && location.protocol === 'file:') {
        const path = viewAllLink.getAttribute('href') || '/news';
        viewAllLink.href = 'http://localhost:3000' + path;
    }

    if (location.protocol === 'file:') {
        const newsHeaderLink = document.querySelector('a.mainNav__link[href="/news"]');
        if (newsHeaderLink) newsHeaderLink.href = 'http://localhost:3000/news';
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for scroll events
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);