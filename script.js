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
const searchResult = document.getElementById('search-result');

function markWatched(card) {
    card.classList.toggle('watched');
}

// Функція для відображення кількості фільмів
function updateCounters() {
    heading.textContent = "Мої улюблені фільми (" + movies.length + ")";
    const watchedCount = movies.filter(movie => movie.watched).length;
    counter.textContent = "Переглянуто: " + watchedCount + " з " + movies.length;
}

// 2. Функція для створення картки з фільмом
function createMovieCard(movie) {
    const li = document.createElement('li');
    li.textContent = movie.title + " (" + movie.year + ") ";
    li.setAttribute('data-id', movie.id);

    if (movie.watched) {
        li.classList.add('watched');
    }

    const watchBtn = document.createElement('button');
    watchBtn.textContent = "Переглянуто";
    watchBtn.classList.add('watched-btn');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Видалити";
    deleteBtn.classList.add('delete-btn');

    const detailsLink = document.createElement('a');
    detailsLink.textContent = "Детальніше";
    detailsLink.setAttribute('href', '#');
    detailsLink.classList.add('details-link');

    li.appendChild(watchBtn);
    li.appendChild(deleteBtn);
    li.appendChild(detailsLink);

    return li;
}

function renderMovie(moviesToRender = movies) {
    movieList.replaceChildren();
    updateCounters();

    moviesToRender.forEach(movie => {
        const card = createMovieCard(movie);
        movieList.appendChild(card);
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

// 3. Функція для рендеру деталей фільму
function showMovieDetails(id) {
    const currentMovie = movies.find(movie => movie.id === id);
    if (currentMovie) {
        searchResult.textContent = `ID: ${currentMovie.id} | Назва: ${currentMovie.title} | Рік: ${currentMovie.year} | Статус: ${currentMovie.watched ? "Переглянуто" : "Ще ні"}`;
    }
}

// 4.Функція для видалення фільму з масиву та DOM
function deleteMovie(card, id) {
    movies = movies.filter(movie => movie.id !== id);
    card.remove();
    updateCounters();
}

// 5. Функція для зміни статусу перегляду фільму
function toggleMovieWatched(card, id) {
    movies.forEach(movie => {
        if (movie.id === id) {
            movie.watched = !movie.watched;
        }
    });
    markWatched(card);
    updateCounters();
}

themeButton.addEventListener('click', toggleTheme);
addButton.addEventListener('click', addMovie);
clearButton.addEventListener('click', clearList);

movieInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        addMovie();
    }
});

window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'd' && event.target.tagName !== 'INPUT') {
        toggleTheme();
    }
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );
    renderMovie(filteredMovies);
});

movieList.addEventListener('click', event => {
    if (event.target.classList.contains('details-link')) {
        event.preventDefault();
        const parentLi = event.target.parentElement;
        showMovieDetails(Number(parentLi.getAttribute('data-id')));
        return;
    }

    const parentLi = event.target.parentElement;
    if (!parentLi) return;

    const clickedId = Number(parentLi.getAttribute('data-id'));

    if (event.target.classList.contains('delete-btn')) {
        deleteMovie(parentLi, clickedId);
    }
    else if (event.target.classList.contains('watched-btn')) {
        toggleMovieWatched(parentLi, clickedId);
    }
});

renderMovie();
