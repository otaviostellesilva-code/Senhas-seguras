const input = document.getElementById('passwordInput');
const toggleBtn = document.getElementById('toggleVisibility');
const eyeIcon = document.getElementById('eyeIcon');
const strengthBar = document.getElementById('strengthBar');
const strengthValue = document.getElementById('strengthValue');
const metricCharset = document.getElementById('metricCharset');
const metricSpace = document.getElementById('metricSpace');
const metricEntropy = document.getElementById('metricEntropy');
const metricCrack = document.getElementById('metricCrack');
const patternList = document.getElementById('patternList');
const noIssues = document.getElementById('noIssues');

const WEAK = ['senha','password','123456','12345678','qwerty','abc123','admin','iloveyou','brasil','flamengo'];
const GUESSES_PER_SEC = 1e11;

function detectCharset(pw) {
    let n = 0;
    if (/[a-z]/.test(pw)) n += 26;
    if (/[A-Z]/.test(pw)) n += 26;
    if (/[0-9]/.test(pw)) n += 10;
    if (/[^A-Za-z0-9]/.test(pw)) n += 33;
    return n;
}

function formatBig(num) {
    if (num === 0) return '0';
    if (num < 1e6) return Math.round(num).toLocaleString('pt-BR');
    const exp = Math.floor(Math.log10(num));
    const mant = num / Math.pow(10, exp);
    return mant.toFixed(1) + ' × 10^' + exp;
}

function formatTime(seconds) {
    if (!isFinite(seconds)) return 'praticamente infinito';
    if (seconds < 1) return 'instantâneo';
    const units = [
        ['ano', 31557600], ['dia', 86400], ['hora', 3600],
        ['minuto', 60], ['segundo', 1]
    ];
    if (seconds > 31557600 * 1e6) {
        const millions = seconds / (31557600 * 1e6);
        return formatBig(millions) + ' milhões de anos';
    }
    for (const [name, secs] of units) {
        if (seconds >= secs) {
            const val = Math.floor(seconds / secs);
            const plural = val > 1 ? (name === 'mês' ? 'meses' : name + 's') : name;
            return val.toLocaleString('pt-BR') + ' ' + plural;
        }
    }
    return 'instantâneo';
}

function findPatterns(pw) {
    const issues = [];
    const lower = pw.toLowerCase();
    if (WEAK.some(w => lower.includes(w))) {
        issues.push('Contém uma palavra comum de dicionário — trivial para ataques de dicionário.');
    }
    if (/(.)\1\1/.test(pw)) {
        issues.push('Caractere repetido 3+ vezes seguidas reduz drasticamente a aleatoriedade.');
    }
    if (/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(pw)) {
        issues.push('Sequência previsível detectada (ex.: 123, abc).');
    }
    if (/^[0-9]+$/.test(pw)) {
        issues.push('Apenas números: alfabeto de somente 10 símbolos, muito fácil de quebrar.');
    } else if (/^[a-z]+$/.test(pw)) {
        issues.push('Apenas letras minúsculas: adicione maiúsculas, números e símbolos.');
    }
    if (pw.length < 8) {
        issues.push('Comprimento inferior a 8 caracteres falha em qualquer modelo de segurança.');
    }
    return issues;
}

function strengthFrom(entropy) {
    if (entropy === 0) return { pct: 0, color: '#475569', label: '—' };
    if (entropy < 28) return { pct: 20, color: '#f87171', label: 'Muito fraca' };
    if (entropy < 40) return { pct: 40, color: '#fb923c', label: 'Fraca' };
    if (entropy < 60) return { pct: 60, color: '#facc15', label: 'Razoável' };
    if (entropy < 80) return { pct: 80, color: '#4ade80', label: 'Forte' };
    return { pct: 100, color: '#38bdf8', label: 'Excelente' };
}

function renderPatterns(issues) {
    patternList.innerHTML = '';
    if (issues.length === 0) {
        noIssues.classList.remove('hidden');
        noIssues.textContent = '✓ Nenhum padrão vulnerável detectado!';
        noIssues.style.color = '#4ade80';
        return;
    }
    noIssues.classList.add('hidden');
    const tpl = document.getElementById('pattern-template');
    issues.forEach(msg => {
        const node = tpl.content.cloneNode(true);
        node.querySelector('.pattern-text').textContent = msg;
        patternList.appendChild(node);
    });
    if (window.lucide) lucide.createIcons();
}

function analyze() {
    const pw = input.value;
    if (!pw) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#475569';
        strengthValue.textContent = '—';
        strengthValue.style.color = '#94a3b8';
        metricCharset.textContent = '—';
        metricSpace.textContent = '—';
        metricEntropy.textContent = '—';
        metricCrack.textContent = '—';
        patternList.innerHTML = '';
        noIssues.classList.remove('hidden');
        noIssues.textContent = '— sem análise ainda —';
        noIssues.style.color = '#64748b';
        return;
    }
    const N = detectCharset(pw);
    const L = pw.length;
    const entropy = L * Math.log2(N || 1);
    const combos = Math.pow(N, L);
    const seconds = combos / 2 / GUESSES_PER_SEC;

    metricCharset.textContent = N + ' símbolos';
    metricSpace.textContent = combos === Infinity ? '> 10^300' : formatBig(combos);
    metricEntropy.textContent = entropy.toFixed(1) + ' bits';
    metricCrack.textContent = formatTime(seconds);

    const s = strengthFrom(entropy);
    strengthBar.style.width = s.pct + '%';
    strengthBar.style.backgroundColor = s.color;
    strengthValue.textContent = s.label;
    strengthValue.style.color = s.color;

    renderPatterns(findPatterns(pw));
}

input.addEventListener('input', analyze);

toggleBtn.addEventListener('click', () => {
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    eyeIcon.setAttribute('data-lucide', showing ? 'eye' : 'eye-off');
    if (window.lucide) lucide.createIcons();
});

const genBtn = document.getElementById('generateBtn');
const genOut = document.getElementById('generatedOutput');
const copyBtn = document.getElementById('copyBtn');
const copyFeedback = document.getElementById('copyFeedback');
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}';

function generate() {
    const len = 20;
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let out = '';
    for (let i = 0; i < len; i++) out += CHARS[arr[i] % CHARS.length];
    genOut.textContent = out;
    copyFeedback.classList.add('hidden');
}
genBtn.addEventListener('click', generate);

copyBtn.addEventListener('click', async () => {
    const text = genOut.textContent;
    if (!text || text.startsWith('•')) return;
    let ok = false;
    try {
        await navigator.clipboard.writeText(text);
        ok = true;
    } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
    }
    copyFeedback.textContent = ok ? '✓ Senha copiada!' : 'Erro ao copiar.';
    copyFeedback.style.color = ok ? '#4ade80' : '#f87171';
    copyFeedback.classList.remove('hidden');
});

// Executa após carregamento do DOM no CodePen para renderizar os ícones
setTimeout(() => {
  if (window.lucide) lucide.createIcons();
}, 200);
