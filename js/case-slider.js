document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('casesSlider');
    const prevBtn = document.getElementById('prevCase');
    const nextBtn = document.getElementById('nextCase');
    const dotsContainer = document.getElementById('caseDots');
    
    if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = slider.querySelectorAll('.case-slide');
    const slideCount = slides.length;
    let currentSlide = 0;
    
    // Створюємо точки для слайдера
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Оновлюємо активну точку
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Переходимо до конкретного слайду
    function goToSlide(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    
    // Переходимо до наступного слайду
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    // Переходимо до попереднього слайду
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    // Додаємо обробники подій для кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Автоматична зміна слайдів кожні 5 секунд
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Зупиняємо автоматичну зміну при наведенні миші
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Відновлюємо автоматичну зміну при виході миші
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Додаємо підтримку свайпів для мобільних пристроїв
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Свайп вліво - наступний слайд
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Свайп вправо - попередній слайд
        }
    }
});
