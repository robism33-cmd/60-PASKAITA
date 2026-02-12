const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statusText = document.getElementById("status");
const searchBtn = document.getElementById("searchBtn");

const allShowsApi = "https://api.tvmaze.com/shows";
const searchShows = "https://api.tvmaze.com/search/shows?q=";

function createCard(movie) {
  const imgSrc =
    movie.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";
  const rating = movie.rating?.average ?? "NETURI";

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <img src="${imgSrc}" alt="nuotrauka">
    <h3>Pavadinimas: ${movie.name}<br>Reitingas: ${rating}</h3>
  `;

  div.addEventListener("click", () => {
    window.location.href = `details.html?filmas=${movie.id}`;
  });

  return div;
}

function getAllShows() {
  statusText.textContent = "Kraunami filmai...";
  fetch(allShowsApi)
    .then((response) => response.json())
    .then((data) => {
      resultsDiv.innerHTML = "";
      data.forEach((movie) => resultsDiv.appendChild(createCard(movie)));
      statusText.textContent = `Užkrauta: ${data.length} filmų`;
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = `Atsiprašome įvyko klaida`;
    });
}

getAllShows();

function runSearch() {
  const value = searchInput.value.trim();

  if (value.length < 2) {
    getAllShows();
    return;
  }

  searchShowsByName(value);
}

searchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  runSearch();
});

searchBtn.addEventListener("click", runSearch);

function searchShowsByName(value) {
  statusText.textContent = "Ieškoma...";
  resultsDiv.innerHTML = "";

  fetch(`${searchShows}${encodeURIComponent(value)}`)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.map((item) => item.show);

      if (movies.length === 0) {
        statusText.textContent = "Nieko nerasta.";
        return;
      }

      movies.forEach((movie) => resultsDiv.appendChild(createCard(movie)));
      statusText.textContent = `Rasta: ${movies.length} filmai`;
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = "Dėje filmų nebuvo rasta.";
    });
}
