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
        loadFavorites(); // Cargar favoritos antes de mostrar el popup
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

        // Verificar si la película ya está en favoritos
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(fav => fav.id === movie.id);

        const saveButton = `
            <button class="movie-card__save ${isFavorite ? 'saved' : ''}" aria-label="Guardar película">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
        `;

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-card__image">
            <h3 class="movie-card__title">${movie.title}</h3>
            <p class="movie-card__year">Año: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
            <p class="movie-card__description">Descripción: ${movie.overview || 'Descripción no disponible'}</p>
            ${saveButton}
        `;

        const saveBtn = card.querySelector('.movie-card__save');
        saveBtn.addEventListener('click', () => {
            toggleFavorite(movie, saveBtn);
        });

        return card;
    }

    // Función para guardar/quitar de favoritos
    function toggleFavorite(movie, button) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(fav => fav.id === movie.id);

        if (isFavorite) {
            // Eliminar de favoritos
            favorites = favorites.filter(fav => fav.id !== movie.id);
            button.classList.remove('saved'); // Cambia el color del botón
        } else {
            // Agregar a favoritos
            favorites.push(movie);
            button.classList.add('saved'); // Cambia el color del botón
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Cargar favoritos en el popup
    function loadFavorites() {
        const favoritesPopupContent = document.querySelector('.popup-favorites__movies');
        const favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesPopupContent.innerHTML = '';

        if (favoriteMovies.length === 0) {
            favoritesPopupContent.innerHTML = '<p>No tienes películas favoritas guardadas.</p>';
        } else {
            favoriteMovies.forEach(movie => {
                const card = document.createElement('div');
                card.classList.add('favorite-movie-card');
                card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="favorite-movie-card__image">
                    <h4 class="favorite-movie-card__title">${movie.title}</h4>
                    <button class="remove-favorite" data-id="${movie.id}">Eliminar</button>
                `;

                const removeBtn = card.querySelector('.remove-favorite');
                removeBtn.addEventListener('click', () => {
                    removeFromFavorites(movie.id);
                    loadFavorites();
                });

                favoritesPopupContent.appendChild(card);
            });
        }
    }

    function removeFromFavorites(movieId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(movie => movie.id !== movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
});
