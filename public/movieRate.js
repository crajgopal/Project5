
console.log("linked to ratings ..")

const img_base_url = "https://image.tmdb.org/t/p/w154"
const img_base_url1 = "https://image.tmdb.org/t/p/w780/"
  $.getJSON("https://api.themoviedb.org/3/movie/top_rated?api_key=7063359f4e85964f78dd5c2aa4165728")

  //$.getJSON("https://api.themoviedb.org/3/movie/now_playing?api_key=7063359f4e85964f78dd5c2aa4165728")
  
  .then((data)=>{
  
    const {results}= data
    console.log(results)
    let output ='';

    results.forEach(movie=> {


      output+=`  
      <div class ="col-md-3">
       <div class ="well text-center">
        <img src ="${img_base_url}${movie.poster_path}">
         <h5>${movie.title}</h5>
         <h4>Popularity :${movie.popularity}</h4>
         <h4>Release date :${movie.release_date}</h4>
         <h4>Rating :${movie.vote_average}</h4>
         Your rating  :<div class="form-group"><form class="form-inline mr-auto" target="_self" id ="ratingForm">
         <input class="form-control search-field" type="text" name="rating" id="rating-field" placeholder="/5"> <button class ="btn btn-light action-button" role ="button">Submit</button>
         </div>
         </div>
         </div>
              `

            })   
      $("#topratedmovies").html(output)


 

  })
  

  
  .catch((error)=>{
    console.log(error)
  })
  