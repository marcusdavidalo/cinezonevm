const API_KEY = 'df5666577955b18078093f6c90aa38c2';
const swiperWrapper = document.querySelector('.swiper-wrapper');

fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
  .then((response) => response.json())
  .then((data) => {
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
  });

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
      `https://api.themoviedb.org/3/movie/popular?api_key=${
        API - KEY
      }&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
}

function displayPopularMovies() {
  const pmContainer = document.querySelector('#popular-movies');
  getPopularMovies().then((movies) => {
    let popularMoviesHTML = '';
    movies.forEach((movie) => {
      popularMoviesHTML += ` 
        <div class="card">
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
        </div>
      `;
    });
    pmContainer.innerHTML = popularMoviesHTML;
  });
}

displayPopularMovies();
