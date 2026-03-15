document.addEventListener('DOMContentLoaded', () => {
    const CORRECT_PASSWORD = "02142026";
    
    // Acrostic Poem: <b> tags on first letters of every line
    const poemText = `<b>I</b>n the era of my life filled with emptiness,
<b>L</b>ight shone from your brilliant smile.
<b>O</b>vercoming my fears and numbness,
<b>V</b>enturing toward a love I haven't felt in a while.

<b>E</b>ach day, hoping that you would choose me,
<b>Y</b>earning for the day that you would be mine.
<b>O</b>h, how glad I was for my eyes to see,
<b>U</b>ltimately, my prayers were heard by the divine.

<b>E</b>va, my love for you consistently burns bright.
<b>V</b>owing to protect this spark with all my might.
<b>A</b>rt in human form, as beautiful as the moonlight.`;

    const body = document.body;
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const gateCard = document.getElementById('gate-card');
    const errorMsg = document.getElementById('error-msg');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('bg-music');
    const poemTrigger = document.getElementById('poem-trigger');
    const typewriterElement = document.getElementById('typewriter-poem');
    
    let hasTyped = false;

    // Start background hearts immediately (Ensures they are active on gate screen)
    setInterval(createFloatingHeart, 600);

    // 1. UNLOCK LOGIC
    function unlock() {
        if (passwordInput.value.trim() === "" || passwordInput.value !== CORRECT_PASSWORD) {
            errorMsg.style.display = "block";
            gateCard.classList.add('shake');
            passwordInput.value = "";
            setTimeout(() => gateCard.classList.remove('shake'), 400);
        } else {
            document.getElementById('password-gate').style.opacity = "0";
            body.classList.remove('locked');
            setTimeout(() => {
                document.getElementById('password-gate').style.display = "none";
                mainContent.classList.remove('hidden');
                music.play().catch(() => {});
                initScroll();
            }, 800);
        }
    }

    unlockBtn.addEventListener('click', unlock);
    passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') unlock(); });

    // 2. SOUNDS
    function playSfx(type) {
        let sfx = new Audio(type === 'flip' ? 'assets/audio/flip.mp3' : 'assets/audio/paper.mp3');
        sfx.volume = music.volume;
        sfx.play().catch(() => {});
    }

    // 3. MUSIC & VOLUME
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    musicToggle.addEventListener('click', () => {
        if (music.paused) { music.play(); musicToggle.innerText = "🎵"; }
        else { music.pause(); musicToggle.innerText = "🔇"; }
    });
    volumeSlider.addEventListener('input', (e) => music.volume = e.target.value);

    // 4. TIMELINE FLIP
    document.querySelectorAll('.flip-card-inner').forEach(card => {
        card.addEventListener('click', () => {
            card.parentElement.classList.toggle('flipped');
            playSfx('flip');
        });
    });

    // 5. TYPEWRITER POEM (Correctly handles bold tags and multiple lines)
    function startTypewriter() {
        if (hasTyped) return;
        hasTyped = true;
        let i = 0;
        const speed = 25; 

        function type() {
            if (i < poemText.length) {
                if (poemText.charAt(i) === '<') {
                    let tagEnd = poemText.indexOf('>', i);
                    typewriterElement.innerHTML += poemText.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                    type(); 
                } else {
                    typewriterElement.innerHTML += poemText.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
        }
        type();
    }

    poemTrigger.addEventListener('click', () => {
        poemTrigger.classList.toggle('flipped');
        if (poemTrigger.classList.contains('flipped')) {
            playSfx('flip');
            setTimeout(startTypewriter, 600);
        }
    });

    // 6. ENVELOPE
    document.getElementById('envelope').addEventListener('click', function() {
        this.classList.toggle('open');
        playSfx('paper');
    });

    // 7. HEARTS GENERATOR
    function createFloatingHeart() {
        const heartBg = document.getElementById('heart-bg');
        if(!heartBg) return;
        const heart = document.createElement('div');
        heart.innerHTML = "💛";
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + "vw";
        const duration = Math.random() * 3 + 4; 
        heart.style.animationDuration = duration + "s";
        heartBg.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }

    // 8. CLICK EFFECT
    document.addEventListener('click', (e) => {
        if (mainContent.classList.contains('hidden')) return;
        const heart = document.createElement('div');
        heart.innerHTML = "💛";
        heart.style.cssText = `position:fixed; left:${e.clientX}px; top:${e.clientY}px; pointer-events:none; z-index:99999; animation:fadeUp 1s forwards;`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    });

    function initScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.event').forEach(item => observer.observe(item));
    }
});