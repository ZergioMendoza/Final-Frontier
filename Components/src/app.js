import { searchMovies, fetchMovieDetails } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#search-form');
    const movieGrid = document.querySelector('.movies__grid');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = document.querySelector('.search__input').value.trim();

        if (query) {
            movieGrid.innerHTML = 'Cargando...';
            const movies = await searchMovies(query);

            if (movies.length > 0) {
                movieGrid.innerHTML = '';
                for (const movie of movies) {
                    // Obtener detalles completos de la película
                    const movieDetails = await fetchMovieDetails(movie.id);
                    
                    const movieCard = createMovieCard(movieDetails);
                    movieGrid.appendChild(movieCard);
                }
            } else {
                movieGrid.innerHTML = 'No se encontraron resultados.';
            }
        }
    });

    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        const img = document.createElement('img');
        img.classList.add('movie-card__image');
        img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/default-poster.jpg';

        const title = document.createElement('h3');
        title.classList.add('movie-card__title');
        title.textContent = movie.title;

        const year = document.createElement('p');
        year.classList.add('movie-card__year');
        year.textContent = `Año: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}`;

        const description = document.createElement('p');
        description.classList.add('movie-card__description');
        description.textContent = `Descripción: ${movie.overview || 'Descripción no disponible'}`;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(year);
        card.appendChild(description);

        return card;
    }
});

