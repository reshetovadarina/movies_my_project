export function generateId() {
    return Date.now();
}

export function formatMovie(movie) {
    return `${movie.title} (${movie.year})`;
}

export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
