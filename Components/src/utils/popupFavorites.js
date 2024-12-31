document.querySelector('#favorites-btn').addEventListener('click', () => {
    const favoritesPopup = document.querySelector('#popupFavorites');
    const favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

    const popupContent = document.querySelector('.popup-favorites__content');
    popupContent.innerHTML = '';  // Limpiar el contenido del popup antes de agregar las películas

    favoriteMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        popupContent.appendChild(movieCard);  // Agregar cada película a la lista del popup
    });

    favoritesPopup.style.display = 'flex';
});
