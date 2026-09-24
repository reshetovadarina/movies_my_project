import defaultMovies from './movies.js';
import { generateId, formatMovie } from './helpers.js';
import { isValidYear, isDuplicateMovie } from './validation.js';

const DELAY_SLOW_FETCH = 2000;
const DELAY_FAST_FETCH = 500;
const DELAY_TOAST = 2000;
const DELAY_DEBOUNCE = 400;
const DEFAULT_FORM_YEAR = "2026";
const START_VALID_YEAR = 1900;


if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

let movies = [];

const heading = document.querySelector('h1');
const movieList = document.getElementById('movie-list');
const movieForm = document.getElementById('movie-form');

const movieInput = document.getElementById('movie-input');
const movieYear = document.getElementById('movie-year');
const movieGenre = document.getElementById('movie-genre');
const movieWatched = document.getElementById('movie-watched');

const titleError = document.getElementById('title-error');
const yearError = document.getElementById('year-error');

const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const themeButton = document.getElementById('theme-button');
const counter = document.getElementById('counter');
const searchResult = document.getElementById('search-result');
const toast = document.getElementById('toast');

function getMoviesSlow() {
    return new Promise((resolve) => {
        const data = (typeof defaultMovies !== 'undefined' && defaultMovies.length > 0) ? defaultMovies : backupMovies;
        setTimeout(() => resolve(data), DELAY_SLOW_FETCH);
    });
}

function getMoviesFast() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 101, title: "Матриця (з кешу)", year: 1999, genre: "Фантастика", watched: false },
                { id: 102, title: "Дюна (з кешу)", year: 2021, genre: "Фантастика", watched: true }
            ]);
        }, DELAY_FAST_FETCH);
    });
}

function markWatched(card) {
    card.classList.toggle('watched');
}

function saveToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function updateCounters() {
    if (heading) heading.textContent = "Мої улюблені фільми (" + movies.length + ")";
    if (counter) {
        const watchedCount = movies.filter(movie => movie.watched).length;
        counter.textContent = "Переглянуто: " + watchedCount + " з " + movies.length;
    }
}

function showToast() {
    if (!toast) return;
    toast.textContent = "Фільм додано";
    setTimeout(() => {
        toast.textContent = "";
    }, DELAY_TOAST);
}

function createMovieCard(movie) {
    const li = document.createElement('li');
    li.setAttribute('data-id', movie.id);

    if (movie.watched) {
        li.classList.add('watched');
    }

    const textSpan = document.createElement('span');
    textSpan.className = 'movie-title';
    textSpan.textContent = formatMovie(movie) + " [" + movie.genre + "] ";
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

function renderMovie(moviesToRender = movies) {
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

function clearList() {
    movies = [];
    if (searchInput) searchInput.value = "";
    saveToLocalStorage();
    renderMovie();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function showMovieDetails(id) {
    const currentMovie = movies.find(movie => movie.id === id);
    if (currentMovie && searchResult) {
        searchResult.textContent = `ID: ${currentMovie.id} | Назва: ${currentMovie.title} | Рік: ${currentMovie.year} | Жанр: ${currentMovie.genre} | Статус: ${currentMovie.watched ? "Переглянуто" : "Ще ні"}`;
    }
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function deleteMovie(card, id) {
    movies = movies.filter(movie => movie.id !== id);
    card.remove();
    saveToLocalStorage();

    if (movies.length === 0) {
        renderMovie();
    } else {
        updateCounters();
    }
}

function toggleMovieWatched(card, id) {
    movies.forEach(movie => {
        if (movie.id === id) {
            movie.watched = !movie.watched;
        }
    });
    markWatched(card);
    saveToLocalStorage();
    updateCounters();
}

function validateMovieForm(titleText, yearValue, yearRawValue) {
    if (titleError) titleError.textContent = "";
    if (yearError) yearError.textContent = "";

    const currentYear = new Date().getFullYear();
    let isValid = true;

    if (titleText === "") {
        if (titleError) titleError.textContent = "Назва фільму не може бути порожньою";
        isValid = false;
    }

    if (!yearRawValue || !isValidYear(yearValue)) {
        if (yearError) yearError.textContent = `Рік має бути в діапазоні від ${START_VALID_YEAR} до ${currentYear}`;
        isValid = false;
    }

    if (isValid && isDuplicateMovie(movies, titleText, yearValue)) {
        if (titleError) titleError.textContent = "Такий фільм вже є у вашому списку";
        isValid = false;
    }

    return isValid;
}

if (movieForm) {
    movieForm.addEventListener('submit', event => {
        event.preventDefault();

        const titleText = movieInput.value.trim();
        const yearValue = Number(movieYear.value);

        if (!validateMovieForm(titleText, yearValue, movieYear.value)) {
            return;
        }

        const newMovie = {
            id: generateId(),
            title: titleText,
            year: yearValue,
            genre: movieGenre.value,
            watched: movieWatched.checked
        };

        movies.push(newMovie);
        saveToLocalStorage();
        showToast();

        movieForm.reset();
        if (movieYear) movieYear.value = DEFAULT_FORM_YEAR;
        if (searchInput) searchInput.value = "";
        renderMovie();
    });
}

if (themeButton) themeButton.addEventListener('click', toggleTheme);
if (clearButton) clearButton.addEventListener('click', clearList);

window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'd' && event.target.tagName !== 'INPUT') {
        toggleTheme();
    }
});

if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );
        renderMovie(filteredMovies);
    }, DELAY_DEBOUNCE));
}

if (movieList) {
    movieList.addEventListener('click', event => {
        const parentLi = event.target.closest('li');
        if (!parentLi) return;

        const clickedId = Number(parentLi.getAttribute('data-id'));

        if (event.target.classList.contains('details-link')) {
            event.preventDefault();
            showMovieDetails(clickedId);
        }
        else if (event.target.classList.contains('delete-btn')) {
            deleteMovie(parentLi, clickedId);
        }
        else if (event.target.classList.contains('watched-btn')) {
            toggleMovieWatched(parentLi, clickedId);
        }
    });
}

if (movieList) movieList.textContent = "Завантаження...";

async function initWishlistAsync() {
    try {
        const localData = localStorage.getItem('movies');

        if (localData && localData !== "[]") {
            movies = JSON.parse(localData);
            return;
        }

        console.log("Завантаження оригінальних фільмів з movies.js...");

        const data = await getMoviesSlow();


        movies = data || [];

    } catch (error) {
        console.error("Помилка завантаження оригінального модуля movies.js:", error);
        movies = [];
    } finally {
        saveToLocalStorage();
        renderMovie();
    }
}

initWishlistAsync();
