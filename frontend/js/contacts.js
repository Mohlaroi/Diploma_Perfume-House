// Обработка формы
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация формы
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Симуляция отправки (в реальном проекте здесь будет fetch к серверу)
        const formData = new FormData(this);
        console.log('Отправка формы:', Object.fromEntries(formData));
        
        // Показываем сообщение об успехе
        formSuccess.style.display = 'flex';
        
        // Скрываем форму
        this.style.display = 'none';
        
        // Через 5 секунд возвращаем форму
        setTimeout(() => {
            this.style.display = 'block';
            formSuccess.style.display = 'none';
            this.reset();
        }, 5000);
    });
}

// FAQ аккордеон
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Закрываем все открытые вопросы
        document.querySelectorAll('.faq-question.active').forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
        });
        
        // Если вопрос не был активен, открываем его
        if (!isActive) {
            this.classList.add('active');
            answer.classList.add('active');
        }
    });
});

// Инициализация карты (заглушка, в реальном проекте будет Яндекс.Карты API)
function initMap() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        // В реальном проекте здесь будет код Яндекс.Карт
        console.log('Инициализация карты...');
        
        // Пример координат для трех магазинов
        const locations = [
            { name: 'Люльшенко 19/4', coords: [47.2210, 39.7206] },
            { name: 'Соколова 52А', coords: [47.2238, 39.7231] },
            { name: 'Космонавтов 2/2', coords: [47.2185, 39.7189] }
        ];
        
        // В реальном проекте:
        // ymaps.ready(function() {
        //     var map = new ymaps.Map("map", {
        //         center: [47.2210, 39.7206],
        //         zoom: 13
        //     });
        //     
        //     locations.forEach(loc => {
        //         var placemark = new ymaps.Placemark(loc.coords, {
        //             hintContent: loc.name
        //         });
        //         map.geoObjects.add(placemark);
        //     });
        // });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Плавное появление элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.contact-grid, .stores-grid, .map-section, .faq-grid').forEach(section => {
        observer.observe(section);
    });
});