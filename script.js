const movingBox = document.getElementById('movingBox');
const closeButton = document.getElementById('closeButton');
const playButton = document.getElementById('playButton');
const randomImage = document.getElementById('randomImage');
const backgroundMusic = document.getElementById('backgroundMusic');

// Garante que a imagem seja carregada
randomImage.addEventListener('error', function() {
    console.error('Erro ao carregar o GIF. Verifique se o arquivo existe e o nome está correto.');
});

// Força o carregamento da imagem
if (!randomImage.src || randomImage.src === window.location.href) {
    randomImage.src = 'paredao.gif';
}

// Variáveis para controlar o movimento
let currentX = (window.innerWidth - 300) / 2;
let currentY = (window.innerHeight - 300) / 2;
let velocityX = (Math.random() - 0.5) * 40;
let velocityY = (Math.random() - 0.5) * 40;
let isPlaying = false;

// Atualiza a posição da caixa
function updatePosition() {
    if (!isPlaying) return;
    
    // Atualiza a posição
    currentX += velocityX;
    currentY += velocityY;
    
    // Verifica colisões com as bordas
    if (currentX <= 0 || currentX >= window.innerWidth - 300) {
        velocityX = -velocityX;
        currentX = Math.max(0, Math.min(currentX, window.innerWidth - 300));
    }
    
    if (currentY <= 0 || currentY >= window.innerHeight - 300) {
        velocityY = -velocityY;
        currentY = Math.max(0, Math.min(currentY, window.innerHeight - 300));
    }
    
    // Aplica a posição
    movingBox.style.left = currentX + 'px';
    movingBox.style.top = currentY + 'px';
    
    // Ocasionalmente muda a direção para tornar mais imprevisível
    if (Math.random() < 0.03) {
        velocityX = (Math.random() - 0.5) * 40;
        velocityY = (Math.random() - 0.5) * 40;
    }
}

// Anima o movimento
function animate() {
    updatePosition();
    requestAnimationFrame(animate);
}

// Inicia a animação (mas não se move até isPlaying ser true)
animate();

// Botão de fechar não faz nada (como solicitado)
closeButton.addEventListener('click', function(e) {
    e.stopPropagation();
    // Não faz nada - o botão não fecha a caixa
});

// Configura o áudio
backgroundMusic.volume = 1.0;
backgroundMusic.loop = true;

// Função para iniciar tudo (música e movimento)
function startPlayback() {
    if (isPlaying) return;
    
    isPlaying = true;
    
    // Calcula a posição inicial baseada no centro atual
    currentX = (window.innerWidth - 300) / 2;
    currentY = (window.innerHeight - 300) / 2;
    
    // Remove o transform de centralização e aplica posição absoluta
    movingBox.style.transform = 'none';
    movingBox.style.left = currentX + 'px';
    movingBox.style.top = currentY + 'px';
    
    // Inicia a música
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(function() {
            // Esconde o botão de play
            playButton.style.display = 'none';
        }).catch(function(error) {
            console.log('Erro ao tocar música:', error);
        });
    }
}

// Event listener para o botão de play
playButton.addEventListener('click', function(e) {
    e.stopPropagation();
    startPlayback();
});

// Ajusta a posição quando a janela é redimensionada
window.addEventListener('resize', function() {
    if (!isPlaying) {
        // Se não está tocando, mantém centralizado
        currentX = (window.innerWidth - 300) / 2;
        currentY = (window.innerHeight - 300) / 2;
        movingBox.style.left = currentX + 'px';
        movingBox.style.top = currentY + 'px';
        movingBox.style.transform = 'translate(-50%, -50%)';
    } else {
        // Se está tocando, ajusta normalmente
        currentX = Math.min(currentX, window.innerWidth - 300);
        currentY = Math.min(currentY, window.innerHeight - 300);
        movingBox.style.left = currentX + 'px';
        movingBox.style.top = currentY + 'px';
        movingBox.style.transform = 'none';
    }
});

