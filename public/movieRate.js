console.log('linked to ratings ..');

const img_base_url = 'https://image.tmdb.org/t/p/w154';
const img_base_url1 = 'https://image.tmdb.org/t/p/w780/';

// Function that renders movies in the homepage

const displayMovies = (data) => {
  $('#movies').empty();
  const { results } = data;
  results.forEach((movie) => {
    $.ajax({
      method: 'GET',
      url: `/ratings/movieavgrating/${movie.id}`,
      success: (data) => {
        const output = `  
   <div class ="col-md-3">
    <div class ="well text-center">
    <form method ="post" action="ratings/${movie.id}" >
     <img src ="${img_base_url}${movie.poster_path}">
      <h5>${movie.title}</h5>
      <h4>Rating :${data ? data : 'No ratings yet'}</h4>
      <button onclick ="movieSelected(${
        movie.id
      })" class ="btn btn-primary" id ="movieButton" type ="submit" >Rate this movie </button>
      </form>
      </div>
      </div>
       `;
        $('#movies').append(output);
      },
    });
  });
};

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie';
  return false;
}

function getMovies(searchText) {
  $.getJSON(
    `https://api.themoviedb.org/3/search/movie?api_key=7063359f4e85964f78dd5c2aa4165728&query=${searchText}`
  )
    .then((data) => {
      $('#movies').empty();
      const { results } = data;
      results.forEach((movie) => {
        $.ajax({
          method: 'GET',
          url: `/ratings/movieavgrating/${movie.id}`,
          success: (data) => {
            const output = `  
     <div class ="col-md-3">
      <div class ="well text-center">
      <form method ="post" action="ratings/${movie.id}" >
       <img src ="${img_base_url}${movie.poster_path}">
        <h5>${movie.title}</h5>
        <h4>Rating :${data ? data : 'No ratings yet'}</h4>
        <button onclick ="movieSelected(${
          movie.id
        })" class ="btn btn-primary" id ="movieButton" type ="submit" >Rate this movie </button>
        </form>
        </div>
        </div>
         `;
            $('#movies').append(output);
          },
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

const filterByGenre = () => {
  $('#search-field').val('');
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

$.getJSON(
  'https://api.themoviedb.org/3/movie/top_rated?api_key=7063359f4e85964f78dd5c2aa4165728'
)

  //$.getJSON("https://api.themoviedb.org/3/movie/now_playing?api_key=7063359f4e85964f78dd5c2aa4165728")

  .then((data) => {
    const { results } = data;
    results.forEach((movie) => {
      $.ajax({
        method: 'GET',
        url: `/ratings/movieavgrating/${movie.id}`,
        success: (data) => {
          const output = `  
          <div class="col-md-3" id="${movie.id}">
            <div class ="well text-center">
              <form method ="post" action="ratings/${movie.id}" >
                <img src ="${img_base_url}${movie.poster_path}">
                <h5>${movie.title}</h5>
                <h4>Release date :${movie.release_date}</h4>
                <h4>Rating :${data ? data : 'No ratings yet'}</h4>
                <button onclick ="movieSelected(${
                  movie.id
                })" class ="btn btn-primary" id ="movieButton" type ="submit" >Rate this movie </button>
             </form>
            </div>
          </div>`;
          $('#movies').append(output);
        },
      });
    });
  })

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

// function movieSelected(id) {
//   sessionStorage.setItem('movieId', id);
//   console.log(sessionStorage.getItem('movieId'));
//   $.post(`/ratings/${sessionStorage.getItem('movieId')}`, {
//     data: `${sessionStorage.getItem('movieId')}`,
//     success: true,
//   })
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   window.location = 'ratings';

//   console.log(response.data);
//   return false;
// }
