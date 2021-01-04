// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function (){
  const _apikey = 'ab9c883d3b0a43a1b32edf3b59f11616'
  const _apiUrl = 'https://news-api-v2.herokuapp.com'

  return {
    topHeadlines(country = 'ua', cb){
      http.get(`${_apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${_apikey}`,
          cb)
    },
    everything(query, cb){
      http.get(`${_apiUrl}/everything?q=${query}&apiKey=${_apikey}`, cb)
    }
  }

})()

const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const searchInput = form.elements['search']

form.addEventListener('submit', e => {
  e.preventDefault()
  loadNews()
})

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews()
});


//load news default func
function loadNews() {
  showLoader()

  const country = countrySelect.value
  const searchText = searchInput.value

  if (!searchText){
    newsService.topHeadlines('ru', onGetResponse)
  }else{
    newsService.everything(searchText, onGetResponse)
  }

}

// on get response from server
function onGetResponse(err, res) {
  removeLoader()
  if (err){
    showAlert(err, 'error-msg')
  }

  if (!res.articles.length){
    return
  }

  renderNews(res.articles)
}


//render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row')
  if(newsContainer.children.length){
    clear(newsContainer)
  }
  let fragment = ''

  news.forEach(newsItem => {
    const element = newsTemplate(newsItem)
    fragment += element
  })

  newsContainer.insertAdjacentHTML('afterbegin', fragment)
}

//clear container

function clear(container) {
  let child = container.lastElementChild
  while(child){
    container.removeChild(child)
    child = container.lastElementChild
  }
}

//news item template
function newsTemplate({urlToImage, title, url, description}) {

  return `
    <div class="col s12">
        <div class="card">
            <div class="card-image">
                <img src="${urlToImage}">
                <span class="card-title">${title || ''}</span>
            </div>
            <div class="card-content">
                <p>${description || ''}</p>
            </div>
            <div class="card-action">
                <a href="${url}">Read more...</a>
            </div>
        </div>
    </div>
  `
}

function showAlert(msg, type = 'success') {
  M.toast({html: msg, classes: type})
}

function showLoader() {
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="progress">
        <div class="indeterminate"></div>
    </div>
  `)
}

function removeLoader() {
  const loader = document.querySelector('.progress')
  if (loader){
    loader.remove()
  }
}
















