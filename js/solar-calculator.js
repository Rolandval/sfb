/**
 * Solar Calculator - Калькулятор сонячних електростанцій
 * 
 * Цей файл містить логіку для розрахунку вартості, окупності та 
 * ефективності сонячних електростанцій для бізнесу.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи існує контейнер калькулятора на сторінці
    const calculatorContainer = document.getElementById('solarCalculator');
    if (!calculatorContainer) return;
    
    // Ініціалізація калькулятора
    initSolarCalculator();
    
    /**
     * Ініціалізує калькулятор сонячних електростанцій
     */
    function initSolarCalculator() {
        // Створюємо HTML структуру калькулятора
        createCalculatorHTML();
        
        // Додаємо обробники подій
        setupEventListeners();
        
        // Встановлюємо початкові значення
        setDefaultValues();
        
        // Виконуємо початковий розрахунок
        calculateSolarSystem();
    }
    
    /**
     * Створює HTML структуру калькулятора
     */
    function createCalculatorHTML() {
        calculatorContainer.innerHTML = `
            <div class="calculator-wrapper">
                <div class="calculator-header">
                    <h3>КАЛЬКУЛЯТОР ОКУПНОСТІ СЕС</h3>
                    <p>Введіть дані для вашої СЕС</p>
                </div>
                
                <div class="calculator-body">
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <label for="monthlyConsumption">Середньомісячне споживання (кВт·год)</label>
                            <div class="input-value"><span id="consumptionValue">1000</span> кВт·год</div>
                            <input type="number" id="monthlyConsumption" min="1000" max="50000" step="1000" value="1000">
                            <div class="range-slider">
                                <input type="range" id="consumptionSlider" min="1000" max="50000" step="1000" value="1000">
                                <div class="slider-progress" id="consumptionProgress"></div>
                            </div>
                            <div class="slider-labels">
                                <span>1 тис.</span>
                                <span>50 тис.</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="electricityRate">Тариф на електроенергію (грн/кВт·год)</label>
                            <div class="input-value"><span id="rateValue">5.5</span> грн/кВт·год</div>
                            <input type="number" id="electricityRate" min="2" max="15" step="0.1" value="5.5">
                            <div class="range-slider">
                                <input type="range" id="rateSlider" min="2" max="15" step="0.1" value="5.5">
                                <div class="slider-progress" id="rateProgress"></div>
                            </div>
                            <div class="slider-labels">
                                <span>2 грн</span>
                                <span>15 грн</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="roofArea">Доступна площа даху (м²)</label>
                            <div class="input-value"><span id="areaValue">100</span> м²</div>
                            <input type="number" id="roofArea" min="10" max="1000" step="10" value="100">
                            <div class="range-slider">
                                <input type="range" id="areaSlider" min="10" max="1000" step="10" value="100">
                                <div class="slider-progress" id="areaProgress"></div>
                            </div>
                            <div class="slider-labels">
                                <span>10 м²</span>
                                <span>1000 м²</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="systemType">Тип системи</label>
                            <select id="systemType">
                                <option value="grid">Мережева (on-grid)</option>
                                <option value="hybrid">Гібридна з накопиченням</option>
                                <option value="autonomous">Автономна</option>
                            </select>
                        </div>
                        
                        <div class="input-group">
                            <label for="panelType">Тип панелей</label>
                            <select id="panelType">
                                <option value="standard">Стандартні (450 Вт)</option>
                                <option value="premium">Преміум (550 Вт)</option>
                                <option value="bifacial">Двосторонні (550+ Вт)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="calculator-results">
                        <div class="result-card">
                            <div class="result-icon">⚡</div>
                            <div class="result-value">
                                <span id="recommendedPower">0</span> кВт
                            </div>
                            <div class="result-label">Рекомендована потужність</div>
                        </div>
                        

                        
                        <div class="result-card">
                            <div class="result-icon">📊</div>
                            <div class="result-value">
                                <span id="annualProduction">0</span> кВт·год
                            </div>
                            <div class="result-label">Річне виробництво</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-icon">⏱️</div>
                            <div class="result-value">
                                <span id="paybackPeriod">0</span> років
                            </div>
                            <div class="result-label">Термін окупності</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-icon">💸</div>
                            <div class="result-value">
                                <span id="monthlySavings">0</span> грн/міс
                            </div>
                            <div class="result-label">Щомісячна економія</div>
                        </div>
                    </div>
                </div>
                
                <div class="calculator-footer">
                    <button id="recalculateBtn" class="calculator-btn">Перерахувати</button>
                    <button id="getOfferBtn" class="calculator-btn primary">Отримати комерційну пропозицію</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Додає обробники подій для елементів калькулятора
     */
    function setupEventListeners() {
        // Знаходимо елементи вводу
        const consumptionInput = document.getElementById('monthlyConsumption');
        const consumptionSlider = document.getElementById('consumptionSlider');
        const consumptionValue = document.getElementById('consumptionValue');
        const consumptionProgress = document.getElementById('consumptionProgress');
        
        const rateInput = document.getElementById('electricityRate');
        const rateSlider = document.getElementById('rateSlider');
        const rateValue = document.getElementById('rateValue');
        const rateProgress = document.getElementById('rateProgress');
        
        const areaInput = document.getElementById('roofArea');
        const areaSlider = document.getElementById('areaSlider');
        const areaValue = document.getElementById('areaValue');
        const areaProgress = document.getElementById('areaProgress');
        
        const systemTypeSelect = document.getElementById('systemType');
        const panelTypeSelect = document.getElementById('panelType');
        const recalculateBtn = document.getElementById('recalculateBtn');
        const getOfferBtn = document.getElementById('getOfferBtn');
        
        // Синхронізуємо поля вводу з повзунками та прогресом
        syncInputWithSlider(consumptionInput, consumptionSlider, consumptionValue, consumptionProgress);
        syncInputWithSlider(rateInput, rateSlider, rateValue, rateProgress);
        syncInputWithSlider(areaInput, areaSlider, areaValue, areaProgress);
        
        // Додаємо обробники подій для всіх елементів вводу
        [consumptionInput, consumptionSlider, rateInput, rateSlider, areaInput, areaSlider, systemTypeSelect, panelTypeSelect].forEach(element => {
            element.addEventListener('change', calculateSolarSystem);
            element.addEventListener('input', calculateSolarSystem);
        });
        
        // Оновлюємо прогрес слайдерів при завантаженні
        updateSliderProgress(consumptionSlider, consumptionProgress);
        updateSliderProgress(rateSlider, rateProgress);
        updateSliderProgress(areaSlider, areaProgress);
        
        // Кнопка перерахунку
        recalculateBtn.addEventListener('click', calculateSolarSystem);
        
        // Кнопка отримання комерційної пропозиції
        getOfferBtn.addEventListener('click', function() {
            // Перехід до форми заявки
            const leadForm = document.getElementById('lead-form');
            if (leadForm) {
                leadForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    /**
     * Синхронізує поле вводу з повзунком та відображенням значення
     */
    function syncInputWithSlider(input, slider, valueDisplay, progressBar) {
        input.addEventListener('input', function() {
            slider.value = this.value;
            if (valueDisplay) valueDisplay.textContent = this.value;
            if (progressBar) updateSliderProgress(slider, progressBar);
        });
        
        slider.addEventListener('input', function() {
            input.value = this.value;
            if (valueDisplay) valueDisplay.textContent = this.value;
            if (progressBar) updateSliderProgress(slider, progressBar);
        });
    }
    
    /**
     * Оновлює прогрес слайдера
     */
    function updateSliderProgress(slider, progressBar) {
        const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        progressBar.style.width = percent + '%';
    }
    
    /**
     * Встановлює початкові значення для калькулятора
     */
    function setDefaultValues() {
        // Можна встановити значення за замовчуванням, якщо потрібно
    }
    
    /**
     * Розраховує параметри сонячної електростанції
     */
    function calculateSolarSystem() {
        // Отримуємо значення з полів вводу
        const consumption = parseFloat(document.getElementById('monthlyConsumption').value);
        const rate = parseFloat(document.getElementById('electricityRate').value);
        const area = parseFloat(document.getElementById('roofArea').value);
        const systemType = document.getElementById('systemType').value;
        const panelType = document.getElementById('panelType').value;
        
        // Розраховуємо рекомендовану потужність (кВт)
        let recommendedPower = calculateRecommendedPower(consumption, systemType);
        
        // Обмежуємо потужність доступною площею даху
        const maxPowerByArea = calculateMaxPowerByArea(area, panelType);
        recommendedPower = Math.min(recommendedPower, maxPowerByArea);
        
        // Розраховуємо вартість системи
        const cost = calculateSystemCost(recommendedPower, systemType, panelType);
        
        // Розраховуємо річне виробництво електроенергії
        const annualProduction = calculateAnnualProduction(recommendedPower, panelType);
        
        // Розраховуємо щомісячну економію
        const monthlySavings = calculateMonthlySavings(annualProduction, rate);
        
        // Розраховуємо термін окупності
        const paybackPeriod = calculatePaybackPeriod(cost, monthlySavings);
        
        // Оновлюємо результати на сторінці
        updateResults(recommendedPower, cost, annualProduction, paybackPeriod, monthlySavings);
    }
    
    /**
     * Розраховує рекомендовану потужність системи на основі споживання
     */
    function calculateRecommendedPower(consumption, systemType) {
        // Річне споживання (кВт·год)
        const annualConsumption = consumption * 12;
        
        // Коефіцієнт для різних типів систем
        let systemFactor = 1.0;
        if (systemType === 'hybrid') systemFactor = 1.2;
        if (systemType === 'autonomous') systemFactor = 1.5;
        
        // Середнє виробництво 1 кВт в Україні (кВт·год/рік)
        const averageProductionPerKw = 1100;
        
        // Рекомендована потужність (кВт)
        let power = (annualConsumption * systemFactor) / averageProductionPerKw;
        
        // Округлюємо до 0.5 кВт
        return Math.ceil(power * 2) / 2;
    }
    
    /**
     * Розраховує максимальну потужність на основі доступної площі даху
     */
    function calculateMaxPowerByArea(area, panelType) {
        // Площа для 1 кВт в залежності від типу панелей (м²/кВт)
        let areaPerKw = 6; // Стандартні панелі
        if (panelType === 'premium') areaPerKw = 5;
        if (panelType === 'bifacial') areaPerKw = 4.5;
        
        // Максимальна потужність (кВт)
        return Math.floor((area / areaPerKw) * 2) / 2;
    }
    
    /**
     * Розраховує вартість системи
     */
    function calculateSystemCost(power, systemType, panelType) {
        // Базова вартість за 1 кВт (грн)
        let costPerKw = 30000; // Стандартна мережева система
        
        // Коефіцієнт для типу системи
        if (systemType === 'hybrid') costPerKw *= 1.3;
        if (systemType === 'autonomous') costPerKw *= 1.6;
        
        // Коефіцієнт для типу панелей
        if (panelType === 'premium') costPerKw *= 1.15;
        if (panelType === 'bifacial') costPerKw *= 1.25;
        
        // Знижка за обсяг
        let volumeDiscount = 1.0;
        if (power >= 10) volumeDiscount = 0.95;
        if (power >= 30) volumeDiscount = 0.9;
        if (power >= 50) volumeDiscount = 0.85;
        if (power >= 100) volumeDiscount = 0.8;
        
        // Загальна вартість
        return Math.round(power * costPerKw * volumeDiscount);
    }
    
    /**
     * Розраховує річне виробництво електроенергії
     */
    function calculateAnnualProduction(power, panelType) {
        // Базове виробництво (кВт·год/рік)
        let productionPerKw = 1100; // Стандартні панелі
        
        // Коефіцієнт для типу панелей
        if (panelType === 'premium') productionPerKw *= 1.1;
        if (panelType === 'bifacial') productionPerKw *= 1.2;
        
        // Загальне виробництво
        return Math.round(power * productionPerKw);
    }
    
    /**
     * Розраховує щомісячну економію
     */
    function calculateMonthlySavings(annualProduction, rate) {
        // Місячна економія (грн)
        return Math.round((annualProduction * rate) / 12);
    }
    
    /**
     * Розраховує термін окупності
     */
    function calculatePaybackPeriod(cost, monthlySavings) {
        // Термін окупності (років)
        const paybackYears = cost / (monthlySavings * 12);
        
        // Округлюємо до 0.1 року
        return Math.round(paybackYears * 10) / 10;
    }
    
    /**
     * Оновлює результати на сторінці
     */
    function updateResults(power, cost, production, payback, savings) {
        // Оновлюємо значення в результатах
        document.getElementById('recommendedPower').textContent = power.toFixed(1);
        // Видалено оновлення елемента estimatedCost
        document.getElementById('annualProduction').textContent = formatNumber(production);
        document.getElementById('paybackPeriod').textContent = payback.toFixed(1);
        document.getElementById('monthlySavings').textContent = formatNumber(savings);
        
        // Анімуємо зміну значень
        animateResults();
    }
    
    /**
     * Форматує число для відображення (додає розділювачі тисяч)
     */
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    /**
     * Додає анімацію до результатів
     */
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            // Додаємо затримку для кожної картки
            setTimeout(() => {
                card.classList.add('pulse');
                
                // Видаляємо клас після анімації
                setTimeout(() => {
                    card.classList.remove('pulse');
                }, 500);
            }, index * 100);
        });
    }
});
