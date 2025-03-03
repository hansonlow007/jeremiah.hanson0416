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
        music.play();
        updateMusicButtonStyle(true);
    } else {
        music.pause();
        updateMusicButtonStyle(false);
    }
}

function updateMusicButtonStyle(isPlaying) {
    const musicBtn = document.getElementById('musicToggle');
    if (!musicBtn) return;
    
    if (isPlaying) {
        musicBtn.style.backgroundColor = 'rgba(199, 96, 88, 0.9)';
        musicBtn.innerHTML = '♪';
    } else {
        musicBtn.style.backgroundColor = 'rgba(217, 118, 109, 0.8)';
        musicBtn.innerHTML = '♪';
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