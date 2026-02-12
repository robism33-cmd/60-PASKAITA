const actorsDiv = document.getElementById("actors");
const statusText = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("filmas"); // svarbu: turi sutapti su index/details linku

function getActors() {
  if (!movieId) {
    statusText.textContent = "";
    actorsDiv.innerHTML = "<p class='error'>Nerastas filmo ID URL'e.</p>";
    return;
  }

  const castUrl = `https://api.tvmaze.com/shows/${movieId}/cast`;

  statusText.textContent = "Kraunami aktoriai...";
  actorsDiv.innerHTML = "";

  fetch(castUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Nepavyko gauti aktorių sąrašo");
      return response.json();
    })
    .then((cast) => {
      if (!cast.length) {
        statusText.textContent = "";
        actorsDiv.innerHTML = "<p class='error'>Aktorių nerasta.</p>";
        return;
      }

      cast.forEach((item) => {
        const actor = item.person;
        const character = item.character;

        const imgSrc =
          actor.image?.medium ||
          "https://via.placeholder.com/210x295?text=No+Image";

        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${imgSrc}" alt="${actor.name}">
          <h3>${actor.name}</h3>
          <p>Vaidmuo: ${character?.name ?? "N/A"}</p>
        `;

        actorsDiv.appendChild(div);
      });

      statusText.textContent = `Rasta aktorių: ${cast.length}`;
    })
    .catch((error) => {
      console.log(error);
      statusText.textContent = "";
      actorsDiv.innerHTML =
        "<p class='error'>Įvyko klaida gaunant aktorius.</p>";
    });
}

getActors();
