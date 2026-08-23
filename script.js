const movies = [
    { id: 1, title: "Зелена книга", year: 2018, watched: false },
    { id: 2, title: "Сам удома", year: 1990, watched: false },
    { id: 3, title: "Гаррі Поттер", year: 2001, watched: false },
    { id: 4, title: "Містер і місіс Сміт", year: 2005, watched: false }
];

const heading = document.querySelector('h1');
heading.textContent = heading.textContent + " (" + movies.length + ")";

const movieList = document.getElementById('movie-list');
movies.forEach(function(movie) {
    const li = document.createElement('li');
    li.textContent = movie.title + " (" + movie.year + ")";
    movieList.appendChild(li);
});
