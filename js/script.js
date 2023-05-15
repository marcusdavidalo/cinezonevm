// Global Variables
const API_KEY = 'df5666577955b18078093f6c90aa38c2';
const spinner = document.querySelector('.spinner');

// Remove spinner class="show" on load
window.addEventListener('load', () => {
  spinner.classList.remove('show');
});

// ############################################################
// Index Page
if (
  window.location.href.indexOf('index.html') > -1 ||
  window.location.href === 'https://cinezonevm.netlify.app' || // for Netlify
  window.location.href === 'https://cinezonevm.netlify.app/' // for Netlify
) {
  const swiperWrapper = document.querySelector('.swiper-wrapper');

  const searchTermInput = document.querySelector('#search-term');
  const searchButton = document.querySelector('.btn');

  searchTermInput.addEventListener('input', () => {
    if (searchTermInput.value.trim() === '') {
      searchButton.disabled = true;
      searchButton.style.opacity = '0.5';
      searchButton.style.cursor = 'not-allowed';
    } else {
      searchButton.disabled = false;
      searchButton.style.opacity = '';
      searchButton.style.cursor = '';
    }
  });

  //
  if (searchTermInput.value.trim() === '') {
    searchButton.disabled = true;
    searchButton.style.opacity = '0.5';
    searchButton.style.cursor = 'not-allowed';
  } else {
    searchButton.disabled = false;
    searchButton.style.opacity = '';
    searchButton.style.cursor = '';
  }

  const hasPoster = (movie) => {
    return movie.poster_path !== null;
  };

  const getNowPlayingMovies = async () => {
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
          ${
            hasPoster(movie)
              ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}"/>`
              : `<img src="./images/no-image.jpg" alt="No Image Available"/>`
          }
          </a>
          <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${
              movie.vote_average
            } / 10
          </h4>
        `;
        swiperWrapper.appendChild(swiperSlide);
      });
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 1000,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 20,
    },
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
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });

  const getPopularMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  };

  const displayPopularMovies = async () => {
    const pmContainer = document.querySelector('#popular-movies');
    getPopularMovies().then((movies) => {
      let popularMoviesHTML = '';
      movies.forEach((movie) => {
        popularMoviesHTML += `<div class="card" data-aos="flip-up" data-aos-duration="700">
              <a href="movie-details.html?id=${movie.id}">
              ${
                hasPoster(movie)
                  ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}"/>`
                  : `<img src="./images/no-image.jpg" alt="No Image Available"/>`
              }
              </a>
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                  <small class="text-muted">Release: ${
                    movie.release_date
                  }</small>
                </p>
              </div>
            </div>`;
      });
      pmContainer.innerHTML = popularMoviesHTML;
    });
  };

  getNowPlayingMovies();
  displayPopularMovies();
}

// ############################################################
// Movie Details Page
if (
  window.location.href.indexOf('movie-details.html') > -1 ||
  window.location.href === `https://cinezonevm.netlify.app/movie-details.html`
) {
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
    const hasPoster = (movieDetails) => {
      return movieDetails.poster_path !== null;
    };
    const moviePage = document.querySelector('#movie-details a');
    const movieBackdrop = document.querySelector('#backdrop');
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
    moviePage.href = `${movieDetails.homepage}`;
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
    if (hasPoster(movieDetails)) {
      moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
    } else {
      moviePoster.src = './images/no-image.jpg';
    }
    movieBackdrop.style.backgroundSize = 'cover';
    movieBackdrop.style.backgroundPosition = 'center';
    movieBackdrop.style.backgroundRepeat = 'no-repeat';
    movieBackdrop.style.position = 'absolute';
    movieBackdrop.style.top = '0';
    movieBackdrop.style.left = '0';
    movieBackdrop.style.height = '100vh';
    movieBackdrop.style.width = '100vw';
    movieBackdrop.style.zIndex = '-999';
    movieBackdrop.style.opacity = '0.1';
  };

  updateMovieDetails();
}

