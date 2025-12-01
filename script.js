let allData = [];

// 文案配置
const texts = {
    'pure': { 
        t: 'Innocence', 
        d: '“最是那一低头的温柔，像一朵水莲花不胜凉风的娇羞。” \n —— 徐志摩\n(The gentleness of a lowered head, like a water lily shy of the cool breeze.)' 
    },
    'sexy': { 
        t: 'Instinct', 
        d: '“美是被渴望的暴风雨，是藏在身体里的野火。” \n (Beauty is a storm of desire, a wildfire within.)' 
    },
    'inner': { 
        t: 'Intimacy', 
        d: '“在无人的角落，身体才开始真正地呼吸。” \n (In the corner of solitude, the body truly breathes.)' 
    },
    'maternity': { 
        t: 'Bloom', 
        d: '“生命本身就是一场盛大的花期，此刻即是永恒。” \n (Life itself is a grand blooming; this moment is eternity.)' 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => { allData = data; })
        .catch(err => console.error("Data load failed:", err));
});

// --- 音乐控制逻辑 ---
const musicPlayer = document.getElementById('bgm-player');
const musicBtn = document.getElementById('music-toggle');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        musicPlayer.pause();
        musicBtn.classList.remove('music-playing');
    } else {
        musicPlayer.play().catch(e => console.log("需交互才能播放"));
        musicBtn.classList.add('music-playing');
    }
    isPlaying = !isPlaying;
}

function tryPlayMusic() {
    if (!isPlaying) {
        musicPlayer.volume = 0.5;
        musicPlayer.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('music-playing');
        }).catch(() => {}); 
    }
}

// 点击页面任意处尝试播放音乐（隐形开关）
document.body.addEventListener('click', function() {
    tryPlayMusic();
}, { once: true });

// --- 进入画廊 ---
function enterGallery(category) {
    tryPlayMusic(); 

    if(!allData.length) {
        setTimeout(() => enterGallery(category), 200);
        return;
    }

    // 切换界面
    document.getElementById('cover-section').style.display = 'none';
    const gallerySection = document.getElementById('gallery-section');
    gallerySection.style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('sticky-nav').classList.add('visible');
    }, 100);

    window.scrollTo(0, 0);

    // 更新文案
    document.getElementById('gallery-title').innerText = texts[category].t;
    document.getElementById('gallery-desc').innerText = texts[category].d;

    // 筛选数据
    const filteredData = allData.filter(item => item.category === category);

    // 🔥【关键修改在这里】🔥
    // shuffle 打乱顺序，然后 .slice(0, 50) 只取前 50 张
    // 如果你想显示更多，把 50 改成 100，或者直接删掉 .slice(0, 50) 以显示全部
    renderImages(shuffle(filteredData).slice(0, 50));
}

// --- 返回主页 ---
function goHome() {
    document.getElementById('gallery-section').style.display = 'none';
    document.getElementById('cover-section').style.display = 'block';
    document.getElementById('sticky-nav').classList.remove('visible');
    
    // 清空内容，释放内存
    document.getElementById('gallery-grid').innerHTML = '';
}

// --- 渲染图片 ---
function renderImages(items) {
    const container = document.getElementById('gallery-grid');
    container.innerHTML = ''; 

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555; margin-top:50px;">暂无图片 / No Images</p>';
        document.getElementById('loading-text').style.display = 'none';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = item.src;
        img.loading = 'lazy';
        
        img.onload = () => img.classList.add('loaded');
        
        div.appendChild(img);
        div.onclick = () => showLightbox(item.src);
        container.appendChild(div);
    });

    document.getElementById('loading-text').style.display = 'none';
}

// 辅助函数
function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// 灯箱逻辑
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

function showLightbox(src) { lightbox.style.display = 'flex'; lbImg.src = src; }
closeBtn.onclick = () => lightbox.style.display = 'none';
lightbox.onclick = (e) => { if(e.target !== lbImg) lightbox.style.display = 'none'; }

// 暴露全局
window.enterGallery = enterGallery;
window.goHome = goHome;
window.scrollToTop = scrollToTop;
window.toggleMusic = toggleMusic;