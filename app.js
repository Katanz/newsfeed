// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status Code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xht.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open("Post", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(shr.status / 100) !== 2) {
            cb(`Error. Status Code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status Code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.defineProperties(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    }
  };
}

// init http module
const http = customHttp();

const newsService = (function() {
  const apiKey = "8a0fd6b5c8f14393bef61bb8fce99714";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  };
})();

// elements
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const searchInput = form.elements["search"];

form.addEventListener("submit", e => {
  e.preventDefault();
  loadNews();
});

// init selects
document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

// load all news func
function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

// func on get response from server
function onGetResponse(err, res) {
  removePreloader();
  if (err) {
    showAlert(err, "error-msg");
    return;
  }

  if (!res.articles.length) {
    //show empty message
    return;
  }
  renderNews(res.articles);
}

// func for clear container
function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

//func render news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = "";
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// news item template function
function newsTemplate({ urlToImage, title, url, description }) {
  return `
    <div class = "col s12">
      <div class="card">
        <div class = "card-image">
          <img src="${urlToImage}">
          <span class ="card-title grey darken-4">${title || ""}</span>
        </div>
        <div class="card-content">
          <p>${description || ""}</p>
        </div>
        <div class ="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

// func for show messages
function showAlert(msg, type = "success") {
  M.toast({ html: msg, classes: type });
}

// show loader function
function showLoader() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class = "progress">
      <div class="indeterminate"></div>
    </div>
    `
  );
}

// remove loader function
function removePreloader() {
  const loader = document.querySelector(".progress");
  if (loader) {
    loader.remove();
  }
}
