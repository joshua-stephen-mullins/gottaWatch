'use strict';

$(document).ready(() => {
    onLoad();

    function onLoad() {
        loadPopular('movie', '#popularMovieResults');
        loadPopular('tv', '#popularTVResults');
    }

    function loadPopular(showType, location) {
        fetch(`https://api.themoviedb.org/3/${showType}/popular?api_key=${apiKeyTMDP}&language=en-US&page=1`)
            .then(response => response.json())
            .then((response) => {
                console.log(`Results ${showType}`, response);
                generateSmallCards(response, 5, location, showType);
            })
            .catch(err => console.error(err));
    }

    function allSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${input}&include_adult=false`)
            .then(response => response.json())
            // .then(response => console.log('Search Results', response))
            .then(response => {
                console.log('Search Results', response);
                filterSearchData(response);
            })
            .catch(err => console.error(err));
    }

    function filterSearchData(data) {
        console.log(data);
        let filteredData = [];
        let movieCounter = 0;
        let tvCounter = 0;
        let personCounter = 0;
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].media_type === 'movie') {
                movieCounter += 1;
            } else if (data.results[i].media_type === 'tv') {
                tvCounter += 1;
            } else if (data.results[i].media_type === 'person') {
                personCounter += 1;
            }
        }
        for (let i = 0; i < data.results.length; i++) {
            if ($('input[name=filterRadio]:checked').val() === 'all') {
                filteredData.push(data.results[i]);
            } else if (data.results[i].media_type === $('input[name=filterRadio]:checked').val()) {
                filteredData.push(data.results[i]);
            }
        }
        generateSearchResults(filteredData);
        $(`#numberMovieResults`).html(movieCounter);
        $(`#numberTVResults`).html(tvCounter);
        $(`#numberPeopleResults`).html(personCounter);
    }

    $('.filterBtn').click(function (e) {
        console.log($('input[name=filterRadio]:checked').val());
        allSearch($('#movieSearchInput').val())
    })

    $('#movieSearchButton').click(function (e) {
        e.preventDefault();
        $('#homePage').addClass('d-none');
        $('#searchResults').removeClass('d-none');
    })
    $('#homeButton').click((e) => {
        $('#homePage').removeClass('d-none');
        $('#searchResults').addClass('d-none');
    })
    $('#movieSearchInputButton').click(function (e) {
        e.preventDefault();
        $('#resultsContainer').html('');
        allSearch($('#movieSearchInput').val());
    })

    function searchById(searchType, id) {
        console.log(searchType);
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                console.log(data);
                moreInfo(data, searchType, id);
            })
            .catch(err => console.error(err));
    }

    function generateSearchResults(data) {
        console.log(data);
        $(`#resultsContainer`).html('');
        for (let i = 0; i < data.length; i++) {
            $('#resultsContainer').append(`
                <div class="card col-12 searchResultCard rounded border-1 border-primary bg-primary m-3 row flex-row" id="searchResult_${data[i].id}" data-bs-toggle="modal" data-bs-target="#moreInfoModal">
                    <div class="col-2 p-0">
                        <img class="col-12" src="https://image.tmdb.org/t/p/original/${data[i].poster_path}" alt=""Search Result>
                    </div>
                    <div class="col-10">
                        <h3 class="searchResultTitle_${data[i].id}"></h3>
                        <h5><span class="searchResultDate_${data[i].id}"></span></h5>
                        <p><span class="searchResultOverview_${data[i].id}"></span></p>
                    </div>
                </div>
            `)
            if (data[i].hasOwnProperty('title')) {
                $(`.searchResultTitle_${data[i].id}`).html(data[i].title)
            } else {
                $(`.searchResultTitle_${data[i].id}`).html(data[i].name)
            }
            if (data[i].hasOwnProperty('release_date')) {
                $(`.searchResultDate_${data[i].id}`).html(data[i].release_date)
            } else {
                $(`.searchResultDate_${data[i].id}`).html(data[i].first_air_date);
            }
            if (data[i].hasOwnProperty('overview')) {
                if (data[i].overview.length > 310) {
                    $(`.searchResultOverview_${data[i].id}`).html(data[i].overview.slice(0, 310) + "...");
                } else {
                    $(`.searchResultOverview_${data[i].id}`).html(data[i].overview);
                }
            }
            $(`#searchResult_${data[i].id}`).click(() => searchById(data[i].media_type, data[i].id));
        }
    }

    function moreInfo(data, searchType, id) {
        if (data.hasOwnProperty('title')) {
            $(`#moreInfoTitle`).html(data.title)
        } else {
            $(`#moreInfoTitle`).html(data.name)
        }
        $('#moreInfoPoster').attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`);
        $('#moreInfoOverview').html(data.overview);
        if (data.hasOwnProperty('release_date')) {
            $(`#moreInfoYear`).html("(" + data.release_date.slice(0, 4) + ")")
        } else {
            $(`#moreInfoYear`).html("(" + data.last_air_date.slice(0, 4) + ")")
        }
        $('#listAddBtn').val(data.id);
        $('#moreInfoGenre').html('');
        $('#moreInfoCast').html('');
        $('#moreInfoDirector').html('');
        for (let i = 0; i < data.genres.length; i++) {
            if (i === (data.genres.length - 1)) {
                $('#moreInfoGenre').append(`${data.genres[i].name}`)
            } else {
                $('#moreInfoGenre').append(data.genres[i].name + ', &nbsp;')
            }
        }
        if (data.hasOwnProperty('runtime')) {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.runtime))
        } else {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.last_episode_to_air.runtime))
        }
        if (searchType === 'movie') {
            fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKeyTMDP}`)
                .then(response => response.json())
                // .then(response => console.log('Results by id', response)
                .then((data) => {
                    console.log(data);
                    data.results.forEach(function (country) {
                        if (country.iso_3166_1 === "US") {
                            country.release_dates.forEach(function (result) {
                                if (result.certification !== '') {
                                    $('#moreInfoRating').html(result.certification);
                                }
                            })
                        }
                    })
                })
        } else {
            fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${apiKeyTMDP}&language=en-US`)
                .then(response => response.json())
                // .then(response => console.log('Results by id', response)
                .then((data) => {
                    data.results.forEach(function (country) {
                        if (country.iso_3166_1 === "US") {
                            $('#moreInfoRating').html(country.rating);
                        }
                    })
                })
        }
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}/credits?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                // console.log(data);
                data.crew.forEach(function (person) {
                    if (person.job === "Director") {
                        $(`#moreInfoDirector`).append(person.name)
                    }
                })
                if (data.cast.length > 5) {
                    for (let i = 0; i < 5; i++) {
                        if (data.cast[i] === data.cast[4]) {
                            $(`#moreInfoCast`).append(data.cast[i].name)
                        } else {
                            $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`)
                        }
                    }
                } else {
                    for (let i = 0; i < data.cast.length; i++) {
                        if (data.cast.indexOf(data.cast[i]) === data.cast.length - 1) {
                            $(`#moreInfoCast`).append(data.cast[i].name)
                        } else {
                            $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`)
                        }
                    }
                }
            })
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                console.log(data);
            })
    }


    function generateSmallCards(showInfo, numberOfCards, container, showType) {
        for (let i = 0; i < numberOfCards; i++) {
            $(container).append(`
                <div class="card border-1 border-light p-0 text-white bg-primary m-3 mb-3 smallCard" id="showCard_${showInfo.results[i].id}" data-type="${showType}" data-showId="${showInfo.results[i].id}">
                    <div class="">
                        <img class="w-100 h-100" src="https://image.tmdb.org/t/p/original/${showInfo.results[i].poster_path}" alt="Poster" data-bs-toggle="modal" data-bs-target="#moreInfoModal">
                    </div>
                    <div class="card-footer">
                        <h5><span id="resultTitle_${showInfo.results[i].id}"></span> <span class="text-muted" id="resultDate_${showInfo.results[i].id}"></span></h5>
                        <p><span class="badge bg-danger" id="smallCardRating_${showInfo.results[i].id}"></span> <span id="previewGenre_${showInfo.results[i].id}"></span></p>
                    </div>
                </div>
            `);
            if (showInfo.results[i].hasOwnProperty('title')) {
                $(`#resultTitle_${showInfo.results[i].id}`).html(showInfo.results[i].title)
            } else {
                $(`#resultTitle_${showInfo.results[i].id}`).html(showInfo.results[i].name)
            }
            $(`#showCard_${showInfo.results[i].id}`).click(() => {
                searchById(showType, showInfo.results[i].id);
            })
            if (showInfo.results[i].hasOwnProperty('release_date')) {
                $(`#resultDate_${showInfo.results[i].id}`).html("(" + showInfo.results[i].release_date.slice(0, 4) + ")")
            } else {
                $(`#resultDate_${showInfo.results[i].id}`).html("(" + showInfo.results[i].first_air_date.slice(0, 4) + ")")
            }
            for (let j = 0; j < showInfo.results[i].genre_ids.length; j++) {
                if (j === (showInfo.results[i].genre_ids.length - 1)) {
                    $(`#previewGenre_${showInfo.results[i].id}`).append(genreIdToText(showInfo.results[i].genre_ids[j]))
                } else {
                    $(`#previewGenre_${showInfo.results[i].id}`).append(genreIdToText(showInfo.results[i].genre_ids[j]) + ', &nbsp;')
                }
            }
            if (showInfo.results[i].hasOwnProperty('title')) {
                fetch(`https://api.themoviedb.org/3/movie/${showInfo.results[i].id}/release_dates?api_key=${apiKeyTMDP}`)
                    .then(response => response.json())
                    // .then(response => console.log('Results by id', response)
                    .then((data) => {
                        data.results.forEach(function (country) {
                            if (country.iso_3166_1 === "US") {
                                country.release_dates.forEach(function (result) {
                                    if (result.certification !== '') {
                                        $(`#smallCardRating_${showInfo.results[i].id}`).html(result.certification);
                                    }
                                })
                            }
                        })
                    })
            } else {
                fetch(`https://api.themoviedb.org/3/tv/${showInfo.results[i].id}/content_ratings?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    // .then(response => console.log('Results by id', response)
                    .then((data) => {
                        data.results.forEach(function (country) {
                            if (country.iso_3166_1 === "US") {
                                $(`#smallCardRating_${showInfo.results[i].id}`).html(country.rating);
                            }
                        })
                    })
            }
        }
    }

    function toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
        } else
            return ` ${minutes}m`;
    }

    function genreIdToText(id) {
        let genres = [
            {id: 28, name: 'Action'},
            {id: 12, name: 'Adventure'},
            {id: 16, name: 'Animation'},
            {id: 35, name: 'Comedy'},
            {id: 80, name: 'Crime'},
            {id: 99, name: 'Documentary'},
            {id: 18, name: 'Drama'},
            {id: 10751, name: 'Family'},
            {id: 14, name: 'Fantasy'},
            {id: 36, name: 'History'},
            {id: 27, name: 'Horror'},
            {id: 10402, name: 'Music'},
            {id: 9648, name: 'Mystery'},
            {id: 10749, name: 'Romance'},
            {id: 878, name: 'Science Fiction'},
            {id: 10770, name: 'TV Movie'},
            {id: 53, name: 'Thriller'},
            {id: 10752, name: 'War'},
            {id: 37, name: 'Western'},
            {id: 10759, name: 'Action & Adventure'},
            {id: 16, name: 'Animation'},
            {id: 35, name: 'Comedy'},
            {id: 80, name: 'Crime'},
            {id: 99, name: 'Documentary'},
            {id: 18, name: 'Drama'},
            {id: 10751, name: 'Family'},
            {id: 10762, name: 'Kids'},
            {id: 9648, name: 'Mystery'},
            {id: 10763, name: 'News'},
            {id: 10764, name: 'Reality'},
            {id: 10765, name: 'Sci-Fi & Fantasy'},
            {id: 10766, name: 'Soap'},
            {id: 10767, name: 'Talk'},
            {id: 10768, name: 'War & Politics'},
            {id: 37, name: 'Western'}
        ];
        for (let i = 0; i < genres.length; i++) {
            if (id === genres[i].id) {
                return genres[i].name;
            }
        }
    }
})
