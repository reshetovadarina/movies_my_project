import defaultMovies from './movies.js';

const DELAY_SLOW_FETCH = 2000;

let movies = [];

export function getMovies() {
    return movies;
}

export function setMovies(newMovies) {
    movies = newMovies;
}

export function saveToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function getMoviesSlow() {
    return new Promise((resolve) => {
        const data = (typeof defaultMovies !== 'undefined' && defaultMovies.length > 0) ? defaultMovies : [];
        setTimeout(() => resolve(data), DELAY_SLOW_FETCH);
    });
}

export async function initMovies() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    try {
        const localData = localStorage.getItem('movies');

        if (localData && localData !== "[]" && localData !== null) {
            movies = JSON.parse(localData);
            return movies;
        }

        console.log("Завантаження оригінальних фільмів з movies.js...");
        const data = await getMoviesSlow();
        movies = data || [];
        saveToLocalStorage();
        return movies;

    } catch (error) {
        console.error("Помилка ініціалізації або пошкоджений JSON в localStorage:", error);

        movies = defaultMovies || [];
        saveToLocalStorage();
        return movies;
    }
}

export function addMovie(newMovie) {
    movies.push(newMovie);
    saveToLocalStorage();
}
