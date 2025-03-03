// 當頁面加載完成時自動播放音樂
function initMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;
    music.volume = 1;
    
    // 嘗試播放音樂
    try {
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Autoplay started successfully");
                updateMusicButtonStyle(true);
            }).catch((error) => {
                console.log("Autoplay prevented:", error);
                const events = ['click', 'touchstart', 'touchend'];
                
                function handleInteraction() {
                    music.play()
                        .then(() => {
                            console.log("Music started after user interaction");
                            updateMusicButtonStyle(true);
                            events.forEach(event => {
                                document.removeEventListener(event, handleInteraction);
                            });
                        })
                        .catch(e => console.log("Play failed:", e));
                }
                
                events.forEach(event => {
                    document.addEventListener(event, handleInteraction, { once: true });
                });
            });
        }
    } catch (error) {
        console.log("Autoplay error:", error);
        updateMusicButtonStyle(false);
    }
}

// 幻燈片功能
let slideIndex = 1;
let slideInterval;

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.opacity = "1";
    dots[slideIndex-1].className += " active";
}

function currentSlide(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex = n);
    startSlideshow();
}

function startSlideshow() {
    showSlides(slideIndex);
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000);
}

// 語言切換功能
function switchLanguage(lang) {
    const enElements = document.querySelectorAll('.en');
    const zhElements = document.querySelectorAll('.zh');
    const enButton = document.querySelector('button[onclick="switchLanguage(\'en\')"]');
    const zhButton = document.querySelector('button[onclick="switchLanguage(\'zh\')"]');

    if (lang === 'en') {
        enElements.forEach(el => el.style.display = 'inline-block');
        zhElements.forEach(el => el.style.display = 'none');
        enButton.classList.add('active');
        zhButton.classList.remove('active');
    } else {
        zhElements.forEach(el => el.style.display = 'inline-block');
        enElements.forEach(el => el.style.display = 'none');
        zhButton.classList.add('active');
        enButton.classList.remove('active');
    }
}

// 音樂控制
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;
    
    if (music.paused) {
        music.play();
        updateMusicButtonStyle(true);
    } else {
        music.pause();
        updateMusicButtonStyle(false);
    }
}

function updateMusicButtonStyle(isPlaying) {
    const playBtn = document.getElementById('musicPlay');
    const stopBtn = document.getElementById('musicStop');
    if (!playBtn || !stopBtn) return;
    
    if (isPlaying) {
        playBtn.classList.add('playing');
        stopBtn.classList.remove('playing');
    } else {
        playBtn.classList.remove('playing');
        stopBtn.classList.add('playing');
    }
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化幻燈片
    showSlides(slideIndex);
    startSlideshow();
    
    // 初始化音樂
    initMusic();
    
    // 為音樂按鈕添加點擊事件
    const playBtn = document.getElementById('musicPlay');
    const stopBtn = document.getElementById('musicStop');
    if (playBtn && stopBtn) {
        playBtn.addEventListener('click', () => toggleMusic());
        stopBtn.addEventListener('click', () => toggleMusic());
    }
    
    // 設置默認語言
    switchLanguage('zh');
    
    // 添加滾動動畫
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in').forEach((element) => {
        observer.observe(element);
    });
}); 