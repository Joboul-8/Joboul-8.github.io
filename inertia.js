document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("track");

    if (!track) {
        console.error("Could not find element with id='track'");
        return;
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    let velocity = 0;
    let lastX = 0;
    let momentumID = null;

    let autoScrollEnabled = true;
    const autoScrollSpeed = 0.5;

    function getX(e) {
        return e.pageX || e.touches?.[0]?.pageX || 0;
    }

    function start(e) {
        isDown = true;

        startX = getX(e);
        lastX = startX;

        scrollLeft = track.scrollLeft;
        velocity = 0;

        autoScrollEnabled = false;

        if (momentumID) {
            cancelAnimationFrame(momentumID);
        }

        track.style.cursor = "grabbing";
    }

    function move(e) {
        if (!isDown) return;

        e.preventDefault();

        const x = getX(e);
        const walk = x - startX;

        track.scrollLeft = scrollLeft - walk;

        velocity = x - lastX;
        lastX = x;
    }

    function end() {
        if (!isDown) return;

        isDown = false;
        track.style.cursor = "grab";

        applyMomentum();

        setTimeout(() => {
            autoScrollEnabled = true;
        }, 1000);
    }

    function applyMomentum() {
        const friction = 0.7;

        function animate() {
            if (Math.abs(velocity) < 0.4) return;

            track.scrollLeft -= velocity;
            velocity *= friction;

            momentumID = requestAnimationFrame(animate);
        }

        momentumID = requestAnimationFrame(animate);
    }

function autoScroll() {
    if (autoScrollEnabled && !isDown) {
        track.scrollLeft += autoScrollSpeed;

        // safer reset (NOT half width)
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
            track.scrollLeft = 0;
        }
    }

    requestAnimationFrame(autoScroll);
}
    autoScroll();
});