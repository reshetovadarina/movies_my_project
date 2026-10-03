export function isValidYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
}

export function isDuplicateMovie(moviesList, title, year) {
    return moviesList.some(movie =>
        movie.title.toLowerCase() === title.toLowerCase() && movie.year === year
    );
}

export function validateMovieForm(moviesList, titleText, yearValue, yearRawValue) {
    const currentYear = new Date().getFullYear();
    const START_VALID_YEAR = 1900;

    if (titleText === "") {
        return { isValid: false, errorType: 'title', message: "Назва фільму не може бути порожньою" };
    }

    if (!yearRawValue || !isValidYear(yearValue)) {
        return { isValid: false, errorType: 'year', message: `Рік має бути в діапазоні від ${START_VALID_YEAR} до ${currentYear}` };
    }

    if (isDuplicateMovie(moviesList, titleText, yearValue)) {
        return { isValid: false, errorType: 'title', message: "Такий фільм вже є у вашому списку" };
    }

    return { isValid: true };
}
