export async function fetchMovieFromOMDb(title) {
    const apiKey = '50cf6874';
    const baseEndpoint = 'https://omdbapi.com';

    const apiParams = new URLSearchParams();
    apiParams.append('apikey', apiKey);
    apiParams.append('t', title);

    const url = baseEndpoint + '?' + apiParams.toString();
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status}`);
    }

    const data = await response.json();
    return data;
}
