import defaultMovies from './movies.js';
import { generateId, formatMovie } from './helpers.js';
import { isValidYear, isDuplicateMovie } from './validation.js';

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
        setTimeout(() => {
            resolve(defaultMovies);
        }, 2000);
    });
}

function getMoviesFast() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 101, title: "Матриця (з кешу)", year: 1999, genre: "Фантастика", watched: false },
                { id: 102, title: "Дюна (з кешу)", year: 2021, genre: "Фантастика", watched: true }
            ]);
        }, 500);
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
    }, 2000);
}

function createMovieCard(movie) {
    const li = document.createElement('li');
    li.setAttribute('data-id', movie.id);

    const textSpan = document.createElement('span');
    textSpan.textContent = formatMovie(movie) + " [" + movie.genre + "] ";
    li.appendChild(textSpan);

    if (movie.watched) {
        li.classList.add('watched');
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.style.display = "inline-block";
    actionsDiv.style.marginLeft = "15px";

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
    if (isDark) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
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

if (movieForm) {
    movieForm.addEventListener('submit', event => {
        event.preventDefault();

        const titleText = movieInput.value.trim();
        const yearValue = Number(movieYear.value);
        const currentYear = new Date().getFullYear();

        if (titleError) titleError.textContent = "";
        if (yearError) yearError.textContent = "";

        let isFormValid = true;

        if (titleText === "") {
            if (titleError) titleError.textContent = "Назва фільму не може бути порожньою";
            isFormValid = false;
        }

        if (!movieYear.value || !isValidYear(yearValue)) {
            if (yearError) yearError.textContent = "Рік має бути в діапазоні від 1900 до " + currentYear;
            isFormValid = false;
        }

        if (isFormValid && isDuplicateMovie(movies, titleText, yearValue)) {
            if (titleError) titleError.textContent = "Такий фільм вже є у вашому списку";
            isFormValid = false;
        }

        if (!isFormValid) return;

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
        if (movieYear) movieYear.value = "2026";
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
    }, 400));
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

        if (localData) {
            movies = JSON.parse(localData);
        } else {
            movies = await Promise.race([getMoviesSlow(), getMoviesFast()]);
            saveToLocalStorage();
        }

        renderMovie();
        console.log("Дані успішно відрендерено через async/await!");
    } catch (error) {
        console.error("Помилка в async/await:", error);
        if (movieList) {
            movieList.textContent = "Не вдалося завантажити фільми. Спробуйте пізніше!";
        }
    }
}

function testLoadingWithThen() {
    Promise.race([getMoviesSlow(), getMoviesFast()])
        .then((data) => {
            console.log("Дані паралельно успішно отримано через .then():", data);
        })
        .catch((error) => {
            console.error("Помилка перехоплена через .catch():", error);
        });
}

initWishlistAsync();
testLoadingWithThen();
