import './sass/main.scss';
import countryCard from './hbs/countryCard.hbs'
import countryList from './hbs/countryList.hbs'
import API from './js/fetchCountries';
import Notiflix from 'notiflix';
import { log } from 'debug';

const debounce = require('lodash.debounce')
const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountry: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

refs.searchCountry.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY))

function onSearchCountry(e) {
  const inputValue = e.target.value
  console.log(inputValue);

  refs.countryInfo.innerHTML = ''
  refs.countryList.innerHTML = ''

  API.fetchCountries(inputValue)
    .then(renderMarkupCountry)
    .catch(error => console.log(error))
}


function renderMarkupCountry(countries) {
  console.log(countries);
  if (countries.length === 1) {
    refs.countryInfo.insertAdjacentHTML('beforeend', countryCard(countries[0]))
  }
  else if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
  }
  else if (countries.status === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name')
  }
  else if (countries.length >= 2 && countries.length <= 10) {
    refs.countryList.insertAdjacentHTML('afterbegin', countryList(countries))

  }
}