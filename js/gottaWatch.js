'use strict';

$(document).ready(() => {

    onLoad();

    function onLoad() {
        loadPopular('movie', '#popularMovieResults');
        loadPopular('tv', '#popularTVResults');
        loadTopRated('tv', '#topRatedTVResults');
        loadTopRated('movie', '#topRatedMovieResults');
        populateListsHome();
    }

    function loadPopular(showType, location) {
        fetch(`https://api.themoviedb.org/3/${showType}/popular?api_key=${apiKeyTMDP}&language=en-US&page=1`)
            .then(response => response.json())
            .then((response) => {
                console.log(`Results ${showType}`, response);
                if (showType === 'tv'){
                    let filteredResponse = {
                        results: []
                    }
                    response.results.forEach((result) => {
                        if (result.origin_country[0] === 'US') {
                            filteredResponse.results.push(result);
                        }
                    })
                    console.log(filteredResponse);
                    generateSmallCards(filteredResponse, 5, location, showType);
                } else {
                generateSmallCards(response, 5, location, showType);
                }
            })
            .catch(err => console.error(err));
    }

    function loadTopRated(showType, location) {
        fetch(`https://api.themoviedb.org/3/${showType}/top_rated?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json())
            .then((response) => {
                console.log(`Top Rated Results ${showType}`, response);
                // if (showType === 'tv'){
                //     let filteredResponse = {
                //         results: []
                //     }
                //     response.results.forEach((result) => {
                //         if (result.origin_country[0] === 'US') {
                //             filteredResponse.results.push(result);
                //         }
                //     })
                //     console.log(filteredResponse);
                //     generateSmallCards(filteredResponse, 5, location, showType);
                // } else {
                    generateSmallCards(response, 10, location, showType);
                // }
            })
            .catch(err => console.error(err));
    }

    function allSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${input}&include_adult=false`)
            .then(response => response.json())
            // .then(response => console.log('Search Results', response))
            .then(response => {
                // console.log('Search Results', response);
                filterSearchData(response);
            })
            .catch(err => console.error(err));
    }

    function filterSearchData(data) {
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
        allSearch($('#movieSearchInput').val())
    })

    $('#movieSearchButton').click(function (e) {
        e.preventDefault();
        $('#homePage').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#searchResults').removeClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    })
    $('#homeButton').click(() => {
        $('#homePage').removeClass('d-none');
        $('#searchResults').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    })
    $('#discoverButton').click((e) => {
        e.preventDefault();
        $('#homePage').addClass('d-none');
        $('#searchResults').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').removeClass('d-none');
    })
    $('#movieSearchInputButton').click(function (e) {
        e.preventDefault();
        $('#resultsContainer').html('');
        allSearch($('#movieSearchInput').val());
    })
    $('#listsButton').click((e) => {
        e.preventDefault();
        $('#homePage').addClass('d-none');
        $('#searchResults').addClass('d-none');
        $('#listsPage').removeClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    })
    $('#profileButton').click((e) => {
        //     e.preventDefault();
        //     $('#homePage').addClass('d-none');
        //     $('#searchResults').addClass('d-none');
        //     $('#listsPage').addClass('d-none');
        //     $('#profilePage').removeClass('d-none');
        $(`#usernameInput`).val('');
        $(`#passwordInput`).val('');
    })
    $('#submitNewList').submit(function () {
        createNewList();
    })
    $('#createNewListButton').click(function () {
        $('#listCreateName').html('');
        $('#listCreateDesc').html('');
    })

    function searchById(searchType, id) {
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((data) => {
                moreInfo(data, searchType, id);
            })
            .catch(err => console.error(err));
    }

    function generateSearchResults(data) {
        $(`#resultsContainer`).html('');
        for (let i = 0; i < data.length; i++) {
            $('#resultsContainer').append(`
                <div class="card col-12 searchResultCard rounded border-1 border-primary bg-primary m-3 row flex-row" id="searchResult_${data[i].id}" data-bs-toggle="modal" data-bs-target="#moreInfoModal">
                    <div class="row col-2 m-0 p-0">
                        <img class="col-12" src="" id="searchResult_${i}" alt="Search Result">
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
            $(`#searchResult_${data[i].id}`).click(() => {
                searchById(data[i].media_type, data[i].id);
                hideBackToListButton();
            });
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
                data.forEach(function (list) {
                    if (user.createdLists.includes(list.id)) {
                        let content = list.content;
                        $('#addListList').append(`<li><button class="dropdown-item" id="listName_${list.id}" href="#" value="${list.id}">${list.list_name}</button></li>`);
                        $(`#listName_${list.id}`).click(function () {
                            let newContent = {
                                id: ($('#listAddBtn').val()),
                                type: searchType
                            };
                            content.push(newContent);
                            addMovieToList(content, $(`#listName_${list.id}`).val());
                        })
                    }
                })
            })
    }

    function addMovieToList(data, listId) {
        let date = new Date().toISOString().slice(0, 10)
        let updateContent = {
            content: data,
            last_edited: date
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
        populateListsHome();
    }

    function createNewList() {
        let date = new Date().toISOString().slice(0, 10)
        let newList = {
            list_name: $('#listCreateName').val(),
            list_desc: $('#listCreateDesc').val(),
            date_created: date,
            last_edited: date,
            content: [],
            creator: user.id,
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
            .then(response => response.json()).then(data => {
            console.log(data);
            console.log(user);
            let userUpdate = {
                createdLists: user.createdLists
            }
            userUpdate.createdLists.push(data.id);
            const url2 = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options2 = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userUpdate)
            };
            fetch(url2, options2)
                .then(response => response.json()).then(data => {
                console.log(data);
            })
                .catch(error => console.error(error));
        })
            .catch(error => console.error(error));
        populateListsHome();
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
                hideBackToListButton();
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
            <div class="card mb-3 col-4 listCard border-0" id="listCard_${list.id}" data-bs-toggle="modal" data-bs-target="#listModal" data-id="${list.id}">
              <div class="row g-0">
                <div class="col-12 listCardFeatured" id="listCardImages_${list.id}">
                </div>
                <div class="col-12">
                  <div class="">
                    <h5>${list.list_name}</h5>
                    <p>Created by: ${list.creator}  |  <i class="fa-solid fa-heart"></i> ${list.likes}  |  <i class="fa-solid fa-comment"></i> ${list.comments.length} </p>
                  </div>
                </div>
              </div>
            </div>
        `)
        $(`#listCard_${list.id}`).click(function () {
            populateListModal($(this).data("id"));
        });
        if (list.content.length < 5) {
            for (let i = 0; i < list.content.length; i++) {
                fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                        // console.log(data);
                        $(`#listCardImages_${list.id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1" alt="Movie Poster" style="position: absolute; left: ${i * 17}%; height: 8em; z-index: ${500 - (5 * i)}">
                        `)
                    })
            }
        } else {
            for (let i = 0; i < 5; i++) {
                fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                        $(`#listCardImages_${list.id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1" alt="Movie Poster" style="position: absolute; left: ${i * 17}%; height: 8em; z-index: ${500 - (5 * i)}">
                        `)
                    })
            }
        }
    }

    function generatePopularListsCards(list) {
        $('#popularListsContainer').append(`
                <div class="card col-9 m-1 border-0" id="listCard_${list.id}" data-bs-toggle="modal" data-bs-target="#listModal" data-id="${list.id}">
                  <div class="row g-0">
                    <div class="col-7 listCardPopular" id="listCardImages_${list.id}">
                    </div>
                    <div class="col-5">
                      <div>
                        <h5>${list.list_name}</h5>
                        <p>Created by: ${list.creator}  |  <i class="fa-solid fa-heart"></i> ${list.likes}  |  <i class="fa-solid fa-comment"></i> ${list.comments.length}</p>
                        <p class="" id="listCard_desc${list.id}"></p>
                      </div>
                    </div>
                  </div>
                </div>
            <div class="col-9">
            <hr>
            </div>
        `)
        $(`#listCard_${list.id}`).click(function () {
            populateListModal($(this).data("id"));
        });
        (list.list_desc.length > 100) ? $(`#listCard_desc${list.id}`).html(list.list_desc.slice(0, 100) + "...") : $(`#listCard_desc${list.id}`).html(list.list_desc);
        if (list.content.length < 5) {
            for (let i = 0; i < list.content.length; i++) {
                fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                        // console.log(data);
                        $(`#listCardImages_${list.id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1" alt="Movie Poster" style="position: absolute; left: ${i * 9}%; height: 8em; z-index: ${500 - (5 * i)}">
                        `)
                    })
            }
        } else {
            for (let i = 0; i < 5; i++) {
                fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                        $(`#listCardImages_${list.id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1" alt="Movie Poster" style="position: absolute; left: ${i * 9}%; height: 8em; z-index: ${500 - (5 * i)}">
                        `)
                    })
            }
        }
    }


    function showBackToListButton() {
        $(`#backToListButton`).removeClass('d-none');
    }

    function hideBackToListButton() {
        $(`#backToListButton`).addClass('d-none');
    }


    let commentsUpdate;

    function populateListModal(listId) {
        $('#listModalMovies').html('');
        $(`#listModalComments`).html('');
        $(`#listModal`).data('data-list-id', listId);
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists/${listId}`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((list) => {
                $(`#listModalTitle`).html(list.list_name);
                $(`#listModalCreator`).html(list.creator);
                $(`#listModalDescription`).html(list.list_desc);
                $(`#listLike`).html(`${list.likes}`);
                $(`#listCommentCounter`).html(`${list.comments.length}`);
                if (user.hasOwnProperty('id')) {
                    $(`#listLikeButton`).removeClass('disabled').removeAttr('disabled');
                    $(`#showAddCommentSection`).removeClass('disabled').removeAttr('disabled');
                }
                commentsUpdate = {
                    comments: list.comments
                };
                if (list.comments.length === 0){
                    $(`#listModalComments`).append(`
                        <div class="row col-7 p-0 m-0 justify-content-center">
                            <h1 class="text-center">Leave a Comment!</h1>
                        </div>
                        <div class="col-6">
                            <hr>
                        </div>
                    `)
                } else {
                list.comments.forEach(function (comment) {
                    $(`#listModalComments`).append(`
                        <div class="row col-7 p-0 m-0">
                            <div class="col-3">
                                <p>${comment.user}</p>
                                <p>${comment.date}</p>
                            </div>
                            <div class="col-8">
                                <p>${comment.comment}</p>
                            </div>
                        </div>
                        <div class="col-6">
                        <hr>
                        </div>
                    `)
                })
                }
                list.content.forEach((content) => {
                    fetch(`https://api.themoviedb.org/3/${content.type}/${content.id}?api_key=${apiKeyTMDP}&language=en-US`)
                        .then(response => response.json())
                        .then((data) => {
                                if (content.type === 'movie') {
                                    $(`#listModalMovies`).append(`
                                <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="m-2 rounded-1" alt="Movie Poster" id="listContent_${content.id}" style="height: 20em" data-bs-toggle="modal" data-bs-target="#moreInfoModal">
                            `)
                                } else {
                                    $(`#listModalMovies`).append(`
                                <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="m-2 rounded-1" alt="Movie Poster" id="listContent_${content.id}" style="height: 20em" data-bs-toggle="modal" data-bs-target="#moreInfoModal">
                            `)
                                }
                                $(`#listContent_${content.id}`).click(function () {
                                    searchById(content.type, content.id);
                                    showBackToListButton();
                                })
                                $(`#listContent_${content.id}`).hover(
                                    function () {
                                        $(`#listContent_${content.id}`).addClass('border rounded border-danger border-5');
                                    },
                                    function () {
                                        $(`#listContent_${content.id}`).removeClass('border rounded border-danger border-5');
                                    }
                                );
                            }
                        )
                })
            })

    }

    $(`#addCommentSection`).submit(function () {
        submitComment();
        setTimeout(function () {
            populateListsHome();
            populateListModal($(`#listModal`).data('data-list-id'));
        }, 1000)
    })
    $(`#showAddCommentSection`).click(() => $('#addCommentSection').toggleClass('d-none'));

    function submitComment() {
        let date = new Date().toISOString().slice(0, 10)
        let newComment = {
            user: user.id,
            comment: $(`#commentSubmission`).val(),
            date: date
        }
        commentsUpdate.comments.push(newComment);
        const url = `https://daffy-tasteful-brownie.glitch.me/lists/${$(`#listModal`).data('data-list-id')}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentsUpdate)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            console.log(data);
            $(`#commentSubmission`).val('');
        })
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

    $(`#loginSubmit`).click(function (e) {
        e.preventDefault();
        login($('#usernameInput').val(), $('#passwordInput').val());
    })


    let user = {};

    function login(username, password) {
        fetch(`https://wave-kaput-giant.glitch.me/users/${username}`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((userInfo) => {
                console.log(userInfo);
                if (password === userInfo.password) {
                    user = userInfo;
                }
                $(`#userName`).html(`&nbsp;${userInfo.id}`);
                $(`#loginSection`).addClass('d-none');
                $(`.loggedInDropdown`).removeClass('d-none');
                $(`#createNewListButton`).removeClass('disabled');
            })
            .catch(err => console.error(err))
    }

    $(`#logoutButton`).click(() => logout());

    function logout() {
        user = {};
        $(`#userName`).html(``);
        $(`.loggedInDropdown`).addClass('d-none');
        $(`#loginSection`).removeClass('d-none');
        $(`#createNewListButton`).addClass('disabled');
    }

    $(`#submitNewAccount`).submit((e) => {
        e.preventDefault();
        fetch(`https://wave-kaput-giant.glitch.me/users/`)
            .then(response => response.json())
            // .then(response => console.log('Results by id', response)
            .then((userInfo) => {
                console.log(userInfo);
                let users = [];
                userInfo.forEach(function (user) {
                    users.push(user.id.toLowerCase());
                })
                console.log(users);
                if (users.includes($('#accountCreateUsername').val())) {
                    $('#userNameTaken').removeClass('d-none');
                } else {
                    createAccount();
                    $(`#offcanvasAccountCreate`).offcanvas('hide');
                    setTimeout(()=> {
                        login($('#accountCreateUsername').val(), $('#accountCreatePassword').val());
                        $(`#submitNewAccount`)[0].reset();
                    }, 1000);
                }
            })
    })

    function createAccount() {
        let newUser = {
            id: $('#accountCreateUsername').val(),
            password: $('#accountCreatePassword').val(),
            description: $('#accountUserDesc').val(),
            admin: "n",
            createdLists: [],
            likedLists: []
        }
        const url = 'https://wave-kaput-giant.glitch.me/users/';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            console.log(data);
        })
    }
})


//TODOS:

// remove unused or blank fields from showing in moreinfo modal
//
// like button functionality
//
// discover tab and create home

// remove anchor styling from comments list modal