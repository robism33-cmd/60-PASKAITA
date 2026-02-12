const actorsDiv = document.getElementById("actors");
const statusText = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("filmas");

if (!movieId) {
  statusText.textContent = "";
  actorsDiv.innerHTML = "<p class='error'>Filmo ID nerastas URL'e.</p>";
} else {
  loadActors();
}

function loadActors() {
  statusText.textContent = "Kraunami aktoriai...";
  actorsDiv.innerHTML = "";

  fetch(`https://api.tvmaze.com/shows/${movieId}/cast`)
    .then((r) => r.json())
    .then((cast) => {
      actorsDiv.innerHTML = "";

      if (!cast.length) {
        statusText.textContent = "";
        actorsDiv.innerHTML = "<p class='error'>Aktorių nerasta.</p>";
        return;
      }

      cast.forEach((item) => {
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
          <p>Vaidmuo: ${character?.name ?? "N/A"}</p>
        `;
        actorsDiv.appendChild(div);
      });

      statusText.textContent = `Rasta aktorių: ${cast.length}`;
    })
    .catch((e) => {
      console.log(e);
      statusText.textContent = "";
      actorsDiv.innerHTML =
        "<p class='error'>Nepavyko gauti aktorių sąrašo.</p>";
    });
}
