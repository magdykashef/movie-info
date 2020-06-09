// inner
$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    e.preventDefault();
    let searchText = $('#searchText').val();
    getMovies(searchText);
  });
  getMovie();
});

function getApiKey(){
  if(sessionStorage.getItem('api') && ($('#apiKey').val().length == 0)){
    let api = sessionStorage.getItem('api')
    $('#apiKey').attr("placeholder", api);
    return api;
  }
  else if(! (sessionStorage.getItem('api') ) && ($('#apiKey').val().length == 0)){
    console.log("You Have to Enter API KEY");
  }
  else{
    let apiValue = $('#apiKey').val();
    sessionStorage.setItem('api', apiValue);
    let api = sessionStorage.getItem('api');
    $('#apiKey').attr("placeholder", api);
    return api;
    }
  return api;  
  }

function getMovies(searchText) {
  axios.get('http://www.omdbapi.com/?s='+ searchText +'&apikey='+ getApiKey())
  .then((response) => {
    console.log(response);
    let movies = response.data.Search;
    let output = '';
    $.each(movies, (index, movie) => {
      output += `
        <div class="col-md-3">
          <div class="well text-center">
            <img src="${movie.Poster}">
            <h5>${movie.Title}</h5>
            <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
          </div>
        </div>
      `;
    });
    $('#movies').html(output);
  })
  .catch((err) => {
    console.log(err);
  });
}


function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');
  let sessionApi = sessionStorage.getItem('api');
  $('#apiKey').attr("placeholder", sessionApi);
  //api='1b234b56';
  axios.get('http://www.omdbapi.com/?i='+ movieId + '&apikey='+ sessionApi)
    .then((response) => {
      console.log(response);
      let movie = response.data;
      let output = `
          <div class="col-3 m-auto ">
            <img id="poster" src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="offset-2 col-6 mx-auto">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Plot:</strong> ${movie.Plot}</li>
            </ul>
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="movie.html" class="btn btn-default">Go Back To Search</a>
        </div>
      `;
      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}