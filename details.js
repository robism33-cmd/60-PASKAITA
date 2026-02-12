const detailsDiv = document.getElementById("details");
const actorsDiv = document.getElementById("actors");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("filmas");

const api = "https://api.tvmaze.com/shows/";

if (!movieId) {
  detailsDiv.innerHTML = "<p class='error'>Filmo ID nerastas.</p>";
} else {
  loadMovieDetails();
  loadActors();
}

// ================= FILMO INFO =================
function loadMovieDetails() {
  detailsDiv.innerHTML = "<p class='loading'>Kraunama informacija...</p>";

  fetch(`${api}${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      const rating = data.rating?.average ?? "Nėra";
      const summary = data.summary ?? "Aprašymo nėra.";

      detailsDiv.innerHTML = `
        <h1>${data.name}</h1>
        <p><strong>Reitingas:</strong> ${rating}</p>
        <div class="summary">${summary}</div>
      `;
    })
    .catch(() => {
      detailsDiv.innerHTML =
        "<p class='error'>Nepavyko gauti filmo informacijos.</p>";
    });
}

// ================= AKTORIAI =================
function loadActors() {
  actorsDiv.innerHTML = "<p class='loading'>Kraunami aktoriai...</p>";

  fetch(`${api}${movieId}/cast`)
    .then((response) => response.json())
    .then((data) => {
      actorsDiv.innerHTML = "";

      if (data.length === 0) {
        actorsDiv.innerHTML = "<p>Nėra aktorių informacijos.</p>";
        return;
      }

      data.slice(0, 12).forEach((item) => {
        const actor = item.person;
        const character = item.character;

        const img =
          actor.image?.medium ||
          "https://via.placeholder.com/210x295?text=No+Image";

        const div = document.createElement("div");
        div.className = "actor-card";

        div.innerHTML = `
          <img src="${img}" alt="${actor.name}">
          <h3>${actor.name}</h3>
          <p>Vaidmuo: ${character?.name ?? "Nežinomas"}</p>
        `;

        actorsDiv.appendChild(div);
      });
    })
    .catch(() => {
      actorsDiv.innerHTML =
        "<p class='error'>Nepavyko gauti aktorių sąrašo.</p>";
    });
}
