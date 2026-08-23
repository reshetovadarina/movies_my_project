const movies = [
    { id: 1, title: "Зелена книга", year: 2018, watched: false },
    { id: 2, title: "Сам удома", year: 1990, watched: false },
    { id: 3, title: "Гаррі Поттер", year: 2001, watched: false },
    { id: 4, title: "Містер і місіс Сміт", year: 2005, watched: false }
];

const heading = document.querySelector('h1');
heading.textContent = heading.textContent + " (" + movies.length + ")";

const movieList = document.getElementById('movie-list');
const movieInput = document.getElementById('movie-input');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResult = document.getElementById('search-result');
const clearButton = document.getElementById('clear-button');

function renderMovies() {
    movieList.innerHTML = "";

movies.forEach(function(movie) {
    const li = document.createElement('li');
    li.textContent = movie.title + " (" + movie.year + ")";
      li.setAttribute('data-id', movie.id);
    movieList.appendChild(li);
});
}

function addMovie() {
    const titleText = movieInput.value;

    if (titleText !== "") {

         const countBefore = document.querySelectorAll('#movie-list li').length;
        console.log("Кількість карток ДО додавання:", countBefore);

        const newMovie = {
            id: movies.length + 1,
            title: titleText,
            year: 2026,
            watched: false
        };

        movies.push(newMovie);
        movieInput.value = "";
        renderMovies();
        const countAfter = document.querySelectorAll('#movie-list li').length;
        console.log("Кількість карток ПІСЛЯ додавання:", countAfter);
    }
}
function searchMovie() {
    const query = searchInput.value.toLowerCase();
    if (query === "") {
        searchResult.textContent = "Введіть текст для пошуку";
        return;
    }

    let foundMovie = null;
    movies.forEach(function(movie) {
        const movieTitleLower = movie.title.toLowerCase();
        if (movieTitleLower.includes(query)) {
            foundMovie = movie;
        }
    });
    if (foundMovie !== null) {
        searchResult.textContent = "Знайдено: " + foundMovie.title + " (" + foundMovie.year + ")";
    } else {
        searchResult.textContent = "Нічого не знайдено";
    }
}

function clearList() {
    const list = document.querySelector('#movie-list');
    list.innerHTML = "";
}

addButton.onclick = addMovie;
searchButton.onclick = searchMovie;
clearButton.onclick = clearList;
renderMovies();
