// Инициализация анимаций
AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-out-cubic'
});

// Поиск в шапке
const searchToggle = document.querySelector('.search-toggle');
const searchContainer = document.querySelector('.search-container');
const searchClose = document.querySelector('.search-close');

if (searchToggle) {
    searchToggle.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            document.querySelector('.search-input').focus();
        }
    });
    
    searchClose.addEventListener('click', function() {
        searchContainer.classList.remove('active');
    });
    
    // Закрытие поиска при клике вне области
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });
}

// Фильтрация статей
const filterButtons = document.querySelectorAll('.filter-btn');
const postCards = document.querySelectorAll('.post-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс со всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс нажатой кнопке
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Фильтруем статьи
        postCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Кнопка "Загрузить еще"
const loadMoreBtn = document.getElementById('loadMore');
let currentItems = 6;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        // В реальном проекте здесь будет AJAX-запрос к серверу
        // Сейчас просто показываем больше карточек
        
        const hiddenCards = Array.from(postCards).slice(currentItems, currentItems + 3);
        
        hiddenCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);
        });
        
        currentItems += 3;
        
        // Скрываем кнопку, если больше нет карточек
        if (currentItems >= postCards.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Для мобильных закрываем меню
            if (window.innerWidth <= 768) {
                const mobileMenu = document.querySelector('.main-nav');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.querySelector('.mobile-menu-toggle').classList.remove('active');
                }
            }
        }
    });
});

// Валидация формы подписки
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const consent = this.querySelector('input[type="checkbox"]').checked;
        
        if (!email || !consent) {
            alert('Пожалуйста, заполните все поля и дайте согласие на обработку данных');
            return;
        }
        
        // Симуляция отправки
        console.log('Подписка на блог:', email);
        
        // Показываем сообщение об успехе
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Спасибо за подписку! Проверьте вашу почту для подтверждения.</p>
        `;
        
        this.parentNode.insertBefore(successMsg, this);
        this.style.display = 'none';
        
        // Через 5 секунд возвращаем форму
        setTimeout(() => {
            this.style.display = 'block';
            successMsg.remove();
            this.reset();
        }, 5000);
    });
}

// Ленивая загрузка изображений
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
});