console.log('linked to ratings ..');

const img_base_url = 'https://image.tmdb.org/t/p/w154';
const img_base_url1 = 'https://image.tmdb.org/t/p/w780/';
$.getJSON(
  'https://api.themoviedb.org/3/movie/top_rated?api_key=7063359f4e85964f78dd5c2aa4165728'
)

  //$.getJSON("https://api.themoviedb.org/3/movie/now_playing?api_key=7063359f4e85964f78dd5c2aa4165728")

  .then((data) => {
    const { results } = data;
    console.log(results);
    let output = '';

    results.forEach((movie) => {
      output += `  
      <div class ="col-md-3">
       <div class ="well text-center">
        <form  method ="post" action="ratings/${movie.id}" >
        <img src ="${img_base_url}${movie.poster_path}">
         <h5>${movie.title}</h5>
         <h4>Release date :${movie.release_date}</h4>
         <h4>Rating :${movie.vote_average}</h4>
         <button onclick ="movieSelected(${movie.id})" class ="btn btn-primary" id ="movieButton" type ="submit" >Rate this movie </button></form>

         </div>
         </div>
         </div>
              `;
    });
    $('#movies').html(output);
  })

  .catch((error) => {
    console.log(error);
  });

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  console.log(sessionStorage.getItem('movieId'));
  $.post(`/ratings/${sessionStorage.getItem('movieId')}`, {
    data: `${sessionStorage.getItem('movieId')}`,
    success: true,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  window.location = 'ratings';

  console.log(response.data);
  return false;
}
