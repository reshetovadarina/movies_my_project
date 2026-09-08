export function generateId() {
    return Date.now();
}

export function formatMovie(movie) {
    return `${movie.title} (${movie.year})`;
}
