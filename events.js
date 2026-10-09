import { getMovies, setMovies, saveToLocalStorage, initMovies, addMovie } from './state.js';
import { DEFAULT_FORM_YEAR } from './validation.js';
import { validateMovieForm } from './validation.js';
import { renderMovie, showToast, updateCounters } from './render.js';
import { generateId, debounce } from './helpers.js';
import { fetchMovieFromOMDb } from './api.js';

const DEBOUNCE_DELAY = 400;
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
const searchResult = document.getElementById('search-result');
const movieList = document.getElementById('movie-list');
const omdbInput = document.getElementById('omdb-input');
const omdbSearchBtn = document.getElementById('omdb-search-btn');
const omdbCardResult = document.getElementById('omdb-card-result');

if (movieForm) {
    movieForm.addEventListener('submit', event => {
        event.preventDefault();
        if (titleError) titleError.textContent = "";
        if (yearError) yearError.textContent = "";

        const titleText = movieInput.value.trim();
        const yearValue = Number(movieYear.value);

        const validation = validateMovieForm(getMovies(), titleText, yearValue, movieYear.value);

        if (!validation.isValid) {
            if (validation.errorType === 'title' && titleError) titleError.textContent = validation.message;
            if (validation.errorType === 'year' && yearError) yearError.textContent = validation.message;
            return;
        }

        const newMovie = {
            id: generateId(),
            title: titleText,
            year: yearValue,
            genre: movieGenre.value,
            watched: movieWatched.checked
        };

        addMovie(newMovie);
        showToast();
        movieForm.reset();

       if (movieYear) movieYear.value = String(DEFAULT_FORM_YEAR);
        if (searchInput) searchInput.value = "";
        renderMovie();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        const filtered = getMovies().filter(m => m.title.toLowerCase().includes(query));
        renderMovie(filtered);
    }, DEBOUNCE_DELAY));
}

if (movieList) {
    movieList.addEventListener('click', event => {
        const parentLi = event.target.closest('li');
        if (!parentLi) return;

        const clickedId = Number(parentLi.getAttribute('data-id'));

        if (event.target.classList.contains('delete-btn')) {
            const updated = getMovies().filter(m => m.id !== clickedId);
            setMovies(updated);
            parentLi.remove();
            saveToLocalStorage();
            if (getMovies().length === 0) renderMovie(); else updateCounters();
        }
        else if (event.target.classList.contains('watched-btn')) {
            getMovies().forEach(m => { if (m.id === clickedId) m.watched = !m.watched; });
            parentLi.classList.toggle('watched');
            saveToLocalStorage();
            updateCounters();
        }
        else if (event.target.classList.contains('details-link')) {
            event.preventDefault();
            const clickedId = Number(parentLi.getAttribute('data-id'));
            const currentMovie = getMovies().find(m => m.id === clickedId);

            if (currentMovie && searchResult) {
                searchResult.textContent = `ID: ${currentMovie.id} | Назва: ${currentMovie.title} | Рік: ${currentMovie.year} | Жанр: ${currentMovie.genre} | Статус: ${currentMovie.watched ? "Переглянуто" : "Ще ні"}`;

                console.log(`Надсилаю запит до OMDb API для реального фільму: "${currentMovie.title}"`);
                fetchMovieFromOMDb(currentMovie.title)
                    .then(data => {
                        console.log(` ДАНІ ФІЛЬМУ "${currentMovie.title}" УСПІШНО ОТРИМАНО`);
                        console.log(data);
                    })
                    .catch(err => console.error("Помилка під час детального запиту:", err));
            }
        }
    });
}

async function searchMovieInOMDbAsync() {
    const queryTitle = omdbInput.value.trim();

    if (!queryTitle) {
        if (omdbCardResult) {
            omdbCardResult.replaceChildren();
            const p = document.createElement('p');
            p.className = 'omdb-status-error';
            p.textContent = "Будь ласка, введіть назву фільму для пошуку.";
            omdbCardResult.appendChild(p);
        }
        return;
    }

    if (omdbCardResult) {
        omdbCardResult.replaceChildren();
        const p = document.createElement('p');
        p.className = 'omdb-status-loading';
        p.textContent = "Завантаження...";
        omdbCardResult.appendChild(p);
    }

    try {
        const data = await fetchMovieFromOMDb(queryTitle);

        if (data.Response === "False") {
            throw new Error(data.Error || "Фільм не знайдено.");
        }

        omdbCardResult.replaceChildren();

        const card = document.createElement('div');
        card.className = 'omdb-inline-card';
        if (data.Poster && data.Poster !== 'N/A') {
            const img = document.createElement('img');
            img.src = data.Poster;
            img.alt = data.Title;
            card.appendChild(img);

        const infoDiv = document.createElement('div');

        const titleStrong = document.createElement('strong');
        titleStrong.textContent = data.Title;

        const yearSpan = document.createElement('span');
        yearSpan.textContent = 'Рік випуску: ' + data.Year;


        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.id = 'omdb-add-wishlist-btn';
        addBtn.textContent = 'Додати у вішліст';

        infoDiv.appendChild(titleStrong);
        infoDiv.appendChild(yearSpan);
        infoDiv.appendChild(addBtn);

        card.appendChild(infoDiv);
        omdbCardResult.appendChild(card);

        addBtn.addEventListener('click', () => {
            const cleanYear = parseInt(data.Year) || DEFAULT_FORM_YEAR;
            const cleanGenre = data.Genre ? data.Genre.split(',')[0].trim() : "Фантастика";

            const apiNewMovie = { id: generateId(), title: data.Title, year: cleanYear, genre: cleanGenre, watched: false };
            addMovie(apiNewMovie);
            showToast();
            renderMovie();

            omdbInput.value = "";
            omdbCardResult.replaceChildren();
        });
        }}
 catch (error) {
        if (omdbCardResult) {
            omdbCardResult.replaceChildren();
            const p = document.createElement('p');
            p.className = 'omdb-status-error';
            p.textContent = "Не вдалося знайти фільм. Причина: " + error.message;
            omdbCardResult.appendChild(p);
        }
    }
}

if (omdbSearchBtn) omdbSearchBtn.addEventListener('click', searchMovieInOMDbAsync);

if (omdbInput) {
    omdbInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMovieInOMDbAsync();
        }
    });
}

if (clearButton) {
    clearButton.addEventListener('click', () => {
        setMovies([]);
        if (searchInput) searchInput.value = "";
        saveToLocalStorage();
        renderMovie();
    });
}

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
