import defaultMovies from './movies.js';
import { generateId, formatMovie } from './helpers.js';
import { isValidYear, isDuplicateMovie } from './validation.js';

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

let movies;

try {
    movies = JSON.parse(localStorage.getItem('movies')) || defaultMovies;
} catch (error) {
    console.error("Дані пошкоджені, повернено порожній масив фільмів.", error);
    movies = [];
}

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

function markWatched(card) {
    card.classList.toggle('watched');
}

function saveToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function updateCounters() {
    heading.textContent = "Мої улюблені фільми (" + movies.length + ")";
    const watchedCount = movies.filter(movie => movie.watched).length;
    counter.textContent = "Переглянуто: " + watchedCount + " з " + movies.length;
}

function showToast() {
    toast.textContent = "Фільм додано";
    setTimeout(() => {
        toast.textContent = "";
    }, 2000);
}

function createMovieCard(movie) {
    const li = document.createElement('li');
    li.textContent = formatMovie(movie) + " [" + movie.genre + "] ";
    li.setAttribute('data-id', movie.id);

    if (movie.watched) {
        li.classList.add('watched');
    }

    const watchBtn = document.createElement('button');
    watchBtn.textContent = "Переглянуто";
    watchBtn.classList.add('watched-btn');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Видалити";
    deleteBtn.classList.add('delete-btn');

    const detailsLink = document.createElement('a');
    detailsLink.textContent = "Детальніше";
    detailsLink.setAttribute('href', '#');
    detailsLink.classList.add('details-link');

    li.appendChild(watchBtn);
    li.appendChild(deleteBtn);
    li.appendChild(detailsLink);

    return li;
}

function renderMovie(moviesToRender = movies) {
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
    searchInput.value = "";
    saveToLocalStorage();
    renderMovie();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

function showMovieDetails(id) {
    const currentMovie = movies.find(movie => movie.id === id);
    if (currentMovie) {
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

movieForm.addEventListener('submit', event => {
    event.preventDefault();

    const titleText = movieInput.value.trim();
    const yearValue = Number(movieYear.value);
    const currentYear = new Date().getFullYear();

    titleError.textContent = "";
    yearError.textContent = "";

    let isFormValid = true;

    if (titleText === "") {
        titleError.textContent = "Назва фільму не може бути порожньою";
        isFormValid = false;
    }

    if (!movieYear.value || !isValidYear(yearValue)) {
        yearError.textContent = "Рік має бути в діапазоні від 1900 до " + currentYear;
        isFormValid = false;
    }

    if (isFormValid && isDuplicateMovie(movies, titleText, yearValue)) {
        titleError.textContent = "Такий фільм вже є у вашому списку";
        isFormValid = false;
    }

    if (!isFormValid) {
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
    movieYear.value = "2026";
    searchInput.value = "";
    renderMovie();
});

themeButton.addEventListener('click', toggleTheme);
clearButton.addEventListener('click', clearList);

window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'd' && event.target.tagName !== 'INPUT') {
        toggleTheme();
    }
});

searchInput.addEventListener('input', debounce(() => {
    const query = searchInput.value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );
    renderMovie(filteredMovies);
}, 400));

movieList.addEventListener('click', event => {
    if (event.target.classList.contains('details-link')) {
        event.preventDefault();
        const parentLi = event.target.parentElement;
        showMovieDetails(Number(parentLi.getAttribute('data-id')));
        return;
    }

    const parentLi = event.target.parentElement;
    if (!parentLi) return;

    const clickedId = Number(parentLi.getAttribute('data-id'));

    if (event.target.classList.contains('delete-btn')) {
        deleteMovie(parentLi, clickedId);
    }
    else if (event.target.classList.contains('watched-btn')) {
        toggleMovieWatched(parentLi, clickedId);
    }
});

movieList.textContent = "Завантаження...";
setTimeout(() => {
    renderMovie();
}, 1000);
