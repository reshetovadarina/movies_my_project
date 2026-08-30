let movies = [
    { id: 1, title: "Зелена книга", year: 2018, watched: false },
    { id: 2, title: "Сам удома", year: 1990, watched: false },
    { id: 3, title: "Гаррі Поттер", year: 2001, watched: false },
    { id: 4, title: "Містер і місіс Сміт", year: 2005, watched: false }
];

const heading = document.querySelector('h1');
const movieList = document.getElementById('movie-list');
const movieInput = document.getElementById('movie-input');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const themeButton = document.getElementById('theme-button');
const counter = document.getElementById('counter');

function markWatched(card) {
    card.classList.toggle('watched');
}

function renderMovie(moviesToRender = movies) {
    movieList.replaceChildren();
    heading.textContent = "Мої улюблені фільми (" + movies.length + ")";
    const watchedCount = movies.filter(movie => movie.watched).length;
    counter.textContent = "Переглянуто: " + watchedCount + " з " + movies.length;

    moviesToRender.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title + " (" + movie.year + ")";
        li.setAttribute('data-id', movie.id);

        if (movie.watched) {
            li.classList.add('watched');
        }

        movieList.appendChild(li);
    });
}

function addMovie() {
    const titleText = movieInput.value;

    if (titleText !== "") {
        const newMovie = {
            id: Date.now(),
            title: titleText,
            year: 2026,
            watched: false
        };

        movies.push(newMovie);
        movieInput.value = "";
        searchInput.value = "";
        renderMovie();
    }
}

function clearList() {
    movies = [];
    searchInput.value = "";
    renderMovie();
}

function toggleTheme() {
    document.body.classList.toggle('dark');
}

themeButton.addEventListener('click', toggleTheme);
addButton.addEventListener('click', addMovie);
clearButton.addEventListener('click', clearList);

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );
    renderMovie(filteredMovies);
});
movieList.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const clickedCard = event.target;
        const clickedId = Number(clickedCard.getAttribute('data-id'));

        movies.forEach(movie => {
            if (movie.id === clickedId) {
                movie.watched = !movie.watched;
            }
        });

        markWatched(clickedCard);
        renderMovie();
    }
});
renderMovie();
