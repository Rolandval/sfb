// Hero video carousel with yellow flash
window.addEventListener('DOMContentLoaded', function() {
    var video1 = document.querySelector('.hero-bg-video');
    if (!video1) return;
    var bgContainer = video1.parentElement;
    video1.removeAttribute('loop');
    video1.classList.add('video-fade');

    // Create second video for crossfade
    var video2 = video1.cloneNode();
    video2.classList.add('video-fade');
    video2.style.opacity = 0;
    video2.style.zIndex = 2;
    bgContainer.insertBefore(video2, video1.nextSibling);

    // Create flash overlay if not present
    var flash = document.createElement('div');
    flash.className = 'video-flash';
    bgContainer.appendChild(flash);

    var videos = [
        'images/video1solar.mp4',
        'images/video2solar.mp4',
        'images/video3solar.mp4',
        'images/video4solar.mp4'
    ];
    var posters = [
        'images/video1solar-poster.jpg',
        'images/video2solar-poster.jpg',
        'images/video3solar-poster.jpg',
        'images/video4solar-poster.jpg'
    ];
    var current = 0;
    var isChanging = false;
    var active = 0; // 0 - video1, 1 - video2

    function fadeInFlash(cb) {
        flash.classList.add('active');
        setTimeout(function() {
            if (cb) cb();
        }, 350);
    }
    function fadeOutFlash() {
        flash.classList.remove('active');
    }

    function crossfade(nextIdx) {
        isChanging = true;
        var vIn = active === 0 ? video2 : video1;
        var vOut = active === 0 ? video1 : video2;
        // Remove all previous handlers to avoid double fire
        vIn.oncanplay = null;
        vIn.onended = null;
        vOut.oncanplay = null;
        vOut.onended = null;

        vIn.src = videos[nextIdx];
        vIn.poster = posters[nextIdx] || posters[0];
        vIn.currentTime = 0;
        vIn.load();
        vIn.style.transition = 'opacity 0.7s cubic-bezier(.4,2,.6,1)';
        vOut.style.transition = 'opacity 0.7s cubic-bezier(.4,2,.6,1)';
        vIn.style.opacity = 0;
        vIn.muted = true;
        // Fade-in when ready
        vIn.oncanplay = function() {
            vIn.classList.add('loaded');
            vIn.style.opacity = 1;
            vOut.style.opacity = 0;
            setTimeout(function() {
                vOut.pause();
                vOut.classList.remove('loaded');
                isChanging = false;
                fadeOutFlash();
                // Always play the new video
                vIn.play();
            }, 700);
            vIn.oncanplay = null;
        };
        // Always assign ended handler for both videos
        vIn.onended = handleEnded;
        vOut.onended = null; // only active one should listen
        active = 1 - active;
        current = nextIdx;
    }

    function handleEnded() {
        if (isChanging) return;
        var next = (current + 1) % videos.length;
        fadeInFlash(function() {
            crossfade(next);
        });
    }

    // Init: play first video
    video1.addEventListener('loadeddata', function() {
        video1.classList.add('loaded');
        video1.play();
    });
    // Universal ended handler for both videos
    video1.onended = handleEnded;
    video2.onended = handleEnded;
});