// ############################################################
// TV Shows Page
if (
  window.location.href.indexOf('shows.html') > -1 ||
  window.location.href === `https://cinezonevm.netlify.app/shows.html`
) {
  const hasPoster = (show) => {
    return show.poster_path !== null;
  };

  const getPopularShows = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  };
  const displayPopularShows = async () => {
    const psContainer = document.querySelector('#popular-shows');
    getPopularShows().then((shows) => {
      let popularShowsHTML = '';
      shows.forEach((show) => {
        popularShowsHTML += `<div class="card">
        <a href="tv-details.html?id=${show.id}">
        ${
          hasPoster(show)
            ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.title}"/>`
            : `<img src="./images/no-image.jpg" alt="No Image Available"/>`
        }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${show.first_air_date}</small>
          </p>
        </div>
      </div>`;
      });
      psContainer.innerHTML = popularShowsHTML;
    });
  };

  displayPopularShows();
}

// ############################################################
// TV Details Page
if (
  window.location.href.indexOf('tv-details.html') > -1 ||
  window.location.href === `https://cinezonevm.netlify.app/tv-details.html`
) {
  const params = new URLSearchParams(window.location.search);
  const showsId = params.get('id');

  // get shows details from TMDB API
  const getShowsDetails = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${showsId}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  };

  // update show details in HTML
  const updateShowsDetails = async () => {
    const showsDetails = await getShowsDetails();
    const showsPoster = document.querySelector('#show-details img');
    const hasShowsPoster = (showsDetails) => {
      return showsDetails.poster_path !== null;
    };
    const showsPage = document.querySelector('#show-details a');
    const showsBackdrop = document.querySelector('#backdrop');
    const showsTitle = document.querySelector('#show-details h2');
    const showsRating = document.querySelector('#show-details p');
    const showsLastAirDate = document.querySelector(
      '#show-details p:nth-child(3)'
    );
    const showsOverview = document.querySelector(
      '#show-details p:last-of-type'
    );
    const showsGenres = document.querySelector(
      '#show-details .list-group:first-of-type'
    );
    const showsEpisodeNumber = document.querySelector(
      '.details-bottom ul li:nth-child(1)'
    );
    const showsLastEpisode = document.querySelector(
      '.details-bottom ul li:nth-child(2)'
    );
    const showsStatus = document.querySelector(
      '.details-bottom ul li:nth-of-type(3)'
    );
    const showsCompanies = document.querySelector(
      '#show-details .list-group:last-child'
    );

    showsPoster.src = hasShowsPoster(showsDetails)
      ? `https://image.tmdb.org/t/p/w500${showsDetails.poster_path}`
      : './images/no-image.jpg';

    showsPage.href = `${showsDetails.homepage}`;
    showsTitle.innerText = showsDetails.original_name;
    showsRating.innerHTML = `<i class="fas fa-star text-primary"></i> ${showsDetails.vote_average} / 10`;
    showsLastAirDate.innerText = `Last Air Date: ${showsDetails.last_air_date}`;
    showsOverview.innerText = showsDetails.overview;
    showsGenres.innerHTML = showsDetails.genres
      .map((genres) => `<li>${genres.name}</li>`)
      .join('');
    showsEpisodeNumber.innerHTML = `<span class="text-secondary">Number of Episodes:</span> ${showsDetails.number_of_episodes.toLocaleString()}`;
    showsLastEpisode.innerHTML = `<span class="text-secondary">Last Episode To Air:</span> ${showsDetails.last_episode_to_air.name.toLocaleString()}`;
    showsStatus.innerHTML = `<span class="text-secondary">Status:</span> ${showsDetails.status}`;
    showsCompanies.innerText = showsDetails.production_companies
      .map((company) => company.name)
      .join(', ');
    showsBackdrop.style.backgroundSize = 'cover';
    showsBackdrop.style.backgroundPosition = 'center';
    showsBackdrop.style.backgroundRepeat = 'no-repeat';
    showsBackdrop.style.position = 'absolute';
    showsBackdrop.style.top = '0';
    showsBackdrop.style.left = '0';
    showsBackdrop.style.height = '100vh';
    showsBackdrop.style.width = '100vw';
    showsBackdrop.style.zIndex = '-999';
    showsBackdrop.style.opacity = '0.1';
  };

  updateShowsDetails();
}

// ############################################################
// Search Page
if (
  window.location.href.indexOf('search.html') > -1 ||
  window.location.href === 'https://cinezonevm.netlify.app/search.html'
) {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search-term');
  const type = params.get('type');

  const searchTermInput = document.querySelector('#search-term');
  const searchButton = document.querySelector('.btn');

  searchTermInput.addEventListener('input', () => {
    if (searchTermInput.value.trim() === '') {
      searchButton.disabled = true;
      searchButton.style.opacity = '0.5';
      searchButton.style.cursor = 'not-allowed';
    } else {
      searchButton.disabled = false;
      searchButton.style.opacity = '';
      searchButton.style.cursor = '';
    }
  });

  //
  if (searchTermInput.value.trim() === '') {
    searchButton.disabled = true;
    searchButton.style.opacity = '0.5';
    searchButton.style.cursor = 'not-allowed';
  } else {
    searchButton.disabled = false;
    searchButton.style.opacity = '';
    searchButton.style.cursor = '';
  }

  let currentPage = 1;

  const getSearched = async (page) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${searchTerm}&page=${page}`
    );
    const data = await response.json();
    return data;
  };

  const hasPoster = (result) => {
    return result.poster_path !== null;
  };

  const displayResults = (results) => {
    const resultsContainer = document.getElementById('search-results');
    let resultsHTML = '';
    results.forEach((result) => {
      if (type === 'movie') {
        resultsHTML += `<div class="card" data-aos="zoom-in" data-aos-duration="700">
          <a href="movie-details.html?id=${result.id}">
          ${
            hasPoster(result)
              ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.title}"/>`
              : `<img src="./images/no-image.jpg" alt="No Image Available"/>`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">
              <small class="text-muted">Released: ${result.release_date}</small>
            </p>
          </div>
        </div>`;
      } else if (type === 'tv') {
        resultsHTML += `<div class="card" data-aos="zoom-in" data-aos-duration="700">
          <a href="tv-details.html?id=${result.id}">
          ${
            hasPoster(result)
              ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.title}"/>`
              : `<img src="./images/no-image.jpg" alt="No Image Available"/>`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${result.first_air_date}</small>
            </p>
          </div>
        </div>`;
      }
    });
    resultsContainer.innerHTML = resultsHTML;
  };

  const updatePageCounter = (page, totalPages) => {
    const pageCounter = document.querySelector('.page-counter');
    pageCounter.textContent = `Page ${page} of ${totalPages}`;
  };

  const prevClick = async () => {
    if (currentPage > 1) {
      currentPage--;
      const results = await getSearched(currentPage);
      displayResults(results.results);
      updatePageCounter(currentPage, results.total_pages);
    }
  };

  const nextClick = async () => {
    const results = await getSearched(currentPage + 1);
    if (results.page <= results.total_pages) {
      currentPage++;
      displayResults(results.results);
      updatePageCounter(currentPage, results.total_pages);
    }
  };

  const initPagination = async () => {
    const results = await getSearched(currentPage);
    displayResults(results.results);
    updatePageCounter(currentPage, results.total_pages);

    const prevButton = document.getElementById('prev');
    prevButton.addEventListener('click', prevClick);

    const nextButton = document.getElementById('next');
    nextButton.addEventListener('click', nextClick);
  };

  initPagination();
}

// Links and References:
// https://developer.mozilla.org/en-US/docs/Web/API/Location
// https://swiperjs.com/
// https://www.themoviedb.org/
// https://image.tmdb.org/t/p/w500
// https://api.themoviedb.org/3/movie/popular?api_key=df5666577955b18078093f6c90aa38c2
// https://api.themoviedb.org/3/tv/popular?api_key=df5666577955b18078093f6c90aa38c2
// https://michalsnik.github.io/aos/
