const input = document.getElementById('password-input');
const rulesContainer = document.getElementById('rules-container');
const charCount = document.getElementById('char-count');
const bgBlobs = document.querySelector('.background-blobs');

const bgMusic = new Audio('vivaldi-vremena-goda-zima.mp3');
bgMusic.loop = true;

const getMoonPhase = () => {
    const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 3) { year--; month += 12; }
    month++;
    const jd = (365.25 * year) + (30.6 * month) + day - 694039.09;
    const phaseIdx = Math.round((jd / 29.5305882 - Math.floor(jd / 29.5305882)) * 8) % 8;
    return phases[phaseIdx];
};

const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
};

const rules = [
    { id: 1, desc: "Минимум 8 символов.", check: (s) => s.length >= 8 },
    { id: 2, desc: "Заглавная буква (A-Z).", check: (s) => /[A-Z]/.test(s) },
    { id: 3, desc: "Добавьте цифру.", check: (s) => /\d/.test(s) },
    { id: 4, desc: "Добавьте спецсимвол (!@#$).", check: (s) => /[!@#$%^&*]/.test(s) },
    { id: 5, desc: "Только ОДИН спонсор: Raid, AroHub или 1xBet.", check: (s) => {
        const val = s.toLowerCase();
        return ['raid', 'arohub', '1xbet'].filter(sp => val.includes(sp)).length === 1;
    }},
    { id: 6, desc: `Текущая фаза луны (${getMoonPhase()}).`, check: (s) => s.includes(getMoonPhase()) },
    { id: 7, desc: "Сумма всех цифр должна быть ровно 50.", check: (s) => (s.match(/\d/g) || []).reduce((a, b) => a + Number(b), 0) === 50 },
    { id: 8, desc: "Пароль должен содержать слово 'пельмени'.", check: (s) => s.toLowerCase().includes('пельмени') },
    { id: 9, desc: "Длина пароля — простое число.", check: (s) => isPrime(s.length) },
    { id: 10, desc: "Добавьте символ тенге (₸).", check: (s) => s.includes('₸') },
    { id: 11, desc: "Добавьте смайлик клоуна 🤡.", check: (s) => s.includes('🤡') },
    { id: 12, desc: "Пароль должен содержать текущий год (2026).", check: (s) => s.includes('2026') },
    { id: 13, desc: "Добавьте 'sudo'.", check: (s) => s.includes('sudo') },
    { id: 14, desc: "Добавьте 'error'.", check: (s) => s.toLowerCase().includes('error') },
    { id: 15, desc: "Добавьте 'admin'.", check: (s) => s.toLowerCase().includes('admin') },
    { id: 16, desc: "Добавьте символ π.", check: (s) => s.includes('π') },
    { id: 17, desc: "Добавьте 666.", check: (s) => s.includes('666') },
    { id: 18, desc: "Добавьте !!!.", check: (s) => s.includes('!!!') },
    { id: 19, desc: "Добавьте 'BTC'.", check: (s) => s.includes('BTC') },
    { id: 20, desc: "Добавьте 'GIGACHAD'.", check: (s) => s.includes('GIGACHAD') },
    { id: 21, desc: "Добавьте 'RTX'.", check: (s) => s.includes('RTX') },
    { id: 22, desc: "Пароль должен содержать HEX-код черного цвета (#000000).", check: (s) => s.includes('#000000') },
    { id: 23, desc: "Добавьте символ бесконечности ∞.", check: (s) => s.includes('∞') },
    { id: 24, desc: "Добавьте три вертикальные черты |||.", check: (s) => (s.match(/\|/g) || []).length === 3 },
    { id: 25, desc: "Добавьте расширение .exe", check: (s) => s.includes('.exe') },
    { id: 26, desc: "Добавьте 'DOGE'.", check: (s) => s.includes('DOGE') },
    { id: 27, desc: "Пароль должен содержать 'qwerty'.", check: (s) => s.toLowerCase().includes('qwerty') },
    { id: 28, desc: "Добавьте символ копирайта ©.", check: (s) => s.includes('©') },
    { id: 29, desc: "Пароль должен содержать '127.0.0.1'.", check: (s) => s.includes('127.0.0.1') },
    { id: 30, desc: "Добавьте 'localhost'.", check: (s) => s.includes('localhost') },
    { id: 31, desc: "Добавьте слово 'Зевс'.", check: (s) => s.includes('Зевс') },
    { id: 32, desc: "Пароль должен содержать 'null'.", check: (s) => s.includes('null') },
    { id: 33, desc: "Добавьте 'undefined'.", check: (s) => s.includes('undefined') },
    { id: 34, desc: "Добавьте символ параграфа §.", check: (s) => s.includes('§') },
    { id: 35, desc: "Пароль должен содержать название планеты: Марс.", check: (s) => s.includes('Марс') },
    { id: 36, desc: "Добавьте 'Unity'.", check: (s) => s.includes('Unity') },
    { id: 37, desc: "Добавьте 'Python'.", check: (s) => s.includes('Python') },
    { id: 38, desc: "Пароль должен содержать '777'.", check: (s) => s.includes('777') },
    { id: 39, desc: "Добавьте 'Steam'.", check: (s) => s.includes('Steam') },
    { id: 40, desc: "ФИНАЛ: Напишите 'Я ГЕНИЙ ПАРОЛЕЙ'.", check: (s) => s.includes('Я ГЕНИЙ ПАРОЛЕЙ') }
];

function fadeInMusic() {
    bgMusic.volume = 0;
    bgMusic.currentTime = 74;
    bgMusic.play().catch(() => {});
    let vol = 0;
    const interval = setInterval(() => {
        if (vol < 1) {
            vol += 0.05;
            bgMusic.volume = Math.min(vol, 1);
        } else {
            clearInterval(interval);
        }
    }, 100);
}

function update() {
    const val = input.value;
    charCount.innerText = val.length;
    rulesContainer.innerHTML = '';
    let completedCount = 0;

    rules.forEach((rule, index) => {
        const prevValid = index === 0 || rules.slice(0, index).every(r => r.check(val));
        if (prevValid) {
            const isValid = rule.check(val);
            if (isValid) completedCount++;
            const ruleEl = document.createElement('div');
            ruleEl.className = `rule-card ${isValid ? 'valid' : ''}`;
            ruleEl.innerHTML = `<strong>Правило ${rule.id}:</strong><br>${rule.desc}`;
            rulesContainer.appendChild(ruleEl);
            if (rule.id === 5) document.querySelectorAll('.sponsor-box').forEach(b => b.style.display = 'block');
        }
    });

    if (completedCount >= 8 && bgMusic.paused) {
        fadeInMusic();
    } else if (completedCount < 8 && !bgMusic.paused) {
        bgMusic.pause();
    }

    const speed = Math.max(0.2, 20 - (completedCount * 0.48));
    bgBlobs.style.setProperty('--speed', `${speed}s`);

    document.querySelectorAll('.sponsor-box').forEach(box => {
        if (val.toLowerCase().includes(box.dataset.sponsor)) box.classList.add('active');
        else box.classList.remove('active');
    });
}

input.addEventListener('input', update);
update();