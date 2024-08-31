document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const backBtn = document.getElementById('backBtn');
    const homepage = document.getElementById('homepage');
    const search = document.getElementById('search');

    // Funzione per caricare i bot memorizzati nel client (LocalStorage)
    function loadBotsFromLocalStorage() {
        let storedBots = JSON.parse(localStorage.getItem('addedBots')) || [];
        storedBots.forEach(bot => {
            addBotToHomepage(bot);
        });
    }

    // Funzione per salvare i bot nel client (LocalStorage)
    function saveBotToLocalStorage(bot) {
        let storedBots = JSON.parse(localStorage.getItem('addedBots')) || [];
        storedBots.push(bot);
        localStorage.setItem('addedBots', JSON.stringify(storedBots));
    }

    // Funzione per salvare i bot nel server (opzionale, solo se usi la soluzione lato server)
    function saveBotToServer(bot) {
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bot_id=${bot.id}&user_id=USER_ID_HERE`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Bot salvato con successo');
            }
        })
        .catch(error => {
            console.error('Errore nel salvataggio del bot:', error);
        });
    }

    // Funzione per caricare i bot dell'utente dal server (opzionale, solo se usi la soluzione lato server)
    function loadBotsFromServer() {
        fetch('api.php?user_id=USER_ID_HERE')
            .then(response => response.json())
            .then(bots => {
                bots.forEach(bot => {
                    addBotToHomepage(bot);
                });
            })
            .catch(error => {
                console.error('Errore nel caricamento dei bot:', error);
            });
    }

    // Aggiungi il bot alla homepage e salva (in LocalStorage o nel server)
    function addBotToHomepage(bot) {
        const appGrid = document.querySelector('.app-grid');
        const newSlot = document.createElement('div');
        newSlot.className = 'app-slot';
        newSlot.dataset.url = bot.url;
        newSlot.innerHTML = `<img src="${bot.img_url}" alt="${bot.name}">`;

        appGrid.appendChild(newSlot);

        // Salva il bot in LocalStorage
        saveBotToLocalStorage(bot);

        // Salva il bot nel server (opzionale, solo se usi la soluzione lato server)
        saveBotToServer(bot);
    }

    // Carica i bot memorizzati all'avvio
    loadBotsFromLocalStorage();  // Per LocalStorage
    // loadBotsFromServer();      // Per il server (scommenta se usi la soluzione lato server)

    searchBtn.addEventListener('click', () => {
        homepage.classList.remove('active');
        search.classList.add('active');
    });

    backBtn.addEventListener('click', () => {
        search.classList.remove('active');
        homepage.classList.add('active');
    });

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        if (query.length > 0) {
            fetch(`api.php?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(bots => {
                    searchResults.innerHTML = '';

                    bots.forEach(bot => {
                        const botDiv = document.createElement('div');
                        botDiv.innerHTML = `
                            <img src="${bot.img_url}" alt="${bot.name}" style="width: 40px; height: 40px;">
                            <span>${bot.name}</span>
                            <button data-url="${bot.url}">Add</button>
                        `;
                        searchResults.appendChild(botDiv);

                        botDiv.querySelector('button').addEventListener('click', () => {
                            addBotToHomepage(bot);
                        });
                    });
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        } else {
            searchResults.innerHTML = '';
        }
    });

    document.querySelector('.app-grid').addEventListener('click', event => {
        const slot = event.target.closest('.app-slot');
        if (slot) {
            window.open(slot.dataset.url, '_blank');
        }
    });
});

