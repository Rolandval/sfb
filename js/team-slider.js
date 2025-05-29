// Логіка для слайдера команди буде додана тут
document.addEventListener('DOMContentLoaded', () => {
    const teamSliderWrapper = document.querySelector('.team-slider-wrapper');
    if (!teamSliderWrapper) {
        console.warn('Team slider wrapper not found.');
        return;
    }

    const track = teamSliderWrapper.querySelector('.team-slider-track');
    const cards = Array.from(track.children);
    const nextButton = teamSliderWrapper.querySelector('.team-slider-next');
    const prevButton = teamSliderWrapper.querySelector('.team-slider-prev');

    if (!track || !nextButton || !prevButton || cards.length === 0) {
        console.warn('Essential team slider elements are missing.');
        return;
    }

    let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) + parseInt(getComputedStyle(cards[0]).marginRight);
    let currentIndex = 0;
    let cardsToShow = Math.floor(teamSliderWrapper.querySelector('.team-slider').offsetWidth / cardWidth);

    function updateSliderPosition() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function updateButtonStates() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= cards.length - cardsToShow;
    }
    
    function calculateCardsToShow() {
        const sliderVisibleWidth = teamSliderWrapper.querySelector('.team-slider').offsetWidth;
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) + parseInt(getComputedStyle(cards[0]).marginRight);
            cardsToShow = Math.max(1, Math.floor(sliderVisibleWidth / cardWidth));
        } else {
            cardsToShow = 1;
        }
        updateButtonStates();
    }

    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - cardsToShow) {
            currentIndex++;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
        calculateCardsToShow();
        // Adjust currentIndex if it's out of bounds after resize
        if (currentIndex >= cards.length - cardsToShow && cards.length > cardsToShow) {
            currentIndex = cards.length - cardsToShow;
        } else if (cards.length <= cardsToShow) {
            currentIndex = 0;
        }
        updateSliderPosition();
        updateButtonStates();
    });

    // Initial setup
    calculateCardsToShow();
    updateSliderPosition(); // Ensure correct initial position
    updateButtonStates();
});
