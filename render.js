import { formatMovie } from './helpers.js';
import { getMovies } from './state.js';

const TOAST_DELAY = 2000;
const heading = document.querySelector('h1');
const counter = document.getElementById('counter');
const movieList = document.getElementById('movie-list');
const toast = document.getElementById('toast');

export function updateCounters() {
    const currentMovies = getMovies();
    if (heading) heading.textContent = `Мої улюблені фільми (${currentMovies.length})`;
    if (counter) {
        const watchedCount = currentMovies.filter(m => m.watched).length;
        counter.textContent = `Переглянуто: ${watchedCount} з ${currentMovies.length}`;
    }
}

export function showToast(text = "Фільм додано") {
    if (!toast) return;
    toast.textContent = text;
    setTimeout(() => { toast.textContent = ""; }, TOAST_DELAY);
}

export function createMovieCard(movie) {
    const li = document.createElement('li');
    li.setAttribute('data-id', movie.id);

    if (movie.watched) li.classList.add('watched');

    const textSpan = document.createElement('span');
    textSpan.className = 'movie-title';
    textSpan.textContent = `${formatMovie(movie)} [${movie.genre}] `;
    li.appendChild(textSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'movie-actions';

    const watchBtn = document.createElement('button');
    watchBtn.textContent = "Переглянуто";
    watchBtn.type = "button";
    watchBtn.classList.add('watched-btn');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Видалити";
    deleteBtn.type = "button";
    deleteBtn.classList.add('delete-btn');

    const detailsLink = document.createElement('a');
    detailsLink.textContent = "Детальніше";
    detailsLink.setAttribute('href', '#');
    detailsLink.classList.add('details-link');

    actionsDiv.appendChild(watchBtn);
    actionsDiv.appendChild(deleteBtn);
    actionsDiv.appendChild(detailsLink);

    li.appendChild(actionsDiv);
    return li;
}

export function renderMovie(moviesToRender = getMovies()) {
    if (!movieList) return;
    movieList.replaceChildren();
    updateCounters();

    if (moviesToRender.length === 0) {
        movieList.textContent = "Список порожній, додай перший фільм";
        return;
    }

    moviesToRender.forEach(movie => {
        const card = createMovieCard(movie);
        movieList.appendChild(card);
    });
}
