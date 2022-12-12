'use strict';

$(document).ready(() => {
    onLoad();

    function onLoad(){
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKeyTMDP}`)
        .then(response => response.json())
        // .then(response => console.log('Results', response))
        .then((response) => generateSmallCards(response, 5, '#trendingResults'))
        .catch(err => console.error(err));
    }

    function allSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${input}&include_adult=false`)
            .then(response => response.json())
            .then(response => console.log('Search Results', response))
            .catch(err => console.error(err));
    }

    $('#movieSearchButton').click(function(){
        allSearch($('#movieSearchInput').val());
    })


    function searchById(searchType, id) {
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                console.log(data);
                if (data.hasOwnProperty('title')){
                    $(`#moreInfoTitle`).html(data.title)
                } else {
                    $(`#moreInfoTitle`).html(data.name)
                }
                $('#moreInfoPoster').attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`);
                $('#moreInfoOverview').html(data.overview);
                // $('#moreInfoYear').html(data);
            })
            .catch(err => console.error(err));
    }

    function generateSmallCards(showInfo, numberOfCards, container){
        for (let i = 0; i < numberOfCards; i++){
            $(container).append(`
                <div class="card text-white bg-primary mb-3 col-2" id="showCard${i}" data-type="${showInfo.results[i].media_type} data-showId="${showInfo.results[i].id}">
                    <div class="">
                        <button data-bs-toggle="modal" data-bs-target="#moreInfoModal"><img class="w-100 h-100" src="https://image.tmdb.org/t/p/original/${showInfo.results[i].poster_path}" alt="Poster"></button>
                    </div>
                    <div class="card-footer">
                        <h5><span id="resultTitle_${showInfo.results[i].id}"></span></h5>
                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                          <input type="radio" class="btn-check " name="btnradio" id="btnradio1" autocomplete="off" checked="">
                          <label class="btn btn-outline-danger fs-3" for="btnradio1"><i class="fa-solid fa-fire"></i></label>
                          <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked="">
                          <label class="btn btn-outline-danger fs-3" for="btnradio2"><i class="fa-solid fa-eye"></i></label>
                        </div>
                    </div>
                </div>
            `);
                if (showInfo.results[i].hasOwnProperty('title')){
                    $(`#resultTitle_${showInfo.results[i].id}`).html(showInfo.results[i].title)
                } else {
                    $(`#resultTitle_${showInfo.results[i].id}`).html(showInfo.results[i].name)
                }
            $(`#showCard${i}`).click(() => {
                searchById(showInfo.results[i].media_type, showInfo.results[i].id);
            })
        }
    }
})


// backdrop_path
//     :
//     "/ypFD4TJ3nLJesou76V59CnweaT0.jpg"
// genre_ids
//     :
//     (4) [28, 53, 36, 18]
// id
//     :
//     715931
// media_type
//     :
//     "movie"
// original_language
//     :
//     "en"
// original_title
//     :
//     "Emancipation"
// overview
//     :
//     "Inspired by the gripping true story of a man who would do anything for his family—and for freedom. When Peter, an enslaved man, risks his life to escape and return to his family, he embarks on a perilous journey of love and endurance."
// popularity
//     :
//     42.095
// poster_path
//     :
//     "/s9sUK1vAaOcxJfKzNTszrNkPhkH.jpg"
// release_date
//     :
//     "2022-12-02"
// title
//     :
//     "Emancipation"
// video
//     :
//     false
// vote_average
//     :
//     6.8
// vote_count
//     :
//     7