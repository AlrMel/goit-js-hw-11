import './css/style.css';
import { pixabayApi } from './js/pixabay-api.js';
import { galleryTemplate } from './js/gallery-template.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const inputSearch = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const btnLoad = document.querySelector('.load-more');

let search = '';
let page = 1;
const lightbox = new SimpleLightbox('.gallery a');

inputSearch.addEventListener('input', onInputSearch);
form.addEventListener('submit', onSubmitSearch);
btnLoad.addEventListener('click', onBtnLoad);

function onInputSearch(event) {
    search = event.target.value.trim();
  }

async function onSubmitSearch(event) {
  event.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';
  btnLoad.style.visibility = 'hidden';

  if (search === '') {
    return;
  }

  await pixabayApi(search, page)
    .then(images => {
    const cards = images.hits;
    const totalCard = images.totalHits;
    btnLoad.style.visibility = 'visible';

    if (cards.length === 0) {
     if (page === 1) {
       Notiflix.Notify.failure('Try again.');
          btnLoad.style.visibility = 'hidden';
        } else {
          Notiflix.Notify.failure("You are have reached the end of search results.");
          btnLoad.style.visibility = 'hidden';
        }
        return;
      }
      Notiflix.Notify.success(`We found ${totalCard} images.`);
      galleryEl.insertAdjacentHTML('afterbegin', galleryTemplate(cards));
      lightbox.refresh();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function onBtnLoad() {
  page += 1;
  await pixabayApi(search, page)
    .then(images => {
      const cards = images.hits;
      galleryEl.insertAdjacentHTML('beforeend', galleryTemplate(cards));
      lightbox.refresh();
      onScroll();
    })
    .catch(() => {
      Notiflix.Notify.failure("You are have reached the end of search results.");
      btnLoad.style.visibility = 'hidden';
    });
}

function onScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}



