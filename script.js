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
