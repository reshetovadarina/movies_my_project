import './events.js';
import { initMovies } from './state.js';
import { renderMovie } from './render.js';

const movieList = document.getElementById('movie-list');

if (movieList) movieList.textContent = "Завантаження...";

initMovies().then(() => {
    renderMovie();
});
