const OMDB_API_KEY = '50cf6874';
const BASE_ENDPOINT = 'https://omdbapi.com';

export async function fetchMovieFromOMDb(title) {
    const apiParams = new URLSearchParams();
    apiParams.append('apikey', OMDB_API_KEY);
    apiParams.append('t', title);

    const url = BASE_ENDPOINT + '?' + apiParams.toString();
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status}`);
    }

    const data = await response.json();
    return data;
}
