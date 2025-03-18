var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('bg-video', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

// Transition Toggle
document.getElementById('transitionToggle').addEventListener('click', function() {
    const body = document.body;
    const button = this;
    if (body.classList.contains('no-transition')) {
        body.classList.remove('no-transition');
        button.textContent = 'Transition: On';
    } else {
        body.classList.add('no-transition');
        button.textContent = 'Transition: Off';
    }
});

// Apply transition to page loads
window.addEventListener('load', function() {
    document.body.classList.add('page-transition');
    setTimeout(() => document.body.classList.remove('page-transition'), 500);
});

// Handle navigation with transition
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (!document.body.classList.contains('no-transition')) {
            e.preventDefault();
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = this.href;
            }, 500);
        }
    });
});
