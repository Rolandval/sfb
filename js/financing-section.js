// financing-section.js: М'яка анімація для секції "Допомагаємо з кредитом та грантами"
document.addEventListener('DOMContentLoaded', function() {
    var section = document.querySelector('.financing-content.animate');
    var img = document.querySelector('.financing-animated-img');
    if (!section && !img) return;
    var observer = new window.IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('financing-content')) {
                    entry.target.classList.add('visible');
                }
                if (entry.target.classList.contains('financing-animated-img')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.25 });
    if (section) observer.observe(section);
    if (img) observer.observe(img);
});
