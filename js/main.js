// ===================================
// 4BITES CAFE - ENHANCED JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Loading Screen ---
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 1800);
        });
        document.body.style.overflow = 'hidden';
    }
    
    // --- Custom Cursor (Desktop Only) ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .dish-card, .gallery-item, .testimonial-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll direction
            if (currentScroll > lastScroll && currentScroll > 400) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // --- Scroll Reveal Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible', 'animated');
                }, parseInt(delay));
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animateElements = document.querySelectorAll(
        '.fade-in-up, [data-animate], .dish-card, .testimonial-card, .value-card, .team-card, .menu-item-card, .gallery-item, .section-header'
    );
    
    animateElements.forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
        }
        observer.observe(el);
    });
    
    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function animateCounter(el, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // --- Menu Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            menuCategories.forEach(category => {
                const shouldShow = filter === 'all' || category.dataset.category === filter;
                
                if (shouldShow) {
                    category.style.display = 'block';
                    requestAnimationFrame(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    });
                } else {
                    category.style.opacity = '0';
                    category.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        category.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // --- Testimonials Slider ---
    const sliderTrack = document.querySelector('.testimonial-track');
    const sliderPrev = document.querySelector('.slider-btn.prev');
    const sliderNext = document.querySelector('.slider-btn.next');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    
    if (sliderTrack && sliderPrev && sliderNext) {
        let currentSlide = 0;
        const cards = sliderTrack.querySelectorAll('.testimonial-card');
        const totalSlides = cards.length;
        
        function getCardsPerView() {
            if (window.innerWidth < 600) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }
        
        function updateSlider() {
            const cardsPerView = getCardsPerView();
            const maxSlide = Math.max(0, totalSlides - cardsPerView);
            currentSlide = Math.min(currentSlide, maxSlide);
            
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(sliderTrack).gap) || 32;
            const offset = currentSlide * (cardWidth + gap);
            
            sliderTrack.style.transform = `translateX(-${offset}px)`;
            
            sliderDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        
        sliderNext.addEventListener('click', () => {
            const cardsPerView = getCardsPerView();
            const maxSlide = Math.max(0, totalSlides - cardsPerView);
            currentSlide = Math.min(currentSlide + 1, maxSlide);
            updateSlider();
        });
        
        sliderPrev.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - 1, 0);
            updateSlider();
        });
        
        sliderDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
        });
        
        window.addEventListener('resize', updateSlider);
        updateSlider();
        
        // Auto-play
        let autoPlay = setInterval(() => {
            const cardsPerView = getCardsPerView();
            const maxSlide = Math.max(0, totalSlides - cardsPerView);
            currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
            updateSlider();
        }, 5000);
        
        sliderTrack.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderTrack.parentElement.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                const cardsPerView = getCardsPerView();
                const maxSlide = Math.max(0, totalSlides - cardsPerView);
                currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
                updateSlider();
            }, 5000);
        });
    }
    
    // --- Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox && galleryItems.length) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = 0;
        
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            title: item.querySelector('.gallery-title')?.textContent || ''
        }));
        
        function openLightbox(index) {
            currentImageIndex = index;
            lightboxImg.src = images[index].src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function navigateLightbox(direction) {
            currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = images[currentImageIndex].src;
                lightboxImg.style.opacity = '1';
            }, 200);
        }
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
        
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }
    
    // --- Booking Form ---
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    
    if (bookingForm) {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                bookingForm.style.opacity = '0';
                bookingForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    bookingForm.style.display = 'none';
                    bookingSuccess.classList.add('active');
                    bookingSuccess.style.display = 'block';
                }, 300);
                
                console.log('Booking submitted:', data);
            }, 1500);
        });
    }
    
    // --- Parallax Effect ---
    const parallaxElements = document.querySelectorAll('.hero-bg-image, .music-bg');
    
    if (parallaxElements.length && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    el.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
                }
            });
        }, { passive: true });
    }
    
    // --- Magnetic Button Effect ---
    const magneticBtns = document.querySelectorAll('.magnetic');
    
    if (window.matchMedia('(hover: hover)').matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // --- Initialize page ---
    document.body.classList.add('loaded');
});

// Dynamic styles
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    body.loaded {
        opacity: 1;
    }
    .navbar {
        transition: transform 0.3s ease, background 0.3s ease, padding 0.3s ease;
    }
    .menu-category {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .lightbox-image {
        transition: opacity 0.2s ease;
    }
    .booking-form {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);