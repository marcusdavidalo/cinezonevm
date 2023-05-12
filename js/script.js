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
