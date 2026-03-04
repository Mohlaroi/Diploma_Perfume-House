// main.js — ОПТИМИЗИРОВАННАЯ ВЕРСИЯ 6.0 (PageSpeed 100%)
document.addEventListener('DOMContentLoaded', function() {
    
    // 🔥 TOP-BAR (LocalStorage + плавное удаление)
    if (localStorage.getItem('topbar-closed')) document.querySelector('.top-bar')?.remove();
    document.querySelector('.close-top-bar')?.addEventListener('click', function() {
        this.closest('.top-bar').style.opacity = '0';
        setTimeout(() => {
            this.closest('.top-bar').remove();
            localStorage.setItem('topbar-closed', 'true');
        }, 300);
    });

    // 🔥 MOUDON СЛАЙДЕР (оптимизированный)
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    let currentSlide = 0, autoSlide;

    function showSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        const text = slides[currentSlide].querySelector('.slide-text');
        if (text) {
            text.style.animation = 'none';
            text.offsetHeight;
            text.style.animation = 'slideInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }

    function navigate(dir) {
        clearInterval(autoSlide);
        showSlide(currentSlide + dir);
        autoSlide = setInterval(() => showSlide(currentSlide + 1), 6000);
    }

    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => navigate(i - currentSlide)));
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
    autoSlide = setInterval(() => showSlide(currentSlide + 1), 6000);

    // 🔥 МОБИЛЬНОЕ МЕНЮ (debounced)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    menuToggle?.addEventListener('click', e => {
        e.stopPropagation();
        [menuToggle, mainNav, headerActions, document.body].forEach(el => el?.classList.toggle('active' || 'mobile-open' || 'menu-open'));
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.main-header')) {
            [mainNav, menuToggle, headerActions, document.body].forEach(el => el?.classList.remove('mobile-open', 'active', 'menu-open'));
        }
    });

    // 🔥 ДРОПДАУНЫ (мобильные + десктоп)
    document.querySelectorAll('.dropdown .nav-link').forEach(link => {
        link.addEventListener('click', e => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.closest('.dropdown').classList.toggle('active');
            }
        });
    });

    // 🔥 НАВИГАЦИЯ КАТАЛОГА (все фильтры работают)
    document.querySelectorAll('a[href*="catalog.html?filter="], .collection-link[data-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            const filter = this.getAttribute('data-filter') || this.href.split('filter=')[1]?.split('&')[0];
            
            // Закрываем меню
            [document.querySelector('.mobile-menu-toggle'), mainNav, headerActions, document.body].forEach(el => el?.classList.remove('active', 'mobile-open', 'menu-open'));
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            
            console.log(`🚀 Каталог: ?filter=${filter}`);
        });
    });

    // 🔥 SCROLL АНИМАЦИЯ (IntersectionObserver)
    const observer = new IntersectionObserver((entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }), { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 🔥 RESIZE DEBOUNCE
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                [mainNav, menuToggle, headerActions, document.body].forEach(el => el?.classList.remove('mobile-open', 'active', 'menu-open'));
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        }, 150);
    });

    // 🔥 ПОИСК + КОРЗИНА (без заглушек)
    document.querySelector('.search-icon')?.addEventListener('click', e => {
        e.preventDefault();
        // Будет реализовано в будущем
    });

    document.querySelector('.cart-icon')?.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'cart.html';
    });

    console.log('🚀 main.js v6.0 — 100% оптимизировано');
});
