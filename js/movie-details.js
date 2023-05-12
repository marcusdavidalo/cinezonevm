// get movie ID from URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');
const apiKey = 'df5666577955b18078093f6c90aa38c2';

// get movie details from TMDB API
const getMovieDetails = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
  );
  const data = await response.json();
  return data;
};

// update movie details in HTML
const updateMovieDetails = async () => {
  const movieDetails = await getMovieDetails();
  const movieTitle = document.querySelector('#movie-details h2');
  const moviePoster = document.querySelector('#movie-details img');
  const movieOverview = document.querySelector('#movie-details p:last-of-type');
  const movieGenres = document.querySelector('#movie-details .list-group');
  const movieBudget = document.querySelector(
    '#movie-details ul li:nth-of-type(1)'
  );
  const movieRevenue = document.querySelector(
    '#movie-details ul li:nth-of-type(2)'
  );
  const movieRuntime = document.querySelector(
    '#movie-details ul li:nth-of-type(3)'
  );
  const movieStatus = document.querySelector(
    '#movie-details ul li:nth-of-type(4)'
  );
  const movieCompanies = document.querySelector('#movie-details .list-group');

  movieTitle.innerText = movieDetails.original_title;
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
  movieOverview.innerText = movieDetails.overview;
  movieGenres.innerHTML = movieDetails.genres
    .map((genre) => `<li>${genre.name}</li>`)
    .join('');
  movieBudget.innerText = `$ ${movieDetails.budget.toLocaleString()}`;
  movieRevenue.innerText = `$ ${movieDetails.revenue.toLocaleString()}`;
  movieRuntime.innerText = `${movieDetails.runtime} minutes`;
  movieStatus.innerText = movieDetails.status;
  movieCompanies.innerText = movieDetails.production_companies
    .map((company) => company.name)
    .join(', ');
};

updateMovieDetails();
