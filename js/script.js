// Global Variables
const API_KEY = 'df5666577955b18078093f6c90aa38c2';
const swiperWrapper = document.querySelector('.swiper-wrapper');

// Index Page
if (window.location.href.indexOf('index.html') > -1) {
  async function getNowPlayingMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
      );
      const data = await response.json();
      data.results.forEach((movie) => {
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');
        swiperSlide.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
              alt="${movie.title}"
            />
          </a>
          <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
          </h4>
        `;
        swiperWrapper.appendChild(swiperSlide);
      });
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }

  const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });

  async function getPopularMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }

  async function displayPopularMovies() {
    const pmContainer = document.querySelector('#popular-movies');
    getPopularMovies().then((movies) => {
      let popularMoviesHTML = '';
      movies.forEach((movie) => {
        popularMoviesHTML += `<div class="card">
              <a href="movie-details.html?id=${movie.id}">
                <img
                  src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                  class="card-img-top"
                  alt="${movie.title}"
                />
              </a>
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                  <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
              </div>
            </div>`;
      });
      pmContainer.innerHTML = popularMoviesHTML;
    });
  }

  getNowPlayingMovies();
  displayPopularMovies();
}

// Movie Details Page
if (window.location.href.indexOf('movie-details.html') > -1) {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');

  // get movie details from TMDB API
  const getMovieDetails = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  };

  // update movie details in HTML
  const updateMovieDetails = async () => {
    const movieDetails = await getMovieDetails();
    const movieTitle = document.querySelector('#movie-details h2');
    const movieRating = document.querySelector('#movie-details p');
    const movieReleaseDate = document.querySelector('#release-date');
    const moviePoster = document.querySelector('#movie-details img');
    const movieOverview = document.querySelector(
      '#movie-details p:last-of-type'
    );
    const movieGenres = document.querySelector(
      '#movie-details .list-group:first-of-type'
    );
    const movieBudget = document.querySelector(
      '.details-bottom ul li:nth-child(1)'
    );
    const movieRevenue = document.querySelector(
      '.details-bottom ul li:nth-child(2)'
    );
    const movieRuntime = document.querySelector(
      '.details-bottom ul li:nth-of-type(3)'
    );
    const movieStatus = document.querySelector(
      '.details-bottom ul li:nth-of-type(4)'
    );
    const movieCompanies = document.querySelector(
      '#movie-details .list-group:last-child'
    );

    movieTitle.innerText = movieDetails.original_title;
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
    movieOverview.innerText = movieDetails.overview;
    movieGenres.innerHTML = movieDetails.genres
      .map((genre) => `<li>${genre.name}</li>`)
      .join('');
    movieBudget.innerHTML = `<span class="text-secondary">Budget:</span> $${movieDetails.budget.toLocaleString()}`;
    movieRevenue.innerHTML = `<span class="text-secondary">Revenue:</span> $${movieDetails.revenue.toLocaleString()}`;
    movieRuntime.innerHTML = `<span class="text-secondary">Runtime:</span> ${movieDetails.runtime} minutes`;
    movieStatus.innerHTML = `<span class="text-secondary">Status:</span> ${movieDetails.status}`;
    movieCompanies.innerText = movieDetails.production_companies
      .map((company) => company.name)
      .join(', ');
    movieRating.innerHTML = `<i class="fas fa-star text-primary"></i> ${movieDetails.vote_average} / 10`;
    movieReleaseDate.innerText = `Release Date: ${movieDetails.release_date}`;
  };

  updateMovieDetails();
}

// TV Shows Page
if (window.location.href.indexOf('shows.html') > -1) {
}

// TV Details Page
if (window.location.href.indexOf('tv-details.html') > -1) {
}

// Search Page
if (window.location.href.indexOf('search.html') > -1) {
}
