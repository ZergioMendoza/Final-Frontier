


const API_KEY = 'd9d127a2dda5d58c217e03b821f796bc'; // Tu API Key de TMDb
const API_URL = 'https://api.themoviedb.org/3/';

// Función para buscar películas en la API
async function fetchMovies(query) {
    const API_KEY = 'd9d127a2dda5d58c217e03b821f796bc';
    const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=es`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results;
        } else {
            console.error('Error en la búsqueda:', data.status_message);
            return [];
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return [];
    }
}

// Función para obtener detalles completos de una película
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=es`);
        const data = await response.json();
        return data; // Devuelve la información detallada de la película
    } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
        return {};
    }
}

export { fetchMovies, fetchMovieDetails };
