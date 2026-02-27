let secret = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let low = 1, high = 100;
let done = false;

// Generate floating background numbers
function spawnBgNumbers() {
  const container = document.getElementById('bgNumbers');
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'float-num';
    el.textContent = Math.floor(Math.random() * 100) + 1;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 2 + 1) + 'rem';
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * -20;
    el.style.animation = `floatUp ${duration}s ${delay}s linear infinite`;
    container.appendChild(el);
  }
}

spawnBgNumbers();

function updateRangeBar() {
  const pct = ((high - low) / 99) * 100;
  document.getElementById('rangeFill').style.width = pct + '%';
  document.getElementById('lowLabel').textContent = low;
  document.getElementById('highLabel').textContent = high;
}

function showMessage(text, type, arrow) {
  const msgText = document.getElementById('message');
  const msgArrow = document.getElementById('msgArrow');

  // Reset animations by removing classes
  msgText.className = 'Message';
  msgArrow.className = 'msg-arrow';
  msgText.textContent = text;
  msgArrow.textContent = arrow;

  void msgText.offsetWidth; // force reflow

  msgText.classList.add('show', type);
  if (type === 'too-low')  msgArrow.classList.add('show-low');
  if (type === 'too-high') msgArrow.classList.add('show-high');
  if (type === 'correct')  msgArrow.classList.add('show-correct');
}

function spawnParticles() {
  const colors = ['#00ff88', '#00d4ff', '#ffa502', '#ff6b35'];
  const card = document.getElementById('card');
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / 30;
    const dist = Math.random() * 200 + 80;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.width = p.style.height = (Math.random() * 8 + 4) + 'px';
    p.style.animationDuration = (Math.random() * 0.5 + 0.7) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
}

function checkGuess() {
  if (done) return;

  const input = document.getElementById('guessInput');
  const val = parseInt(input.value);
  const card = document.getElementById('card');

  if (isNaN(val) || val < 1 || val > 100) {
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    return;
  }

  attempts++;
  document.getElementById('attempts').textContent = attempts;

  if (val < secret) {
    low = Math.max(low, val + 1);
    updateRangeBar();
    showMessage('📈 TOO LOW! GO HIGHER', 'too-low', '▲');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  } else if (val > secret) {
    high = Math.min(high, val - 1);
    updateRangeBar();
    showMessage('📉 TOO HIGH! GO LOWER', 'too-high', '▼');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  } else {
    done = true;
    showMessage(`🎉 CORRECT! The number was ${secret}!`, 'correct', '★');
    card.classList.add('correct');
    spawnParticles();
    setTimeout(spawnParticles, 400);
  }
}

function restartGame() {
  secret = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  low = 1;
  high = 100;
  done = false;

  document.getElementById('guessInput').value = '';
  document.getElementById('attempts').textContent = '0';
  document.getElementById('message').className = 'Message';
  document.getElementById('message').textContent = '';
  document.getElementById('msgArrow').className = 'msg-arrow';
  document.getElementById('msgArrow').textContent = '';
  document.getElementById('card').classList.remove('correct');
  updateRangeBar();
}

// Allow pressing Enter to guess
document.getElementById('guessInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') checkGuess();
});

updateRangeBar();