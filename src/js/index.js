const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '14666416-80cfd455e5c85d3a2f8572fbd';

import axios from 'axios';
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('.input');

let page = 1;
let PER_PAGE = 40;
let totalHits = 0;
let searchQuery = '';

btnLoadMore.style.display = 'none';

searchFormEl.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';
  btnLoadMore.style.display = 'none';
  const value = inputEl.value.trim();

  if (!value) {
    return Notiflix.Notify.failure('Please enter a search request.');
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const data = await searchPhoto(value);

    arrPhoto(data.hits);
    totalHits = data.totalHits;

    if (page * PER_PAGE < totalHits) {
      btnLoadMore.style.display = 'block';
    } else {
      showFailure();
    }

    page += 1;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMore() {
  if (!value) {
    return Notiflix.Notify.failure('Please enter a search request.');
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const value = inputEl.value;
    const data = await searchPhoto(value);

    arrPhoto(data.hits);
    totalHits = data.totalHits;

    if (page * PER_PAGE < totalHits) {
      btnLoadMore.style.display = 'block';
    } else {
      showFailure();
    }

    page += 1;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function showFailure() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
  btnLoadMore.style.display = 'none';
}

async function searchPhoto(value) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;
  const { data } = await axios.get(url);
  return data;
}

function arrPhoto(elements) {
  const markup = elements
    .map(
      ({
        largeImageURL,
        tags,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=300px />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>
    </div>
  `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}
