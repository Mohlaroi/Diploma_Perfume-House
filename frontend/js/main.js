// main.js — БЕЗОПАСНАЯ версия для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    
    // 🎠 СЛАЙДЕР (только если элементы существуют)
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        let currentSlide = 0;

        function showSlide(n) {
            currentSlide = (n + slides.length) % slides.length;
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // 🔔 ЗАКРЫТИЕ ПАНЕЛИ (только если есть)
    const closeBtn = document.querySelector('.close-top-bar');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            this.closest('.top-bar').style.display = 'none';
        });
    }

    // 📱 МОБИЛЬНОЕ МЕНЮ (только если есть)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            if (headerActions) headerActions.classList.toggle('active');
        });
    }

    // 📂 ВЫПАДАЮЩИЕ МЕНЮ (только если есть)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
        }
    });

    console.log('✅ main.js загружен без ошибок!');
});
