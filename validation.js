export function isValidYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
}

export function isDuplicateMovie(moviesList, title, year) {
    return moviesList.some(movie =>
        movie.title.toLowerCase() === title.toLowerCase() && movie.year === year
    );
}
