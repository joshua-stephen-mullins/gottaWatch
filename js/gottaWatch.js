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

    $('.filterBtn').click(function () {
        console.log($('input[name=filterRadio]:checked').val());
        allSearch($('#movieSearchInput').val())
    })

    $('#movieSearchButton').click(function (e) {
        e.preventDefault();
        $('#homePage').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#searchResults').removeClass('d-none');
    })
    $('#homeButton').click(() => {
        $('#homePage').removeClass('d-none');
        $('#searchResults').addClass('d-none');
        $('#listsPage').addClass('d-none');
    })
    $('#movieSearchInputButton').click(function (e) {
        e.preventDefault();
        $('#resultsContainer').html('');
        allSearch($('#movieSearchInput').val());
    })
    $('#listsButton').click((e) => {
        e.preventDefault();
        populateListsHome();
        $('#homePage').addClass('d-none');
        $('#searchResults').addClass('d-none');
        $('#listsPage').removeClass('d-none');
    })
    $('#submitNewList').submit(function () {
        createNewList();
    })
    $('#createNewListButton').click(function () {
        $('#listCreateName').html('');
        $('#listCreateDesc').html('');
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
                        <img class="col-12" src="" id="searchResult_${i}" alt=""Search Result>
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
            if (data[i].hasOwnProperty('poster_path')) {
                $(`#searchResult_${i}`).attr('src', `https://image.tmdb.org/t/p/original/${data[i].poster_path}`);
            } else if (data[i].hasOwnProperty('profile_path')) {
                $(`#searchResult_${i}`).attr('src', `https://image.tmdb.org/t/p/original/${data[i].profile_path}`);
            }
            (data[i].hasOwnProperty('release_date')) ? $(`.searchResultDate_${data[i].id}`).html(data[i].release_date) : $(`.searchResultDate_${data[i].id}`).html(data[i].first_air_date);
            if (data[i].hasOwnProperty('overview')) {
                (data[i].overview.length > 310) ? $(`.searchResultOverview_${data[i].id}`).html(data[i].overview.slice(0, 310) + "...") : $(`.searchResultOverview_${data[i].id}`).html(data[i].overview);
            }
            if (data[i].hasOwnProperty('biography')) {
                (data[i].biography.length > 310) ? $(`.searchResultOverview_${data[i].id}`).html(data[i].biography.slice(0, 310) + "...") : $(`.searchResultOverview_${data[i].id}`).html(data[i].biography);
            }
            $(`#searchResult_${data[i].id}`).click(() => searchById(data[i].media_type, data[i].id));
        }
    }

    function moreInfo(data, searchType, id) {
        $(`#moreInfoOverview`).html('');
        $('#moreInfoGenre').html('');
        $('#moreInfoCast').html('');
        $('#moreInfoDirector').html('');
        $('#addListList').html("");

        (data.hasOwnProperty('title')) ? $(`#moreInfoTitle`).html(data.title) : $(`#moreInfoTitle`).html(data.name);
        if (data.hasOwnProperty('poster_path')) {
            $('#moreInfoPoster').attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`);
        } else if (data.hasOwnProperty('profile_path')) {
            $('#moreInfoPoster').attr('src', `https://image.tmdb.org/t/p/original/${data.profile_path}`);
        }
        if (data.hasOwnProperty('biography')) {
            $(`#moreInfoOverview`).html(data.biography);
        } else if (data.hasOwnProperty('overview')) {
            $('#moreInfoOverview').html(data.overview);
        }
        (data.hasOwnProperty('release_date')) ? $(`#moreInfoYear`).html("(" + data.release_date.slice(0, 4) + ")") : $(`#moreInfoYear`).html("(" + data.last_air_date.slice(0, 4) + ")");
        $('#listAddBtn').val(data.id);
        for (let i = 0; i < data.genres.length; i++) {
            (i === (data.genres.length - 1)) ? $('#moreInfoGenre').append(`${data.genres[i].name}`) : $('#moreInfoGenre').append(data.genres[i].name + ', &nbsp;');
        }
        (data.hasOwnProperty('runtime')) ? $('#moreInfoRuntime').html(toHoursAndMinutes(data.runtime)) : $('#moreInfoRuntime').html(toHoursAndMinutes(data.last_episode_to_air.runtime));
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
                data.crew.forEach(function (person) {
                    if (person.job === "Director") {
                        $(`#moreInfoDirector`).append(person.name)
                    }
                })
                if (data.cast.length > 5) {
                    for (let i = 0; i < 5; i++) {
                        (data.cast[i] === data.cast[4]) ? $(`#moreInfoCast`).append(data.cast[i].name) : $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`);
                    }
                } else {
                    for (let i = 0; i < data.cast.length; i++) {
                        (data.cast.indexOf(data.cast[i]) === data.cast.length - 1) ? $(`#moreInfoCast`).append(data.cast[i].name) : $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`);
                    }
                }
            })
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                console.log(data);
                data.forEach(function (list) {
                    let content = list.content;
                    console.log(list.content);
                    $('#addListList').append(`<li><button class="dropdown-item" id="listName_${list.id}" href="#" value="${list.id}">${list.list_name}</button></li>`);
                    $(`#listName_${list.id}`).click(function () {
                        let newContent = {
                            id: ($('#listAddBtn').val()),
                            type: searchType
                        };
                        // content.id = ;
                        content.push(newContent);
                        addMovieToList(content, $(`#listName_${list.id}`).val());
                    })
                })
            })
    }

    function addMovieToList(data, listId) {
        let updateContent = {
            content: data
        }
        const url = 'https://daffy-tasteful-brownie.glitch.me/lists/' + listId;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateContent)
        };
        console.log(JSON.stringify(data));
        fetch(url, options)
            .then(response => response.json()).then(data => console.log(data))
            .catch(error => console.error(error));
    }

    function createNewList() {
        let date = new Date().toISOString().slice(0, 10)
        let newList = {
            list_name: $('#listCreateName').val(),
            list_desc: $('#listCreateDesc').val(),
            date_created: date,
            last_edited: date,
            content: [],
            featured: 'n',
            likes: '0'
        }
        const url = 'https://daffy-tasteful-brownie.glitch.me/lists/';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newList)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => console.log(data))
            .catch(error => console.error(error));
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

    function populateListsHome() {
        $('#featuredListsContainer').html('');
        $('#popularListsContainer').html('');
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists`)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                data.forEach(function (list) {
                    list.featured === "y" ? generateFeaturedListsCards(list) : generatePopularListsCards(list);
                })
            })
    }

    function generateFeaturedListsCards(list) {
        $('#featuredListsContainer').append(`
            <div class="card mb-3 col-4 border border-1" style="max-width: 540px;">
              <div class="row g-0">
                <div class="col-6" id="listCardImages">
                </div>
                <div class="col-6">
                  <div class="card-body">
                    <h5 class="card-title">${list.list_name}</h5>
                    <p class="card-text">${list.list_desc}</p>
                  </div>
                </div>
              </div>
            </div>
        `)
        // for (let i = 0; i < 6; i++) {
        //     console.log(list.content[i]);
        //     fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${list.content[i]}&page=1&include_adult=false`)
        //         .then(response => response.json())
        //         .then((data) => {
        //             console.log(data);
        //         })
        // }
    }

    // <img src="..." className="img-fluid rounded-start" alt="...">

    function generatePopularListsCards(list) {
        $('#popularListsContainer').append(`
            <div class="card mb-3 col-6 border border-1" style="max-width: 540px;">
              <div class="row g-0">
                <div class="col-6">
                  <img src="..." class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-6">
                  <div class="card-body">
                    <h5 class="card-title">${list.list_name}</h5>
                    <p class="card-text">${list.list_desc}</p>
                  </div>
                </div>
              </div>
            </div>
        `)
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


//TODOS:

// remove unused or blank fields from showing in moreinfo modal
//
// like buttons
//
// login