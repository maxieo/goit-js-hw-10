import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector ('#search-box'),
    countryList: document.querySelector ('.country-list'),
    countryInfo: document.querySelector ('.country-info')
}

refs.input.addEventListener ('input', debounce(onFormInput, DEBOUNCE_DELAY))

function onFormInput (e) {
    let searchQuery = e.target.value.trim()
        if (searchQuery === ''){
            return clear()
        }
    
    fetchCountries (searchQuery).then(countries => {
        if (countries.length > 10) {
            clear()
            return Notify.info (`Too many matches found. Please enter a more specific name.`)
        }

        const markupCountry = countries.map (({name, flags}) => {
            return  `<li class="country-item">
                        <img src="${flags.svg}" alt="${name.official}" width="40" height="20">
                        <p class="country-name">${name.official}</p>
                     </li>`
        }).join ('')
        clearInfo ()
        refs.countryList.innerHTML = markupCountry

        if (countries.length === 1) {
            const {capital, population, languages} = countries [0]
            const markupInfo = `<div><span class="title">Capital:</span>${capital}</div>
                                <div><span class="title">Population:</span>${population}</div>
                                <div><span class="title">Languages:</span>${Object.values(languages).join(', ')}</div>`;
            refs.countryInfo.innerHTML = markupInfo
        }
    }).catch (e => {
        clear()
        return Notify.failure (`Oops, there is no country with that name`)
    })
}




function clear () {
    refs.countryInfo.innerHTML = ''
    refs.countryList.innerHTML = ''
}

function clearInfo () {
    refs.countryInfo.innerHTML = ''
}

