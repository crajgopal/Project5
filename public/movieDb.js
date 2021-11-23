const img_base_url = 'https://image.tmdb.org/t/p/w154';
const img_base_url1 = 'https://image.tmdb.org/t/p/w500/';

// Function that renders movies in the homepage

const displayMovies = (data) => {
  const { results } = data;
  let output = '';
  results.forEach((movie) => {
    output += `  
   <div class ="col-md-3">
    <div class ="well text-center">
     <img src ="${img_base_url}${movie.poster_path}">
      <h5>${movie.title}</h5>
      <h4>Rating :${movie.vote_average}</h4>
      <form  method ="post" action="/movie" onclick ="movieSelected(${movie.id})" class ="btn btn-primary" id ="movieButton" type ="submit" >Movie Details</form>
      </div>
      </div>
       `;
  });
  $('#movies').html(output);
};

// Function that fetches movies filtered by selected genre from The MovieDB

const filterByGenre = () => {
  const selectedGenres = [];
  $('#genre-checkboxes-container input[type=checkbox]:checked').each((i, v) => {
    selectedGenres.push($(v).attr('id'));
  });
  const genreQueryString = selectedGenres.join('|');

  $.getJSON(
    `https://api.themoviedb.org/3/discover/movie?api_key=7063359f4e85964f78dd5c2aa4165728&with_genres=${genreQueryString}`
  )
    .then((data) => {
      displayMovies(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

function getMovies(searchText) {
  $.getJSON(
    `https://api.themoviedb.org/3/search/movie?api_key=7063359f4e85964f78dd5c2aa4165728&query=${searchText}`
  )
    .then((data) => {
      const { results } = data;
      let output = '';
      results.forEach((movie) => {
        output += `  
     <div class ="col-md-3">
      <div class ="well text-center">
       <img src ="${img_base_url}${movie.poster_path}">
        <h5>${movie.title}</h5>
        <h4>Rating :${movie.vote_average}</h4>
        <form  method ="post" action="/movie" onclick ="movieSelected(${movie.id}) ;getMovie()" class ="btn btn-primary" id ="movieButton" type ="submit" >Movie Details</form>
        </div>
        </div>
         `;
      });
      $('#movies').empty();

      $('#movies1').html(output);
    })
    .catch((error) => {
      console.log(error);
    });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie';
  return false;
}

$.getJSON(
  'https://api.themoviedb.org/3/discover/movie?api_key=7063359f4e85964f78dd5c2aa4165728'
)
  .then((data) => displayMovies(data))
  .catch((error) => {
    console.log(error);
  });

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    e.preventDefault();
    let searchText = $('#search-field').val();
    $('#genre-checkboxes-container input[type=checkbox]:checked').prop(
      'checked',
      false
    );
    getMovies(searchText);
  });
});

// Fetches existing movie genres from The MovieDB and append them as checkboxes to the navbar genre filter list

$.getJSON(
  'https://api.themoviedb.org/3/genre/movie/list?api_key=7063359f4e85964f78dd5c2aa4165728'
)
  .then((genresData) => {
    genresData.genres.forEach((genreObj) => {
      $('#genre-checkboxes-container').append(
        `
      <li>
        <div class="form-check">
          <input id="${genreObj.id}" class="form-check-input" type="checkbox" value="" onchange="filterByGenre()">
          <label class="form-check-label" for="${genreObj.id}">
            ${genreObj.name}
          </label>
        </div>
      </li>
      `
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });