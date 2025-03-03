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

// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function showSlide(n) {
    // Remove active class from current slide
    const currentActiveSlide = document.querySelector('.slide.active');
    if (currentActiveSlide) {
        currentActiveSlide.classList.remove('active');
        // Wait for the fade out transition
        setTimeout(() => {
            currentActiveSlide.style.display = 'none';
        }, 800);
    }

    // Calculate the new slide index
    currentSlide = (n + slides.length) % slides.length;
    
    // Show and activate the new slide
    setTimeout(() => {
        slides[currentSlide].style.display = 'block';
        // Force a reflow
        slides[currentSlide].offsetHeight;
        slides[currentSlide].classList.add('active');
    }, 50);
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
}

// Auto advance slides every 5 seconds
let slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);

// Pause auto-advance when user interacts with controls
[prevBtn, nextBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        btn.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
        });
    }
});

// 語言切換功能
function toggleLanguage() {
    const enElements = document.querySelectorAll('.en');
    const zhElements = document.querySelectorAll('.zh');
    const langTexts = document.querySelectorAll('.lang-text');
    
    // 檢查當前是否為英文
    const isCurrentlyEnglish = langTexts[1].classList.contains('active');
    
    // 切換語言文字的顯示
    langTexts.forEach(text => text.classList.toggle('active'));
    
    // 切換內容的顯示
    if (isCurrentlyEnglish) {
        // 切換到中文
        enElements.forEach(el => el.style.display = 'none');
        zhElements.forEach(el => el.style.display = 'inline-block');
    } else {
        // 切換到英文
        zhElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = 'inline-block');
    }
}

// 音樂控制
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (!music || !musicBtn) return;
    
    if (music.paused) {
        music.play().then(() => {
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '♪';
        }).catch(error => {
            console.log("Play failed:", error);
            musicBtn.classList.remove('playing');
        });
    } else {
        music.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '♪';
    }
}

function updateMusicButtonStyle(isPlaying) {
    const musicBtn = document.getElementById('musicToggle');
    if (!musicBtn) return;
    
    if (isPlaying) {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '♪';
    } else {
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '♪';
    }
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化幻燈片
    showSlide(currentSlide);
    
    // 初始化音樂
    initMusic();
    
    // 為音樂按鈕添加點擊事件
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
    
    // 設置默認語言
    toggleLanguage();
    
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