const apiUrl = "http://localhost:3000/films";
const movieList = document.getElementById("movieList");
const form = document.getElementById("form");

let name = document.getElementById("name");
let image = document.getElementById("image");
let genre = document.getElementById("genre");
let note = document.getElementById("note");
let watched = document.getElementById("watched");

let edition = false;
let filmId = null;

form.style.display = "none";

const getFilms = async () => {
  const response = await fetch("http://localhost:3000/films");
  const films = await response.json();
  films.map((film) => {
    movieList.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card text-white bg-dark mb-3" style="width: 251px; margin-left: 10px;">
        <img src="${film.image}" class="img-fluid" alt="${
        film.name
      }" style="height: 300px; width: 250px;">
        <div class="card-body">
          <h5 class="card-title">${film.name}</h5>
          <p class="card-text">Gênero: ${film.genre}</p>
          <span class="badge bg-primary">nota: ${film.note}</span>
          <p class="card-text">Assistido: ${film.watched ? "✅" : "❌"}</p>
          <div>
            <button class="btn btn-primary" onclick="editionFilm('${
              film.id
            }')">Editar</button>
            <button class="btn btn-danger" onclick="deleteFilm('${
              film.id
            }')">Excluir</button>
            <button class="btn btn-success" onclick="updateStatus('${
              film.id
            }')" style="margin-top: 5px;">Atualizar Status</button>
          </div>
        </div>
      </div>
      `
    );
  });
};

const registration = (event) => {
  event.preventDefault();
  form.style.display = "flex";
};

const submitForm = async (event) => {
  event.preventDefault();

  const film = {
    name: name.value,
    image: image.value,
    genre: genre.value,
    note: note.value,
    watched: false,
  };

  if (edition) {
    putFilm(filmId, film);
  } else {
    createFilm(film);
  }

  clearFields();
  movieList.innerHTML = "";
};

const createFilm = async (film) => {
  const request = new Request(`${apiUrl}/registration`, {
    method: "POST",
    body: JSON.stringify(film),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const response = await fetch(request);
  const result = await response.json();
  alert(result.msg);
  form.style.display = "none";
  getFilms();
};

const editionFilm = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`);
  const film = await response.json();

  name.value = film.name;
  image.value = film.image;
  genre.value = film.genre;
  note.value = film.note;

  edition = true;
  filmId = film.id;
  form.style.display = "flex";
};

const putFilm = async (id, film) => {
  const request = new Request(`${apiUrl}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(film),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const response = await fetch(request);
  const result = await response.json();
  alert(result.msg);
  edition = false;
  filmId = null;
  form.style.display = "none";
  getFilms();
};

const deleteFilm = async (id) => {
  const request = new Request(`${apiUrl}/delete/${id}`, {
    method: "DELETE",
  });
  const response = await fetch(request);
  const result = await response.json();
  alert(result.msg);
  clearFields();
  movieList.innerHTML = "";
  getFilms();
};

const getFilmId = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`);
  return await response.json();
};

const cancel = () => {
  clearFields();
  movieList.style.display = "none";
};

const updateStatus = async (id) => {
  let film = await getFilmId(id);
  if (film.watched) {
    film.watched = false;
  } else {
    film.watched = true;
  }
  const request = new Request(`${apiUrl}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(film),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  alert("Status alterado");
  const response = await fetch(request);
  movieList.innerHTML = "";
  getFilms();
};

const clearFields = () => {
  name.value = "";
  image.value = "";
  genre.value = "";
  note.value = "";
};

getFilms();
