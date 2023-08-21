import axios from 'axios';
import Notiflix from 'notiflix';

export async function pixabayApi(search, page) {
  const API_KEY = '38928802-39989455151dcc17ad76e6b61';
  const URL = `https://pixabay.com/api/?q=${search}&key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const data = await response.data;

    if (response.status !== 200 || response.data.hits.length === 0) {
      throw new Error(response.status);
    } else {
      return data;
    }
  } catch (err) {
    Notiflix.Notify.failure(
      'Image not found. Try again.'
    );
  }
}