const movies_display = document.getElementById("movies_display");
const addMovieModal = document.getElementById("addMovieModal");

async function getMoviesFromAPI() {
  const response = await fetch(
    "https://whispering-stream-19572.herokuapp.com/movies"
  );

  const movies = await response.json();
  movies.forEach(movie => {
    let markup = `
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
                <ul>
                    <li>${movie.year}</li>
                    <li>${movie.genre}</li>
                    <li>${movie.director}</li>
                    <li>${movie.actors}</li>
                </ul>
            </p>
        </div>
        <div class="card-footer">
                ${movie.genre
                  .map(
                    genre =>
                      `<span class="badge badge-pill badge-primary m-1">${genre}</span>`
                  )
                  .join("")}
        </div>
        <div class="card-footer">
                <button class="btn btn-danger w-100 deleteMovie" data-movieid="${
                  movie._id
                }">Delete Movie</button>
        </div>
    `;

    let card = document.createElement("div");
    card.classList.add("card");
    card.style.minWidth = "30%";
    card.style.maxWidth = "30%";
    card.style.marginBottom = "5px";
    card.innerHTML = markup;
    movies_display.appendChild(card);
  });
}

async function postMovieToAPI(event) {
  event.preventDefault();

  const movieTitle = document.getElementById("movieTitle").value;
  const releaseYear = document.getElementById("movieYear").value;
  const movieGenre = document.getElementById("movieGenre").value;
  const movieDirector = document.getElementById("movieDirector").value;

  const genreArr = movieGenre.split(",").map(genre => genre.trim());

  const requestBody = {
    title: movieTitle,
    year: releaseYear,
    genre: genreArr,
    director: movieDirector
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  };

  const response = await fetch(
    "https://whispering-stream-19572.herokuapp.com/movies",
    options
  );

  const responseJson = await response.json();
  console.log(responseJson);

  $("#addMovieModal").modal("toggle");
  $("#movies_display").html("");
  getMoviesFromAPI();
}

async function deleteMovieFromAPI() {
  const movieid = $(this).data("movieid");
  await fetch(
    `https://whispering-stream-19572.herokuapp.com/movies/${movieid}`,
    {
      method: "DELETE"
    }
  );

  $("#movies_display").html("");
  getMoviesFromAPI();
}

getMoviesFromAPI();

const addMovieForm = document.getElementById("add-movie-form");

addMovieForm.addEventListener("submit", postMovieToAPI);

$("#movies_display").on("click", ".deleteMovie", deleteMovieFromAPI);
