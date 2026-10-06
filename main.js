const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeModalBtn = document.getElementById('closeModalBtn');
const playerIdInput = document.getElementById('playerId');

const prizes = [
  { id: 1, name: '100 Diamantes', minDeg: 0, maxDeg: 45 },
  { id: 8, name: '2000 Diamantes', minDeg: 45, maxDeg: 90 }, 
  { id: 7, name: 'Bono Recarga Nequi', minDeg: 90, maxDeg: 135 },
  { id: 6, name: 'Skin de Personaje', minDeg: 135, maxDeg: 180 },
  { id: 5, name: '300 Diamantes', minDeg: 180, maxDeg: 225 },
  { id: 4, name: 'Nada', minDeg: 225, maxDeg: 270 },
  { id: 3, name: 'Premio Especial Nequi', minDeg: 270, maxDeg: 315 },
  { id: 2, name: 'Pase Élite', minDeg: 315, maxDeg: 360 }
];

let currentRotation = 0;
let isSpinning = false;
let countdownInterval;

function checkSpinAvailability() {
  const lastSpinTime = localStorage.getItem('lastSpinTime');
  if (lastSpinTime) {
    const timePassed = Date.now() - parseInt(lastSpinTime, 10);
    const timeToWait = 24 * 60 * 60 * 1000; // 24 horas
    
    if (timePassed < timeToWait) {
      spinBtn.disabled = true;
      spinBtn.style.opacity = '0.6';
      spinBtn.style.cursor = 'not-allowed';
      
      clearInterval(countdownInterval);
      
      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = timeToWait - (now - parseInt(lastSpinTime, 10));
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          spinBtn.disabled = false;
          spinBtn.style.opacity = '1';
          spinBtn.style.cursor = 'pointer';
          spinBtn.innerText = "GIRAR LA RULETA";
          localStorage.removeItem('lastSpinTime');
        } else {
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          
          spinBtn.innerText = `VUELVE EN ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      };
      
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
      return false;
    }
  }
  return true;
}

// Check on load
checkSpinAvailability();

// Truco oculto para pruebas: Haz clic en el logo para resetear el contador de 24h
document.querySelector('.logo-text').addEventListener('click', () => {
  localStorage.removeItem('lastSpinTime');
  location.reload();
});

// If they click the hero button, smoothly scroll to roulette
document.querySelector('.btn-primary').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#ruleta').scrollIntoView({ behavior: 'smooth' });
});

spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  if (!checkSpinAvailability()) return;
  
  isSpinning = true;
  spinBtn.disabled = true;
  spinBtn.innerText = "GIRANDO...";

  const extraDegrees = Math.floor(Math.random() * 360);
  const totalSpins = (Math.floor(Math.random() * 5) + 5) * 360; 
  const finalRotation = currentRotation + totalSpins + extraDegrees;

  wheel.style.transform = `rotate(${finalRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    localStorage.setItem('lastSpinTime', Date.now().toString());
    checkSpinAvailability();
    
    currentRotation = finalRotation;

    const normalizedRotation = finalRotation % 360;
    const pointerDegrees = (360 - normalizedRotation) % 360;

    const winningPrize = prizes.find(p => pointerDegrees >= p.minDeg && pointerDegrees < p.maxDeg);

    if(winningPrize) {
      if(winningPrize.name === 'Nada') {
        resultText.innerHTML = `Suerte para la próxima...<br>No has ganado nada hoy.`;
        playerIdInput.style.display = 'none';
        closeModalBtn.innerText = "CERRAR";
      } else {
        resultText.innerHTML = `¡Has ganado <span style="color: #facc15; font-size: 1.5rem;">${winningPrize.name}</span>!`;
        playerIdInput.style.display = 'block';
        playerIdInput.value = ''; // clear previous
        closeModalBtn.innerText = "RECLAMAR PREMIO";
      }
    }
    
    resultModal.classList.remove('hidden');

  }, 5000);
});

closeModalBtn.addEventListener('click', () => {
  if(playerIdInput.style.display !== 'none' && playerIdInput.value.trim() === '') {
    alert("Por favor ingresa tu ID de jugador para reclamar tu premio.");
    return;
  }

  if (playerIdInput.style.display !== 'none') {
    // Redirigir al formulario de Google Drive
    window.location.href = "https://docs.google.com/forms/d/1OVbTsRHgMghkOALd5ONMUWsi5SMj4pwQMPb2UGHlKPQ/viewform";
  } else {
    resultModal.classList.add('hidden');
  }
});

// "More Spins" functionality
const moreSpinsBtn = document.getElementById('moreSpinsBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');

moreSpinsBtn.addEventListener('click', () => {
  infoModal.classList.remove('hidden');
});

closeInfoModalBtn.addEventListener('click', () => {
  infoModal.classList.add('hidden');
});
