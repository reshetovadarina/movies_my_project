export function isValidYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
}
