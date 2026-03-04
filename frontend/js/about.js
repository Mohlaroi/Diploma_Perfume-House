document.addEventListener('DOMContentLoaded', function() {
    // 🎯 IntersectionObserver для плавного появления секций
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    document.querySelectorAll('.about-section').forEach(section => {
        sectionObserver.observe(section);
    });

    // 🔥 ОДИН обработчик scroll для ВСЕГО
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Sticky header (показать после 200px)
        if (scrollTop > 200) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Hide/show header при скролле вниз/вверх
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Кнопка наверх (после 300px)
        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // ✅ Привязываем scroll
    window.addEventListener('scroll', handleScroll);

    // Кнопка наверх
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll-индикатор (стрелка вниз)
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Плавный скролл для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 🎨 Инициализация первых видимых секций
    setTimeout(() => {
        document.querySelectorAll('.about-section').forEach((section, index) => {
            if (index === 0) {
                section.classList.add('visible');
            }
        });
    }, 100);
});

// ✅ Lazy loading fallback для старых браузеров
if ('loading' in HTMLImageElement.prototype) {
    // Современные браузеры поддерживают loading="lazy"
} else {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// 🛡️ Оптимизация производительности
if ('IntersectionObserver' in window === false) {
    // Fallback для очень старых браузеров
    document.querySelectorAll('.about-section').forEach(section => {
        section.classList.add('visible');
    });
}
