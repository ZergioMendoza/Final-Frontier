// const API_KEY = 'b3caae4b';
// const API_URL = `https://www.omdbapi.com/?s=${query}&apikey=b3caae4b`;



document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario ha iniciado sesión
    const storedEmail = localStorage.getItem('email');
    const favoritesButton = document.querySelector('#favorites-btn');
    const popup = document.getElementById('popupFavorites');
    const closeButton = document.querySelector('.popup-favorites__close');
    const logoutButton = document.querySelector('.header__logout');
    const searchForm = document.querySelector('#search-form');
    const searchInput = document.querySelector('.search__input');
    const moviesGrid = document.querySelector('.movies__grid');
    const welcomeMessageContainer = document.querySelector('.welcome-message');

    logoutButton.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    if (!storedEmail) {
        alert('Debes iniciar sesión primero.');
        window.location.href = 'login.html';
    } else {
        const welcomeMessage = document.createElement('h2');
        welcomeMessage.textContent = `¡Bienvenido, ${storedEmail}!`;
        welcomeMessageContainer.appendChild(welcomeMessage);
    }

    // Popup functionality
    favoritesButton.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popup.style.display = 'none';
        }
    });

    // Funcionalidad de búsqueda
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();
        console.log('Búsqueda realizada:', query);

        if (query) {
            moviesGrid.innerHTML = '<p>Cargando resultados...</p>';

            try {
                const movies = await fetchMovies(query);

                if (movies.length > 0) {
                    moviesGrid.innerHTML = '';
                    movies.forEach(movie => {
                        const movieCard = createMovieCard(movie);
                        moviesGrid.appendChild(movieCard);
                    });
                } else {
                    moviesGrid.innerHTML = '<p>No se encontraron películas.</p>';
                }
            } catch (error) {
                console.error('Error al buscar películas:', error);
                moviesGrid.innerHTML = '<p>Error al cargar los resultados. Intenta nuevamente.</p>';
            }
        }
    });

    // Función para buscar películas en la API
    async function fetchMovies(query) {
        const API_KEY = 'd9d127a2dda5d58c217e03b821f796bc'; // Tu API Key de TMDb
        const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.results) {
                return data.results; // Devuelve los resultados de la búsqueda
            } else {
                console.error('Error en la API:', data.status_message);
                return [];
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            throw error;
        }
    }

    // Función para crear la tarjeta de película
    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.classList.add('movie-card');
    
        // Comprobar si la descripción está presente
        let plot = movie.overview || 'Descripción no disponible';
        let rating = movie.vote_average ? movie.vote_average : 'Sin calificación';
    
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-card__image">
            <h3 class="movie-card__title">${movie.title}</h3>
            <p class="movie-card__year">Año: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
            <p class="movie-card__description">Descripción: ${plot}</p>
            <p class="movie-card__rating">Calificación: ${rating}</p>
        `;
    
        return card;
    }
    
});
