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
    // 🔥 ВІДНОВЛЕННЯ ТЕМИ: Перевіряємо сховище та миттєво вмикаємо темний режим, якщо він був збережений
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

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
}
