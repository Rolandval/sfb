document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const progressBar = document.getElementById('testimonialsProgress');
    
    if (!slider || !prevBtn || !nextBtn || !progressBar) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const slideCount = slides.length;
    let currentSlide = 0;
    
    // Ініціалізація слайдера
    function initSlider() {
        // Встановлюємо активний слайд
        updateSlides();
        updateProgressBar();
        
        // Додаємо обробники подій для кнопок
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
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
        
        // Автоматична зміна слайдів кожні 6 секунд
        let slideInterval = setInterval(nextSlide, 6000);
        
        // Зупиняємо автоматичну зміну при наведенні миші
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Відновлюємо автоматичну зміну при виході миші
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 6000);
        });
    }
    
    // Оновлюємо активний слайд
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            
            // Встановлюємо позицію для кожного слайду
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
            
            // Додаємо клас active для поточного слайду
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
    }
    
    // Оновлюємо прогрес-бар
    function updateProgressBar() {
        const progressWidth = (currentSlide / (slideCount - 1)) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }
    
    // Переходимо до наступного слайду з анімацією
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        
        // Застосовуємо анімацію
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Оновлюємо активний слайд та прогрес-бар
        updateSlides();
        updateProgressBar();
    }
    
    // Переходимо до попереднього слайду з анімацією
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        
        // Застосовуємо анімацію
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Оновлюємо активний слайд та прогрес-бар
        updateSlides();
        updateProgressBar();
    }
    
    // Ініціалізуємо слайдер
    initSlider();
});
