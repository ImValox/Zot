document.addEventListener('DOMContentLoaded', function() {
    const playerSection = document.getElementById('player-section');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const playerInput = document.querySelector('.player-input');
    const playBtn = document.getElementById('play-btn');
    
    let players = [];
    
    renderPlayers();
    
    addPlayerBtn.addEventListener('click', function() {
        const inputField = addPlayerBtn.querySelector('.player-input');
        const playerName = inputField.value.trim();
        
        if (playerName) {
            addPlayer(playerName);
            inputField.value = '';
        }
    });
    
    playerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const playerName = this.value.trim();
            if (playerName) {
                addPlayer(playerName);
                this.value = '';
            }
        }
    });
    
    function addPlayer(name) {
        players.push(name);
        renderPlayers();
    }
    
    function removePlayer(index) {
        players.splice(index, 1);
        renderPlayers();
    }
    
    function renderPlayers() {
        const existingButtons = playerSection.querySelectorAll('.player-btn');
        existingButtons.forEach(button => {
            if (!button.classList.contains('add-player-btn')) {
                button.remove();
            }
        });
        
        players.forEach((player, index) => {
            const playerBtn = document.createElement('button');
            playerBtn.className = 'player-btn';
            playerBtn.innerHTML = `
                <span class="front">
                    ${player}
                    <div class="remove-icon">-</div>
                </span>
            `;
            
            const removeIcon = playerBtn.querySelector('.remove-icon');
            removeIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                removePlayer(index);
            });
            
            playerSection.appendChild(playerBtn);
        });
        
        playerSection.insertBefore(addPlayerBtn, playerSection.firstChild);
    }
    
    document.getElementById('back-to-main').addEventListener('click', function() {
        transitionToScreen('main-container', 'game-mode-screen', true);
    });

    document.getElementById('back-to-modes-jn').addEventListener('click', function() {
        transitionToScreen('game-mode-screen', 'jamais-screen', true);
    });

    document.getElementById('back-to-modes-av').addEventListener('click', function() {
        transitionToScreen('game-mode-screen', 'action-verite-screen', true);
    });

    const jamaisQuestions = [
        { question: "été à une soirée à thème", toz: 1 },
        { question: "voyagé hors de France", toz: 2 },
        { question: "fait un tatouage", toz: 3 },
    ];
    
    const actionQuestions = [
        { question: "Imite un animal de ton choix pendant 30 secondes", toz: 1 },
        { question: "Prends une photo embarrassante et montre-la au groupe", toz: 2 },
        { question: "Fais 10 pompes", toz: 3 },
    ];
    
    const veriteQuestions = [
        { question: "Quelle est la chose la plus embarrassante que tu aies faite en public?", toz: 1 },
        { question: "Quel est ton plus grand regret?", toz: 2 },
        { question: "As-tu déjà menti à quelqu'un dans cette pièce?", toz: 3 },
    ];
    
    let currentPlayerIndex = 0;
    let currentMode = '';
    let usedQuestions = {
        jn: [],
        av: []
    };
    
    renderPlayers();
    
    playBtn.addEventListener('click', function() {
        setTimeout(function() {
            if (players.length < 2) {
                alert("Veuillez ajouter au moins deux joueur pour commencer!");
                return;
            }
        
            localStorage.setItem('zotPlayers', JSON.stringify(players));
            
            transitionToScreen('game-mode-screen', 'main-container');
        }, 100);
    });
    
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            currentMode = mode;
            
            if (mode === 'action-verite') {
                transitionToScreen('action-verite-screen', 'game-mode-screen');
                initializeGameScreen('av');
            } else if (mode === 'jamais') {
                transitionToScreen('jamais-screen', 'game-mode-screen');
                initializeGameScreen('jn');
                displayRandomQuestion('jn', jamaisQuestions);
            } else if (mode === 'tu-preferes') {
                alert("Mode 'Tu préfères' à implémenter");
                document.getElementById('game-mode-screen').style.display = 'flex';
            } else if (mode === 'sept-secondes') {
                alert("Mode '7 Secondes' à implémenter");
                document.getElementById('game-mode-screen').style.display = 'flex';
            }
        });
    });
    
    function initializeGameScreen(prefix) {
        players = JSON.parse(localStorage.getItem('zotPlayers') || '[]');
        currentPlayerIndex = 0;
        
        document.getElementById(`${prefix}-current-player`).textContent = players[currentPlayerIndex] || 'Joueur 1';
    }
    
    function nextPlayer(prefix) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        document.getElementById(`${prefix}-current-player`).textContent = players[currentPlayerIndex];
    }
    
    function displayRandomQuestion(prefix, questions) {
        if (usedQuestions[prefix].length === questions.length) {
            alert("Toutes les questions ont été posées !");
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
        } while (usedQuestions[prefix].includes(randomIndex));

        const question = questions[randomIndex];
        usedQuestions[prefix].push(randomIndex);
        
        if (prefix === 'jn') {
            document.getElementById('jn-question').textContent = question.question;
            document.getElementById('jn-toz-count').textContent = `${question.toz} toz`;
        } else if (prefix === 'av') {
            document.getElementById('av-question').textContent = question.question;
            document.getElementById('av-question').style.display = 'block';
            document.getElementById('av-toz-count').textContent = `${question.toz} toz`;
        }
    }
    
    document.getElementById('jn-next-question').addEventListener('click', function() {
        nextPlayer('jn');
        displayRandomQuestion('jn', jamaisQuestions);
    });
    
    document.getElementById('av-refused').addEventListener('click', function() {
        alert(`Boire ${document.getElementById('av-toz-count').textContent}`);
    });
    
    document.getElementById('av-done').addEventListener('click', function() {
        nextPlayer('av');
        displayRandomQuestion('av', actionQuestions.concat(veriteQuestions));
    });

    function transitionToScreen(showId, hideId, reverse = false) {
        const showElement = document.getElementById(showId);
        const hideElement = document.getElementById(hideId);

        

        if (reverse) {
            showElement.style.transform = 'translateX(-100%)';
        } else {
            showElement.style.transform = 'translateX(100%)';
        }
        showElement.style.display = 'flex';

        setTimeout(() => {
            showElement.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            hideElement.style.display = 'none';
        }, 500);
    }
});