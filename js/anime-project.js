'use strict';

$(document).ready(() => {


    // fetch(`https://api.themoviedb.org/3/movie/436270?api_key=${apiKeyTMDP}`)
    //     .then(response => response.json())
    //     .then(response => console.log('fight club', response))
    //     .catch(err => console.error(err));
    //
    // fetch(`https://api.themoviedb.org/3/discover/movie?api_key=54951791afdc95528d883865dd7c21cd&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


    function movieSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${input}&include_adult=false`)
            .then(response => response.json())
            .then(response => console.log('Search Results', response))
            .catch(err => console.error(err));
    }

    function tvSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKeyTMDP}&language=en-US&page=1&query=${input}&include_adult=false`)


            .then(response => response.json())
            .then(response => console.log('Search Results', response))
            .catch(err => console.error(err));
    }



    $('#movieSearchButton').click(function(){
        movieSearch($('#movieSearchInput').val());
    })

})