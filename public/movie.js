

const img_base_url = "https://image.tmdb.org/t/p/w154"
const img_base_url1 = "https://image.tmdb.org/t/p/w342/"



$(document).ready(()=>{
       getMovie()

})


function getMovie(){
    let movieId =sessionStorage.getItem('movieId')
   console.log("In getMovie"+movieId)
    $.getJSON("https://api.themoviedb.org/3/movie/"+movieId+"?api_key=7063359f4e85964f78dd5c2aa4165728")
  
  .then((movie)=>{
    console.log(movie.overview)
    
  
    
   let output =`
   <div class ="row">
    <div class =" col-md-4">
     <img src ="${img_base_url1}${movie.poster_path}" class ="thumbnail">
     </div>
     <div class ="col-md-8">
     <h2>     Title  :${movie.title}</h2>
    <ul class ="list-group">
     <li class ="list-group-item"> <strong>Synopsis : </strong>${movie.overview}</li>
     <li class ="list-group-item"> <strong>Rating : </strong>${movie.vote_average}</li>
     <li class ="list-group-item"> <strong>Vote Count : </strong>${movie.vote_count}</li>
     <li class ="list-group-item"> <strong>Release Date : </strong>${movie.release_date}</li>
     <li class ="list-group-item"> <strong>Revenue : </strong>${movie.revenue}</li>
     </ul>
      </div>
      </div>
       `
       $("#movieinfo").html(output)
  
  
  
    })
    .catch((error)=>{
  console.log(error)
    })  
  }
  