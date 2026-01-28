// test.js - Логика теста для подбора ароматов

document.addEventListener('DOMContentLoaded', function() {
    // Данные теста
    const testData = {
        questions: [
            {
                id: 1,
                text: "Какой образ жизни вам ближе всего?",
                options: [
                    { 
                        text: "Энергичный и активный", 
                        icon: "fas fa-running",
                        type: "fresh"
                    },
                    { 
                        text: "Творческий и мечтательный", 
                        icon: "fas fa-paint-brush",
                        type: "floral"
                    },
                    { 
                        text: "Деловой и уверенный", 
                        icon: "fas fa-briefcase",
                        type: "woody"
                    },
                    { 
                        text: "Романтичный и чувственный", 
                        icon: "fas fa-heart",
                        type: "oriental"
                    }
                ]
            },
            {
                id: 2,
                text: "Какую музыку вы предпочитаете?",
                options: [
                    { 
                        text: "Электронная, поп", 
                        icon: "fas fa-music",
                        type: "fresh"
                    },
                    { 
                        text: "Инди, альтернатива", 
                        icon: "fas fa-guitar",
                        type: "floral"
                    },
                    { 
                        text: "Классика, джаз", 
                        icon: "fas fa-headphones",
                        type: "woody"
                    },
                    { 
                        text: "R&B, соул", 
                        icon: "fas fa-volume-up",
                        type: "oriental"
                    }
                ]
            },
            {
                id: 3,
                text: "Какая погода вам нравится больше?",
                options: [
                    { 
                        text: "Свежее утро после дождя", 
                        icon: "fas fa-cloud-rain",
                        type: "fresh"
                    },
                    { 
                        text: "Теплый весенний день", 
                        icon: "fas fa-sun",
                        type: "floral"
                    },
                    { 
                        text: "Прохладный осенний вечер", 
                        icon: "fas fa-wind",
                        type: "woody"
                    },
                    { 
                        text: "Жаркое лето у моря", 
                        icon: "fas fa-umbrella-beach",
                        type: "oriental"
                    }
                ]
            },
            {
                id: 4,
                text: "Какой у вас характер?",
                options: [
                    { 
                        text: "Легкий и открытый", 
                        icon: "fas fa-laugh",
                        type: "fresh"
                    },
                    { 
                        text: "Нежный и чувствительный", 
                        icon: "fas fa-smile",
                        type: "floral"
                    },
                    { 
                        text: "Решительный и сильный", 
                        icon: "fas fa-crown",
                        type: "woody"
                    },
                    { 
                        text: "Загадочный и страстный", 
                        icon: "fas fa-fire",
                        type: "oriental"
                    }
                ]
            },
            {
                id: 5,
                text: "Какие материалы в одежде предпочитаете?",
                options: [
                    { 
                        text: "Хлопок, лён", 
                        icon: "fas fa-tshirt",
                        type: "fresh"
                    },
                    { 
                        text: "Шелк, кружево", 
                        icon: "fas fa-female",
                        type: "floral"
                    },
                    { 
                        text: "Кожа, шерсть", 
                        icon: "fas fa-vest",
                        type: "woody"
                    },
                    { 
                        text: "Бархат, атлас", 
                        icon: "fas fa-gem",
                        type: "oriental"
                    }
                ]
            }
        ],
        
        results: {
            fresh: {
                name: "СВЕЖИЙ ТИП",
                description: "Вы энергичны, оптимистичны и любите активный образ жизни. Вам подходят легкие, воздушные ароматы с нотками цитрусов, морских аккордов и зелени.",
                recommendations: [
                    { name: "Memo Paris - Irish Leather", desc: "Свежий кожаный аромат с ирландским мхом" },
                    { name: "Initio Parfums - Musk Therapy", desc: "Чистый мускус с нотами бергамота" },
                    { name: "Moudon - Vanille Exquise", desc: "Легкая ваниль с цветочными акцентами" }
                ]
            },
            floral: {
                name: "ЦВЕТОЧНЫЙ ТИП",
                description: "Вы романтичны, мечтательны и цените прекрасное. Идеальные ароматы для вас — нежные цветочные композиции с нотами розы, жасмина и пиона.",
                recommendations: [
                    { name: "Louizon - Rose Noire", desc: "Темная роза с нотами пачули" },
                    { name: "Initio Parfums - Psychedelic Love", desc: "Гипнотическая роза с шафраном" },
                    { name: "Memo Paris - French Leather", desc: "Нежная кожа с цветочными нотами" }
                ]
            },
            woody: {
                name: "ДРЕВЕСНЫЙ ТИП",
                description: "Вы уверены в себе, практичны и цените качество. Вам подойдут солидные ароматы с нотами сандала, кедра, пачули и кожи.",
                recommendations: [
                    { name: "Chopard - Oud Malaki", desc: "Благородный уд с древесными нотами" },
                    { name: "Initio Parfums - Absolute Aphrodisiac", desc: "Глубокий ванильно-древесный аромат" },
                    { name: "Memo Paris - African Leather", desc: "Экзотическая кожа с пряностями" }
                ]
            },
            oriental: {
                name: "ВОСТОЧНЫЙ ТИП",
                description: "Вы страстны, загадочны и любите роскошь. Ваши идеальные ароматы — насыщенные восточные композиции с амброй, ванилью, ладаном и специями.",
                recommendations: [
                    { name: "Lattafa - Khamrah", desc: "Богатый восточный аромат с финиками" },
                    { name: "Swiss Arabian - Shaghaf", desc: "Роскошный арабский парфюм с удом" },
                    { name: "Rasasi - Hawas", desc: "Сочный восточно-фужерный аромат" }
                ]
            }
        }
    };
    
    // Переменные состояния
    let currentQuestionIndex = 0;
    let userAnswers = [];
    const totalQuestions = testData.questions.length;
    
    // Элементы DOM
    const testIntro = document.getElementById('testIntro');
    const questionsContainer = document.getElementById('questionsContainer');
    const testResults = document.getElementById('testResults');
    const startTestBtn = document.getElementById('startTestBtn');
    const progressFill = document.getElementById('progressFill');
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    
    // Инициализация
    totalQuestionsEl.textContent = totalQuestions;
    
    // Обработчики событий
    startTestBtn.addEventListener('click', startTest);
    
    // Функции
    function startTest() {
        testIntro.style.display = 'none';
        questionsContainer.style.display = 'block';
        currentQuestionIndex = 0;
        userAnswers = [];
        renderQuestion(currentQuestionIndex);
        updateProgress();
    }
    
    function renderQuestion(index) {
        const question = testData.questions[index];
        
        questionsContainer.innerHTML = `
            <div class="question-container active">
                <div class="question-number">Вопрос ${question.id} из ${totalQuestions}</div>
                <h2 class="question-text">${question.text}</h2>
                
                <div class="options-grid" id="optionsGrid">
                    ${question.options.map((option, i) => `
                        <button class="option-button" data-index="${i}" data-type="${option.type}">
                            <i class="${option.icon} option-icon"></i>
                            <span>${option.text}</span>
                            <i class="fas fa-check"></i>
                        </button>
                    `).join('')}
                </div>
                
                <div class="navigation-buttons">
                    <button class="prev-btn" id="prevBtn" ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                    
                    ${index === totalQuestions - 1 
                        ? `<button class="submit-btn" id="submitBtn" disabled>
                            <i class="fas fa-check-circle"></i> Получить результат
                          </button>`
                        : `<button class="next-btn" id="nextBtn" disabled>
                            Далее <i class="fas fa-arrow-right"></i>
                          </button>`
                    }
                </div>
            </div>
        `;
        
        // Добавляем обработчики
        const optionButtons = document.querySelectorAll('.option-button');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Снимаем выделение со всех кнопок
                optionButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Выделяем выбранную
                this.classList.add('selected');
                
                // Сохраняем ответ
                userAnswers[index] = {
                    questionId: question.id,
                    type: this.getAttribute('data-type')
                };
                
                // Обновляем placeholder в сайдбаре
                updateSidebar();
                
                // Активируем кнопку навигации
                if (nextBtn) nextBtn.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
            });
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    renderQuestion(currentQuestionIndex);
                    updateProgress();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentQuestionIndex < totalQuestions - 1) {
                    currentQuestionIndex++;
                    renderQuestion(currentQuestionIndex);
                    updateProgress();
                }
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', showResults);
        }
        
        // Восстанавливаем выбранный ответ, если есть
        if (userAnswers[index]) {
            const selectedIndex = question.options.findIndex(
                opt => opt.type === userAnswers[index].type
            );
            if (selectedIndex !== -1) {
                optionButtons[selectedIndex].classList.add('selected');
                if (nextBtn) nextBtn.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
            }
        }
    }
    
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        currentQuestionEl.textContent = currentQuestionIndex + 1;
    }
    
    function updateSidebar() {
        if (userAnswers.length > 0) {
            // Подсчитываем предварительные результаты
            const typeCounts = {};
            userAnswers.forEach(answer => {
                if (answer) {
                    typeCounts[answer.type] = (typeCounts[answer.type] || 0) + 1;
                }
            });
            
            // Находим наиболее частый тип
            let maxType = '';
            let maxCount = 0;
            for (const type in typeCounts) {
                if (typeCounts[type] > maxCount) {
                    maxCount = typeCounts[type];
                    maxType = type;
                }
            }
            
            // Обновляем placeholder
            if (maxType && testData.results[maxType]) {
                resultPlaceholder.innerHTML = `
                    <div class="preview-result">
                        <i class="fas fa-spa"></i>
                        <h4>${testData.results[maxType].name}</h4>
                        <p>Пока что лидирует этот тип</p>
                        <div class="mini-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(maxCount / userAnswers.length) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    function showResults() {
        // Подсчет результатов
        const typeCounts = {};
        userAnswers.forEach(answer => {
            if (answer) {
                typeCounts[answer.type] = (typeCounts[answer.type] || 0) + 1;
            }
        });
        
        // Определяем победивший тип
        let winnerType = '';
        let maxCount = 0;
        for (const type in typeCounts) {
            if (typeCounts[type] > maxCount) {
                maxCount = typeCounts[type];
                winnerType = type;
            }
        }
        
        // Если несколько типов набрали одинаковое количество
        const equalTypes = [];
        for (const type in typeCounts) {
            if (typeCounts[type] === maxCount) {
                equalTypes.push(type);
            }
        }
        
        // Выбираем случайный из равных
        const finalType = equalTypes[Math.floor(Math.random() * equalTypes.length)];
        const result = testData.results[finalType];
        
        // Генерация промокода
        const promoCode = generatePromoCode();
        
        // Показываем результаты
        questionsContainer.style.display = 'none';
        testResults.style.display = 'block';
        
        testResults.innerHTML = `
            <div class="results-content">
                <div class="results-header">
                    <h2 class="results-title">Ваш результат готов!</h2>
                    <p class="results-subtitle">Мы подобрали идеальные ароматы именно для вас</p>
                </div>
                
                <div class="perfume-type">
                    <h3 class="type-name">${result.name}</h3>
                    <p class="type-description">${result.description}</p>
                    <div class="type-stats">
                        <div class="stat">Совпадение: <strong>${Math.round((maxCount / totalQuestions) * 100)}%</strong></div>
                    </div>
                </div>
                
                <div class="recommendations">
                    <h3>Рекомендуемые ароматы</h3>
                    ${result.recommendations.map(rec => `
                        <div class="recommendation-item">
                            <div class="recommendation-image">
                                <i class="fas fa-wine-bottle"></i>
                            </div>
                            <div class="recommendation-info">
                                <div class="recommendation-name">${rec.name}</div>
                                <div class="recommendation-desc">${rec.desc}</div>
                            </div>
                            <a href="catalog.html" class="action-button secondary small">
                                Смотреть
                            </a>
                        </div>
                    `).join('')}
                </div>
                
                <div class="discount-code">
                    <h4>Ваш промокод на скидку</h4>
                    <p>Используйте его при покупке рекомендованных ароматов</p>
                    <div class="code">${promoCode}</div>
                    <p class="discount-note">Скидка 10% действует 7 дней</p>
                </div>
                
                <div class="result-actions">
                    <a href="catalog.html" class="action-button primary">
                        <i class="fas fa-shopping-bag"></i> Смотреть каталог
                    </a>
                    <button class="action-button secondary" id="retakeTestBtn">
                        <i class="fas fa-redo"></i> Пройти тест заново
                    </button>
                    <button class="action-button secondary" id="saveResultsBtn">
                        <i class="fas fa-download"></i> Сохранить результат
                    </button>
                </div>
            </div>
        `;
        
        // Обработчики для кнопок результатов
        document.getElementById('retakeTestBtn').addEventListener('click', startTest);
        document.getElementById('saveResultsBtn').addEventListener('click', saveResults);
        
        // Обновляем сайдбар
        resultPlaceholder.innerHTML = `
            <div class="final-result">
                <i class="fas fa-award"></i>
                <h4>${result.name}</h4>
                <p>Ваш результат сохранен</p>
                <p class="promo-code">Промокод: <strong>${promoCode}</strong></p>
            </div>
        `;
    }
    
    function generatePromoCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    function saveResults() {
        const resultText = `Мой парфюмерный тип: ${testData.results[getWinnerType()].name}\nПромокод: ${generatePromoCode()}`;
        
        // Создаем элемент для копирования
        const textarea = document.createElement('textarea');
        textarea.value = resultText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Показываем уведомление
        showNotification('Результат скопирован в буфер обмена!');
    }
    
    function getWinnerType() {
        const typeCounts = {};
        userAnswers.forEach(answer => {
            if (answer) {
                typeCounts[answer.type] = (typeCounts[answer.type] || 0) + 1;
            }
        });
        
        let winnerType = '';
        let maxCount = 0;
        for (const type in typeCounts) {
            if (typeCounts[type] > maxCount) {
                maxCount = typeCounts[type];
                winnerType = type;
            }
        }
        
        return winnerType;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Инициализация нотификации
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            color: #4ecdc4;
        }
    `;
    document.head.appendChild(style);
    
    // Плавный скролл
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});