export const START_VALID_YEAR = 1900;
export const DEFAULT_FORM_YEAR = 2026;

export function isValidYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= START_VALID_YEAR && year <= currentYear;
}

export function isDuplicateMovie(moviesList, title, year) {
    return moviesList.some(movie =>
        movie.title.toLowerCase() === title.toLowerCase() && movie.year === year
    );
}

export function validateMovieForm(moviesList, titleText, yearValue, yearRawValue) {
    const currentYear = new Date().getFullYear();

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
