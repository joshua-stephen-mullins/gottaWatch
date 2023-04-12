'use strict';

$(document).ready(() => {

    onLoad();

    function onLoad() {
        loadPopular('movie', '#popularMovieResults');
        loadPopular('tv', '#popularTVResults');
        loadTopRatedTV('tv');
        loadTopRatedMovies('movie');
        populateListsHome();
    }

    function loadPopular(showType, location) {
        fetch(`https://api.themoviedb.org/3/${showType}/popular?api_key=${apiKeyTMDP}&language=en-US&page=1`)
            .then(response => response.json()).then((response) => {
            if (showType === 'tv') {
                let filteredResponse = {results: []};
                response.results.forEach((result) => {
                    if (result.origin_country[0] === 'US') {
                        filteredResponse.results.push(result);
                    }
                })
                generateSmallCards(filteredResponse, 5, location, showType, 'popular');
            } else {
                generateSmallCards(response, 5, location, showType, 'popular');
            }
        })
            .catch(err => console.error(err));
    }

    $('.topRatedFilterButtonMovie').click(() => {
        filterTopRatedMovie();
    })

    function filterTopRatedMovie() {
        let movieFilters = [];
        let itemsToPopulate = {results: allTopRatedMovies};
        if ($(".topRatedFilterButtonMovie").is(':checked')) {
            $.each($('input[class="topRatedFilterButtonMovie"]:checked'), function () {
                movieFilters.push($(this).val());
                for (let i = 0; i < movieFilters.length; i++) {
                    itemsToPopulate.results = itemsToPopulate.results.filter(function (item) {
                        return item.genre_ids.includes(parseInt(movieFilters[i]));
                    })
                }
            })
            $('#topRatedMovieResults').html('');
            if (itemsToPopulate.results.length === 0) {
                $('#topRatedMovieResults').append(`<h1 class="m-1">No Results Found</h1>`);
            } else {
                generateSmallCards(itemsToPopulate, 18, '#topRatedMovieResults', 'movie', 'topRatedMovie');
            }
        } else {
            $('#topRatedMovieResults').html('');
            generateSmallCards(defaultMovies, 18, '#topRatedMovieResults', 'movie', 'topRatedMovie')
        }
    }

    let allTopRatedMovies = [];
    let defaultMovies = {};

    function loadTopRatedMovies(showType) {
        for (let i = 1; i < 100; i++) {
            fetch(`https://api.themoviedb.org/3/${showType}/top_rated?api_key=${apiKeyTMDP}&language=en-US&page=${i}`)
                .then(response => response.json()).then((response) => {
                response.results.forEach((result) => {
                    allTopRatedMovies.push(result);
                });
                if (i === 1) {
                    defaultMovies = response;
                    generateSmallCards(defaultMovies, 18, '#topRatedMovieResults', 'movie', 'topRatedMovie');
                }
            })
        }
    }

    $('.topRatedFilterButtonTV').click(() => {
        filterTopRatedTV();
    })

    function filterTopRatedTV() {
        let tvFilters = [];
        let itemsToPopulate = {results: allTopRatedTV};
        if ($(".topRatedFilterButtonTV").is(':checked')) {
            $.each($('input[class="topRatedFilterButtonTV"]:checked'), function () {
                tvFilters.push($(this).val());
                for (let i = 0; i < tvFilters.length; i++) {
                    itemsToPopulate.results = itemsToPopulate.results.filter(function (item) {
                        return item.genre_ids.includes(parseInt(tvFilters[i]));
                    })
                }
            })
            $('#topRatedTVResults').html('');
            if (itemsToPopulate.results.length === 0) {
                $('#topRatedTVResults').append(`<h1 class="m-1">No Results Found</h1>`);
            } else {
                generateSmallCards(itemsToPopulate, 18, '#topRatedTVResults', 'tv', 'topRatedTV');
            }
        } else {
            $('#topRatedTVResults').html('');
            generateSmallCards(defaultTV, 18, '#topRatedTVResults', 'tv', 'topRatedTV')
        }
    }

    // Set equal to zero
    let allTopRatedTV = [];
    let defaultTV = {};

    function loadTopRatedTV(showType) {
        for (let i = 1; i < 100; i++) {
            fetch(`https://api.themoviedb.org/3/${showType}/top_rated?api_key=${apiKeyTMDP}&language=en-US&page=${i}`)
                .then(response => response.json()).then((response) => {
                response.results.forEach((result) => {
                    allTopRatedTV.push(result);
                });
                if (i === 1) {
                    defaultTV = response;
                    generateSmallCards(defaultTV, 18, '#topRatedTVResults', 'tv', 'topRatedTV');
                }
            })
        }
    }

    function allSearch(input) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKeyTMDP}&language=en-US&query=${input}&include_adult=false`)
            .then(response => response.json()).then(response => {
            filterSearchData(response);
        })
            .catch(err => console.error(err));
    }

    function filterSearchData(data) {
        let filteredData = [];
        let movieCounter = 0;
        let tvCounter = 0;
        let personCounter = 0;
        let allData = {results: []};
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].media_type === 'movie') {
                movieCounter += 1;
                allData.results.push(data.results[i]);
            } else if (data.results[i].media_type === 'tv') {
                tvCounter += 1;
                allData.results.push(data.results[i]);
            }
        }
        for (let i = 0; i < allData.results.length; i++) {
            if ($('input[name=filterRadio]:checked').val() === 'all') {
                filteredData.push(allData.results[i]);
            } else if (data.results[i].media_type === $('input[name=filterRadio]:checked').val()) {
                filteredData.push(allData.results[i]);
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
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    })
    $('#homeButton').click(() => {
        showHomePage();
    })

    function showHomePage() {
        $('#homePage').removeClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    }

    $('#discoverButton').click((e) => {
        showDiscoverPage()
    })

    function showDiscoverPage() {
        $('#homePage').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').removeClass('d-none');
    }

    $('#movieSearchInputButton').click(function (e) {
        $('#resultsContainer').html('');
        $('#searchBody').removeClass('d-none');
        allSearch($('#movieSearchInput').val());
    })
    $('#listsButton').click(() => {
        showListsPage();
    })

    function showListsPage() {
        $('#homePage').addClass('d-none');
        $('#listsPage').removeClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
    }

    $('#profileButton').click(() => {
        $(`#usernameInput`).val('');
        $(`#passwordInput`).val('');
    })
    $('#submitNewList').submit((e) => {
        e.preventDefault();
        createNewList();
    })
    $('#createNewListButton').click(() => {
        $('#listCreateName').html('');
        $('#listCreateDesc').html('');
    })
    $(`#myProfileButton`).click(() => {
        showProfilePage();
    })

    function showProfilePage() {
        $('#homePage').addClass('d-none');
        $('#listsPage').addClass('d-none');
        $('#profilePage').addClass('d-none');
        $('#discoverPage').addClass('d-none');
        $('#profilePage').removeClass('d-none');
        populateProfilePage(user.id);
    }

    function searchById(searchType, id) {
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json()).then((data) => {
            moreInfo(data, searchType, id);
        })
            .catch(err => console.error(err));
    }

    function generateSearchResults(data) {
        $(`#resultsContainer`).html('');
        for (let i = 0; i < data.length; i++) {
            $('#resultsContainer').append(`
                <div class="m-3 row" id="searchResult_${data[i].id}">
                    <div class="row col-2 m-0 p-0">
                        <img class="rounded-5" src="" id="searchResult_${i}" alt="Search Result">
                    </div>
                    <div class="col-10" id="searchResultBody_${data[i].id}">
                    </div>
                </div>
                <hr>
            `)
            // probably redudunant need to check later
            if (data[i].media_type === 'person') {
                $(`#searchResultBody_${data[i].id}`).append(`
                <h3 class=searchResultTitle_${data[i].id}></h3>
                <h5>${data[i].known_for_department} | <span id="featuredIn_${data[i].id}"></span></h5>
                <p><span class=searchResultOverview_${data[i].id}></span></p>
                `)
                if (data[i].hasOwnProperty('known_for')) {
                    for (let j = 0; j < (returnSmallest(3, data[i].known_for.length)); j++) {
                        if (data[i].known_for[j].media_type === 'tv') {
                            if (j !== (returnSmallest(3, data[i].known_for.length) - 1)) {
                                $(`#featuredIn_${data[i].id}`).append(`${data[i].known_for[j].name}, `)
                            } else {
                                $(`#featuredIn_${data[i].id}`).append(`${data[i].known_for[j].name}`)
                            }
                        } else {
                            if (j !== (returnSmallest(3, data[i].known_for.length) - 1)) {
                                $(`#featuredIn_${data[i].id}`).append(`${data[i].known_for[j].title}, `)
                            } else {
                                $(`#featuredIn_${data[i].id}`).append(`${data[i].known_for[j].title}`)
                            }
                        }
                    }
                }
            } else {
                $(`#searchResultBody_${data[i].id}`).append(`
                <h3 class ="searchResultTitle_${data[i].id}"></h3>
                <h5><span class="searchResultDate_${data[i].id}"></span></h5>
                <p><span class="searchResultOverview_${data[i].id}"></span></p>
            `)
            }
            if (data[i].hasOwnProperty('title')) {
                $(`.searchResultTitle_${data[i].id}`).html(data[i].title)
            } else {
                $(`.searchResultTitle_${data[i].id}`).html(data[i].name)
            }
            if (data[i].hasOwnProperty('poster_path') && (typeof data[i].poster_path === 'string')) {
                $(`#searchResult_${i}`).attr('src', `https://image.tmdb.org/t/p/original/${data[i].poster_path}`);
            } else if (data[i].hasOwnProperty('profile_path') && (typeof data[i].profile_path === 'string')) {
                $(`#searchResult_${i}`).attr('src', `https://image.tmdb.org/t/p/original/${data[i].profile_path}`);
            } else {
                $(`#searchResult_${i}`).attr('src', `img/noImage.jpg`)
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
        if (data.length === 0) {
            $('#resultsContainer').append(`
                <div class="col-12"">
                    <h2>No Results Found</h2>
                </div>
            `)
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
        if (data.hasOwnProperty('release_date')) {
            $(`#moreInfoYear`).html("(" + data.release_date.slice(0, 4) + ")")
        } else if (data.hasOwnProperty('last_air_date') && (data.last_air_date !== null)) {
            $(`#moreInfoYear`).html("(" + data.last_air_date.slice(0, 4) + ")");
        }
        $('#listAddBtn').val(data.id);
        for (let i = 0; i < data.genres.length; i++) {
            (i === (data.genres.length - 1)) ? $('#moreInfoGenre').append(`${data.genres[i].name}`) : $('#moreInfoGenre').append(data.genres[i].name + ', &nbsp;');
        }
        if ((data.hasOwnProperty('runtime') && (toHoursAndMinutes(data.runtime) !== '0m') && (data.runtime !== null))) {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.runtime))
        } else if (data.hasOwnProperty('episode_run_time') && (typeof data.episode_run_time[0] === 'number')) {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.episode_run_time[0]));
        } else if ((data.hasOwnProperty('last_episode_to_air')) && (data.last_episode_to_air !== null) && (toHoursAndMinutes(data.last_episode_to_air.runtime) !== '0m')) {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.last_episode_to_air.runtime));
        } else if ((data.hasOwnProperty('next_episode_to_air')) && (data.next_episode_to_air !== null) && (toHoursAndMinutes(data.next_episode_to_air.runtime) !== '0m')) {
            $('#moreInfoRuntime').html(toHoursAndMinutes(data.next_episode_to_air.runtime));
        }
        if (searchType === 'movie') {
            $('#moreInfoRating').html('');
            fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKeyTMDP}`)
                .then(response => response.json()).then((data) => {
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
            $('#moreInfoRating').html('');
            fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${apiKeyTMDP}&language=en-US`)
                .then(response => response.json()).then((data) => {
                data.results.forEach(function (country) {
                    if (country.iso_3166_1 === "US") {
                        $('#moreInfoRating').html(country.rating);
                    }
                })
            })
        }
        fetch(`https://api.themoviedb.org/3/${searchType}/${id}/credits?api_key=${apiKeyTMDP}&language=en-US`)
            .then(response => response.json()).then((data) => {
            let directors = [];
            data.crew.forEach(function (person) {
                if (person.job === "Director") {
                    directors.push(person);
                }
            })
            if (directors.length === 1) {
                $(`#moreInfoDirector`).append(`Director: <span class="fw-normal">${directors[0].name}</span>`)
            } else if (directors.length > 1) {
                $(`#moreInfoDirector`).html(`Directors: <span class="fw-normal">${directors[0].name}</span>`);
                for (let d = 1; d < directors.length; d++) {
                    $(`#moreInfoDirector`).append(`<span class="fw-normal">, ${directors[d].name}</span>`)
                }
            }
            if (data.cast.length > 5) {
                for (let i = 0; i < 5; i++) {
                    $(`#moreInfoCastElement`).removeClass('d-none');
                    (data.cast[i] === data.cast[4]) ? $(`#moreInfoCast`).append(data.cast[i].name) : $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`);
                }
            } else if (data.cast.length === 0) {
                $(`#moreInfoCastElement`).addClass('d-none');
            } else {
                for (let i = 0; i < data.cast.length; i++) {
                    $(`#moreInfoCastElement`).removeClass('d-none');
                    (data.cast.indexOf(data.cast[i]) === data.cast.length - 1) ? $(`#moreInfoCast`).append(data.cast[i].name) : $(`#moreInfoCast`).append(`${data.cast[i].name}, &nbsp;`);
                }
            }
        }).then(() => {
            if (user.hasOwnProperty('id')) {
                fetch(`https://daffy-tasteful-brownie.glitch.me/lists`)
                    .then(response => response.json()).then((data) => {
                    data.forEach(function (list) {
                        if (user.createdLists.includes(list.id)) {
                            let content = list.content;
                            $('#addListList').append(`<li><button class="dropdown-item" id="listName_${list.id}" href="#" value="${list.id}">${list.list_name}</button></li>`);
                            $(`#listName_${list.id}`).click(function () {
                                let newContent = {
                                    id: parseInt($('#listAddBtn').val()),
                                    type: searchType
                                };
                                content.push(newContent);
                                addMovieToList(content, $(`#listName_${list.id}`).val());
                            })
                        }
                    })
                })
            } else {
                $('#addListList').append(`<li class="dropdown-item">Login or create an account to begin adding items to lists!</li>`);
            }
        }).then($(`#moreInfoModal`).modal('show'));
    }

    function addMovieToList(data, listId) {
        let updateContent = {
            content: data,
            last_edited: new Date()
        }
        const url = `https://daffy-tasteful-brownie.glitch.me/lists/${listId}`;
        const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateContent)
        };
        fetch(url, options)
            .then(response => response.json()).then(data2 => {
            let replacementIndex = allPopularLists.findIndex((list) => {
                return list.id === parseInt(listId);
            })
            allPopularLists[replacementIndex] = data2;
            let userUpdate = {
                recentActivity: recentActivityPush({
                    type: "listAdd",
                    listId: parseInt(listId),
                    content: data[data.length - 1],
                    date: new Date()
                })
            };
            const url2 = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options2 = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userUpdate)
            };
            fetch(url2, options2)
                .then(response => response.json()).then(data2 => {
                user.recentActivity = userUpdate.recentActivity;
            })
                .catch(error => console.error(error));
        })
    }

    function createNewList() {
        let newList = {
            list_name: $('#listCreateName').val(),
            list_desc: $('#listCreateDesc').val(),
            date_created: new Date(),
            last_edited: new Date(),
            content: [],
            comments: [],
            creator: user.id,
            featured: 'n',
            likes: '0'
        }
        const url = 'https://daffy-tasteful-brownie.glitch.me/lists/';
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newList)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            allPopularLists.push(data);
            refreshListHome();
            populateProfilePage(user.id);
            let userUpdate = {
                createdLists: user.createdLists,
                recentActivity: recentActivityPush({type: "newList", listId: data.id, date: new Date()})
            };
            userUpdate.createdLists.push(data.id);
            const url2 = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options2 = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userUpdate)
            };
            fetch(url2, options2)
                .then(response => response.json()).then(data2 => {
                user.createdLists = userUpdate.createdLists;
                user.recentActivity = userUpdate.recentActivity;
            })
                .catch(error => console.error(error));
        })
            .catch(error => console.error(error));
    }

    function trendingContent(contentType) {
        fetch(`https://api.themoviedb.org/3/trending/${contentType}/day?api_key=${apiKeyTMDP}`)
            .then(response => response.json()).then((data) => {
            return data;
        })
    }

    function generateTrendingPosterCards(numberOfCards, container, contentType) {
        $(container).html('');
        $(container).html('');
        fetch(`https://api.themoviedb.org/3/trending/${contentType}/day?api_key=${apiKeyTMDP}`)
            .then(response => response.json()).then((showInfo) => {
            for (let i = 0; i < numberOfCards; i++) {
                $(container).append(`
            <div class="p-0 m-2 mb-3 smallPoster"
                <div>
                    <img src="https://image.tmdb.org/t/p/original/${showInfo.results[i].poster_path}" class="w-100 h-100 rounded-3 divGlow" alt="Movie Poster" data-id="${showInfo.results[i].id}" data-type="${contentType}" id="smallPosterCard_${showInfo.results[i].id}_trending">
                </div>
            </div>
            `)
                $(`#smallPosterCard_${showInfo.results[i].id}_trending`).click(function () {
                    hideBackToListButton();
                    searchById($(this).data('type'), $(this).data('id'));
                }).hover(
                    function () {
                        $(`#smallPosterCard_${showInfo.results[i].id}_trending`).addClass('contentOutlineWhite');
                    },
                    function () {
                        $(`#smallPosterCard_${showInfo.results[i].id}_trending`).removeClass('contentOutlineWhite');
                    }
                );
            }
        })
    }

    function generateSmallCards(showInfo, numberOfCards, container, showType, cardType) {
        for (let i = 0; i < numberOfCards; i++) {
            $(container).append(`
                <div class="p-0 m-1 mb-3 smallCard rounded-3 discoverCard" id="showCard_${showInfo.results[i].id}_${cardType}" data-type="${showType}" data-showId="${showInfo.results[i].id}">
                    <div>
                        <img class="w-100 h-100 smallCardImg" src="https://image.tmdb.org/t/p/original/${showInfo.results[i].poster_path}" alt="Poster">
                    </div>
                </div>
            `);
            if (showInfo.results[i].hasOwnProperty('title')) {
                $(`#resultTitle_${showInfo.results[i].id}_${cardType}`).html(showInfo.results[i].title)
            } else {
                $(`#resultTitle_${showInfo.results[i].id}_${cardType}`).html(showInfo.results[i].name)
            }
            $(`#showCard_${showInfo.results[i].id}_${cardType}`).click(() => {
                searchById(showType, showInfo.results[i].id);
                hideBackToListButton();
            })
            if (showInfo.results[i].hasOwnProperty('release_date')) {
                $(`#resultDate_${showInfo.results[i].id}_${cardType}`).html("(" + showInfo.results[i].release_date.slice(0, 4) + ")")
            } else {
                $(`#resultDate_${showInfo.results[i].id}_${cardType}`).html("(" + showInfo.results[i].first_air_date.slice(0, 4) + ")")
            }
            for (let j = 0; j < showInfo.results[i].genre_ids.length; j++) {
                if (j === (showInfo.results[i].genre_ids.length - 1)) {
                    $(`#previewGenre_${showInfo.results[i].id}_${cardType}`).append(genreIdToText(showInfo.results[i].genre_ids[j]))
                } else {
                    $(`#previewGenre_${showInfo.results[i].id}_${cardType}`).append(genreIdToText(showInfo.results[i].genre_ids[j]) + ', &nbsp;')
                }
            }
            if (showInfo.results[i].hasOwnProperty('title')) {
                $(`#smallCardRating_${showInfo.results[i].id}_${cardType}`).html('');
                fetch(`https://api.themoviedb.org/3/movie/${showInfo.results[i].id}/release_dates?api_key=${apiKeyTMDP}`)
                    .then(response => response.json()).then((data) => {
                    data.results.forEach(function (country) {
                        if (country.iso_3166_1 === "US") {
                            country.release_dates.forEach(function (result) {
                                if (result.certification !== '') {
                                    $(`#smallCardRating_${showInfo.results[i].id}_${cardType}`).html(result.certification);
                                }
                            })
                        }
                    })
                })
            } else {
                $(`#smallCardRating_${showInfo.results[i].id}_${cardType}`).html('');
                fetch(`https://api.themoviedb.org/3/tv/${showInfo.results[i].id}/content_ratings?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json()).then((data) => {
                    data.results.forEach(function (country) {
                        if (country.iso_3166_1 === "US") {
                            $(`#smallCardRating_${showInfo.results[i].id}_${cardType}`).html(country.rating);
                        }
                    })
                })
            }
        }
    }

    let allFeaturedLists = [];
    let allPopularLists = [];

    function populateListsHome() {
        $('#featuredListsContainer').html('');
        $('#popularListsContainer').html('');
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists`)
            .then(response => response.json()).then((data) => {
            data.forEach(function (list) {
                list.featured === "y" ? allFeaturedLists.push(list) : allPopularLists.push(list);
            })
            generateFeaturedListsCards(randomizeLists(allFeaturedLists), "popularListsContainer");
            generatePopularListsCards(randomizeLists(allPopularLists), "popularListsContainer");
        })
    }

    function refreshListHome() {
        generatePopularListsCards(randomizeLists(allPopularLists), "popularListsContainer");
    }

    $('.popularListFilterButton').click(() => {
        filterPopularLists();
    })

    function filterPopularLists() {
        setTimeout(function () {
            $.each($('input[class="popularListFilterRadio"]'), function () {
                if ($(".popularListFilterRadio").hasClass('theone')) {
                    if (($(".theone")[0].id) === 'popularListFilterMostLiked') {
                        let filteredPopularList = allPopularLists.sort((a, b) => {
                            return b.likes - a.likes
                        });
                        $('#popularListsContainer').html('');
                        generatePopularListsCards(filteredPopularList, "popularListsContainer");
                    } else {
                        let filteredPopularList = allPopularLists.sort((a, b) => {
                            return new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime();
                        });
                        $('#popularListsContainer').html('');
                        generatePopularListsCards(filteredPopularList, "popularListsContainer");
                    }
                }
            })
        }, 100);
    }

    $('#popularListFilterSearchButton').click(() => {
        filterPopularListsSearch();
        $('.theone').prop('checked', false).removeClass('theone');
    })

    function filterPopularListsSearch() {
        let filteredPopularList = [];
        allPopularLists.forEach((list) => {
            if (list.list_name.toLowerCase().includes($('#popularListFilterSearchInput').val().toLowerCase()) || list.list_desc.toLowerCase().includes($('#popularListFilterSearchInput').val().toLowerCase())) {
                filteredPopularList.push(list);
            }
            $('#popularListsContainer').html('');
            if (filteredPopularList.length !== 0) {
                generatePopularListsCards(filteredPopularList, "popularListsContainer");
            } else {
                $('#popularListsContainer').html('<h1 class="text-center">No Results Found</h1>');
            }
        })
    }


    $("input:radio").on("click", function (e) {
        let inp = $(this); //cache the selector
        if (inp.is(".theone")) { //see if it has the selected class
            inp.prop("checked", false).removeClass("theone");
            return;
        }
        $("input:radio[name='" + inp.prop("name") + "'].theone").removeClass("theone");
        inp.addClass("theone");
    });

    function generateFeaturedListsCards(lists) {
        for (let j = 0; j < 3; j++) {
            $('#featuredListsContainer').append(`
            <div class="card m-1 mt-0 col-sm-12 col-md-6 col-lg-3 flex-grow-1 listCard border-0 p-3 rounded-3 listCard" id="listCard_${lists[j].id}" data-id="${lists[j].id}">
                <div class="row">
                    <h5 class="fw-bold text-center">${lists[j].list_name}</h5>
                    <div class="listCardFeatured listCardImages d-flex justify-content-center" id="listCardImages_${lists[j].id}">
                    </div>
                    <div class="d-flex col-12 m-1">
                        <p class="mb-1 mt-1 cardFontSize align-self-end"><img class="profilePicture" src="img/profilePictures/default.jpg" alt="Profile Picture" id="featuredListProfilePicture_${lists[j].id}"> <span class="fw-bold">${lists[j].creator}</span>  |  <span id="featuredListLastEdited_${lists[j].id}"></span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${lists[j].id}">${lists[j].likes}</span>  |  <i class="fa-solid fa-comment"></i><span id="listCardComments_${lists[j].id}"> ${lists[j].comments.length}</span> </p>
                    </div>
                </div>
            </div>
        `)
            $(`#featuredListLastEdited_${lists[j].id}`).html(`Updated ${time_ago(lists[j].last_edited)}`)
            fetch(`https://wave-kaput-giant.glitch.me/users/${lists[j].creator}`)
                .then(response => response.json())
                .then((data) => {
                    $(`#featuredListProfilePicture_${lists[j].id}`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
                })
            $(`#listCard_${lists[j].id}`).click(function () {
                populateListModal($(this).data("id"));
            }).hover(
                function () {
                    $(`#listCard_${lists[j].id}`).addClass('contentOutlineWhite');
                },
                function () {
                    $(`#listCard_${lists[j].id}`).removeClass('contentOutlineWhite');
                }
            );
            if (lists[j].content.length < 6) {
                for (let i = 0; i < lists[j].content.length; i++) {
                    fetch(`https://api.themoviedb.org/3/${lists[j].content[i].type}/${lists[j].content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                        .then(response => response.json()).then((data) => {
                        $(`#listCardImages_${lists[j].id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1 col-2" alt="Movie Poster">
                        `)
                    })
                }
            } else {
                for (let i = 0; i < 6; i++) {
                    fetch(`https://api.themoviedb.org/3/${lists[j].content[i].type}/${lists[j].content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                        .then(response => response.json()).then((data) => {
                        $(`#listCardImages_${lists[j].id}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1 col-2" alt="Movie Poster">
                        `)
                    })
                }
            }
        }
    }

    function generatePopularListsCards(lists, location) {
        $(`#${location}`).html('');
        lists.forEach((list) => {
            $(`#${location}`).append(`
                <div class="card col-sm-12 col-md-6 col-lg-6 border-0 p-3 rounded-3 listCard" id="listCard_${list.id}_${location}" data-id="${list.id}">
                    <div class="row m-0 p-0 flex-column">
                        <div class="col-12 listCardPopular listCardImages d-flex justify-content-center" id="listCardImages_${list.id}_${location}">
                        </div>
                        <div class="col-12 popularCardFont">
                             <h3 class="fw-bold mb-1 mt-1">${list.list_name}</h3>
                            <p class="mb-1 mt-1 cardFontSize"><img class="profilePicture" src="img/profilePictures/default.jpg" alt="Profile Picture" id="popularListProfilePicture_${list.id}_${location}"> <span class="fw-bold">${list.creator}</span>  |  <span id="popularListLastEdited_${list.id}_${location}"></span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${list.id}_${location}">${list.likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${list.id}_${location}">${list.comments.length}</span></p>
                            <p class="mb-0 mt-2 cardFontSize" id="listCard_desc${list.id}_${location}"></p>
                        </div>
                    </div>
                </div>
        `)
            $(`#popularListLastEdited_${list.id}_${location}`).html(`Updated ${time_ago(list.last_edited)}`)
            fetch(`https://wave-kaput-giant.glitch.me/users/${list.creator}`)
                .then(response => response.json()).then((data) => {
                $(`#popularListProfilePicture_${list.id}_${location}`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
            })
            $(`#listCard_${list.id}_${location}`).click(function () {
                populateListModal($(this).data("id"));
            }).hover(
                function () {
                    $(`#listCard_${list.id}_${location}`).addClass('contentOutlineWhite');
                },
                function () {
                    $(`#listCard_${list.id}_${location}`).removeClass('contentOutlineWhite');
                }
            );
            ;
            (list.list_desc.length > 100) ? $(`#listCard_desc${list.id}_${location}`).html(list.list_desc.slice(0, 100) + "...") : $(`#listCard_desc${list.id}_${location}`).html(list.list_desc);
            if (list.content.length < 6) {
                for (let i = 0; i < list.content.length; i++) {
                    fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                        .then(response => response.json())
                        .then((data) => {
                            $(`#listCardImages_${list.id}_${location}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1 col-2" alt="Movie Poster">
                        `)
                        })
                }
            } else {
                for (let i = 0; i < 6; i++) {
                    fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                        .then(response => response.json())
                        .then((data) => {
                            $(`#listCardImages_${list.id}_${location}`).append(`
                            <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="border border-1 col-2" alt="Movie Poster">
                        `)
                        })
                }
            }
        })
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
            .then(response => response.json()).then((list) => {
            list.content.forEach((content) => {
                fetch(`https://api.themoviedb.org/3/${content.type}/${content.id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                            if (content.type === 'movie') {
                                $(`#listModalMovies`).append(`
                                <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="m-2 rounded-3" alt="Movie Poster" id="listContent_${content.id}" style="height: 20em">
                            `)
                            } else {
                                $(`#listModalMovies`).append(`
                                <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="m-2 rounded-3" alt="Movie Poster" id="listContent_${content.id}" style="height: 20em">
                            `)
                            }
                            $(`#listContent_${content.id}`).click(function () {
                                searchById(content.type, content.id);
                                $(`#listModal`).modal('hide');
                                showBackToListButton();
                            }).hover(
                                function () {
                                    $(`#listContent_${content.id}`).addClass('contentOutlineWhite');
                                },
                                function () {
                                    $(`#listContent_${content.id}`).removeClass('contentOutlineWhite');
                                }
                            );
                        }
                    )
            })
            $(`#listModalTitle`).html(list.list_name);
            $(`#listModalCreator`).html(list.creator);
            $(`#listModalLastUpdated`).html(`Updated ${time_ago(list.last_edited)} | `)
            $(`#listModalDescription`).html(list.list_desc);
            $(`#listLike`).html(`${list.likes}`);
            fetch(`https://wave-kaput-giant.glitch.me/users/${list.creator}`)
                .then(response => response.json())
                .then((data) => {
                    $(`#listModalProfilePicture`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
                })
            if (user.hasOwnProperty('likedLists')) {
                if (user.likedLists.includes(listId)) {
                    $(`#listLikeButton`).attr('checked', 'checked');
                } else {
                    $(`#listLikeButton`).prop('checked', false);
                }
            } else {
                $(`#listLikeButton`).prop('checked', false);
            }
            $(`#listCommentCounter`).html(`${list.comments.length}`);
            if (user.hasOwnProperty('id')) {
                $(`#listLikeButton`).removeClass('disabled').removeAttr('disabled');
                $(`#showAddCommentSection`).removeClass('disabled').removeAttr('disabled');
            } else {
                $(`#listLikeButton`).addClass('disabled').prop('disabled', true);
            }
            commentsUpdate = {
                comments: list.comments
            };
            if (list.comments.length === 0) {
                $(`#listModalComments`).append(`
                        <div class="row col-7 p-0 m-0 justify-content-center">
                            <h1 class="text-center">Leave a Comment!</h1>
                        </div>
                        <div class="col-7">
                            <hr>
                        </div>
                    `)
            } else {
                list.comments.forEach((comment) => {
                    $(`#listModalComments`).append(`
                        <div class="row col-7 p-0 m-0">
                            <div class="d-flex col-4 listComment" data-commenterId="${comment.user}">
                                <img class="profilePictureListComment comment_${comment.user} me-4" src="img/profilePictures/default.jpg" alt="Profile Picture">
                                <div class="d-flex flex-column justify-content-center">
                                    <p class="mb-1 text-center"> ${comment.user}</p>
                                    <p class="text-muted text-center">${time_ago(comment.date)}</p>
                                </div>
                            </div>
                            <div class="col-8">
                                <p>${comment.comment}</p>
                            </div>
                        </div>
                        <div class="col-7">
                        <hr>
                        </div>
                    `)
                    $(`.listComment`).click(function () {
                        populateProfilePage($(this).data('commenterid'));
                    })
                    fetch(`https://wave-kaput-giant.glitch.me/users/${comment.user}`)
                        .then(response => response.json()).then((data) => {
                        $(`.comment_${comment.user}`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
                    })
                })
            }
        }).then(setTimeout(function () {
            $(`#listModal`).modal('show');
        }, 500));
    }

    $(`#listLikeButton`).click(function () {
        if ($('#listLikeButton').is(':checked')) {
            likeButton();
        } else {
            likeButton();
        }
    })

    function likeButton() {
        if ($('#listLikeButton').is(':checked')) {
            let updatedLikedList = {
                likedLists: user.likedLists,
                recentActivity: recentActivityPush({
                    type: "like",
                    listId: $(`#listModal`).data('data-list-id'),
                    date: new Date()
                })
            };
            updatedLikedList.likedLists.push($(`#listModal`).data('data-list-id'));
            const url = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedLikedList)
            };
            fetch(url, options)
                .then(response => response.json()).then(data => {
                user.likedLists = updatedLikedList.likedLists;
                user.recentActivity = updatedLikedList.recentActivity;
            })
            let updatedLikes = {likes: parseInt($('#listLike').html()) + 1};
            const url1 = `https://daffy-tasteful-brownie.glitch.me/lists/${$(`#listModal`).data('data-list-id')}`;
            const options1 = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedLikes)
            };
            fetch(url1, options1)
                .then(response => response.json()).then(data => {
                $('#listLike').html(updatedLikes.likes);
                $(`#listCardLikes_${$('#listModal').data('data-list-id')}_popularListsContainer`).html(updatedLikes.likes);
                $(`#listCardLikes_${$('#listModal').data('data-list-id')}_profilePageLists`).html(updatedLikes.likes);
            })
        } else {
            let updatedLikedList = {likedLists: user.likedLists};
            updatedLikedList.likedLists = updatedLikedList.likedLists.filter(function (list) {
                return list !== $(`#listModal`).data('data-list-id');
            })
            const url = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedLikedList)
            };
            fetch(url, options)
                .then(response => response.json()).then(data => {
            })
            let updatedLikes = {likes: parseInt($('#listLike').html()) - 1};
            const url1 = `https://daffy-tasteful-brownie.glitch.me/lists/${$(`#listModal`).data('data-list-id')}`;
            const options1 = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedLikes)
            };
            fetch(url1, options1)
                .then(response => response.json()).then(data => {
                $('#listLike').html(updatedLikes.likes);
                $(`#listCardLikes_${$('#listModal').data('data-list-id')}_popularListsContainer`).html(updatedLikes.likes);
                $(`#listCardLikes_${$('#listModal').data('data-list-id')}_profilePageLists`).html(updatedLikes.likes);
                $(`#listCardLikes_${$('#listModal').data('data-list-id')}`).html(updatedLikes.likes);
            })
        }
    }

    $(`#addCommentSection`).submit(() => {
        submitComment();
        setTimeout(function () {
            populateListModal($(`#listModal`).data('data-list-id'));
        }, 500)
    })
    $(`#showAddCommentSection`).click(() => $('#addCommentSection').toggleClass('d-none'));

    function submitComment() {
        let newComment = {
            user: user.id,
            comment: $(`#commentSubmission`).val(),
            date: new Date()
        }
        commentsUpdate.comments.push(newComment);
        const url = `https://daffy-tasteful-brownie.glitch.me/lists/${$(`#listModal`).data('data-list-id')}`;
        const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(commentsUpdate)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            $(`#commentSubmission`).val('');
            $(`#listCardComments_${$(`#listModal`).data('data-list-id')}`).html(data.comments.length);
            let userUpdate = {
                recentActivity: recentActivityPush({
                    type: "comment",
                    listId: $(`#listModal`).data('data-list-id'),
                    comment: newComment.comment,
                    date: new Date()
                })
            };
            const url2 = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
            const options2 = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userUpdate)
            };
            fetch(url2, options2)
                .then(response => response.json()).then(data2 => {
                user.recentActivity = userUpdate.recentActivity;
            })
                .catch(error => console.error(error));
        })
    }

    $(`#loginSubmitButton`).click(function (e) {
        e.stopPropagation();
        $('#loginSubmit').submit((e) => {
            e.preventDefault();
            login($('#usernameInput').val(), $('#passwordInput').val());
            $('.loginDropdown').toggleClass('show')
        })
    })

    let user = {};

    function login(username, password) {
        fetch(`https://wave-kaput-giant.glitch.me/users/`)
            .then(response => response.json()).then((userInfo) => {
            let userNames = [];
            userInfo.forEach((user) => {
                userNames.push(user.id);
            })
            if (userNames.includes(username)) {
                $('#invalidUserName').addClass('d-none');
                let usernameIndex = userNames.indexOf(username);
                if (password === userInfo[usernameIndex].password) {
                    user = userInfo[usernameIndex];
                    $(`#userName`).html(`&nbsp;${user.id}`);
                    $(`#loginSection`).addClass('d-none');
                    $(`.loggedInDropdown`).removeClass('d-none');
                    $(`#createNewListButton`).removeClass('disabled');
                    $('#incorrectPassword').addClass('d-none');
                    populateUserHomePage(userInfo[usernameIndex]);
                } else {
                    $('#incorrectPassword').removeClass('d-none');
                }
            } else {
                $('#invalidUserName').removeClass('d-none');
            }
        })
            .catch(err => console.error(err))
    }

    $(`#logoutButton`).click(() => logout());

    function populateUserHomePage(userData) {
        generateTrendingPosterCards(6, '#homePageUserMovieTrendingContainer', 'movie');
        generateTrendingPosterCards(6, '#homePageUserTVTrendingContainer', 'tv');
        populateUserFeed();
        $(`#homePageUserUsername`).html(userData.id);
        $(`#homePage`).removeClass('d-none');
        $(`#homePageWelcome`).addClass('d-none');
        $(`#homePageUser`).removeClass('d-none');
        showHomePage();
        $(`.nav-link`).removeClass('active');
        $(`#homeButton`).addClass('active');
    }

    function logout() {
        user = {};
        $(`.loggedInDropdown`).addClass('d-none');
        $(`#loginSection`).removeClass('d-none');
        $(`#createNewListButton`).addClass('disabled');
        showHomePage();
        $(`.nav-link`).removeClass('active');
        $(`#homeButton`).addClass('active');
        $(`#userName`).html(`&nbsp;LOGIN`);
        $(`#homePageWelcome`).removeClass('d-none');
        $(`#homePageUser`).addClass('d-none');
    }

    $(`#submitNewAccount`).submit((e) => {
        e.preventDefault();
        e.stopPropagation();
        fetch(`https://wave-kaput-giant.glitch.me/users/`)
            .then(response => response.json()).then((userInfo) => {
            let users = [];
            userInfo.forEach(function (user) {
                users.push(user.id.toLowerCase());
            })
            if (users.includes($('#accountCreateUsername').val())) {
                $('#userNameTaken').removeClass('d-none');
            } else {
                createAccount();
                $(`#offcanvasAccountCreate`).offcanvas('hide');
                setTimeout(() => {
                    login($('#accountCreateUsername').val(), $('#accountCreatePassword').val());
                    $(`#submitNewAccount`)[0].reset();
                }, 500);
            }
        })
    })

    function createAccount() {
        let newUser = {
            id: $('#accountCreateUsername').val(),
            password: $('#accountCreatePassword').val(),
            description: $('#accountUserDesc').val(),
            userCreated: new Date(),
            admin: "n",
            profilePic: "default",
            createdLists: [],
            likedLists: [],
            followers: ['gottaWatch'],
            following: ['gottaWatch'],
            recentActivity: []
        }
        const url = 'https://wave-kaput-giant.glitch.me/users/';
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
        })
    }

    $('#listModalCreator').click(() => populateProfilePage($(`#listModalCreator`).html()));

    function populateProfilePage(username) {
        $(`.nav-link`).removeClass('active');
        fetch(`https://wave-kaput-giant.glitch.me/users/${username}`)
            .then(response => response.json()).then((profileUser) => {
            $(`#profilePageProfilePicture`).attr('src', `img/profilePictures/${profileUser.profilePic}.jpg`);
            $(`#profilePageUsername`).html(`${profileUser.id}`);
            let dateCreated = new Date(profileUser.userCreated);
            $(`#profilePageMemberDate`).html(dateCreated.toDateString().substring(4, dateCreated.toDateString().length));
            $(`#profilePageListsCreated`).html(`${profileUser.createdLists.length}`);
            $(`#profilePageFollowers`).html(`${profileUser.followers.length}`);
            $(`#profilePageFollowing`).html(`${profileUser.following.length}`);
            $(`#profilePageUserDesc`).html(`${profileUser.description}`);
            $('#profilePageActivity').html('');
            populateRecentActivity(profileUser, "profilePageActivity");
            if (user.id === username) {
                $(`#profilePageEditButton`).removeClass('d-none');
                $(`#profilePageFollowButton`).addClass('d-none');
                $(`#profilePageFollowingButton`).addClass('d-none');
            } else if (user.hasOwnProperty('id') && user.following.includes(username)) {
                $(`#profilePageEditButton`).addClass('d-none');
                $(`#profilePageFollowButton`).addClass('d-none');
                $(`#profilePageFollowingButton`).removeClass('d-none');
            } else if (user.hasOwnProperty('id')) {
                $(`#profilePageEditButton`).addClass('d-none');
                $(`#profilePageFollowButton`).removeClass('d-none');
                $(`#profilePageFollowingButton`).addClass('d-none');
            } else {
                $(`#profilePageEditButton`).addClass('d-none');
                $(`#profilePageFollowButton`).addClass('d-none');
                $(`#profilePageFollowingButton`).addClass('d-none');
            }
            if (profileUser.createdLists.length > 0) {
                let profileUserCreatedList = allPopularLists.filter((list) => {
                    return profileUser.createdLists.includes(list.id);
                });
                generateProfileListsCards(username, profileUserCreatedList, "profilePageLists")
            } else {
                $('#profilePageLists').html("<h1 class='text-center'>No Lists Created</h1>")
            }
        }).then(() => {
            setTimeout(function () {
                $('#homePage').addClass('d-none');
                $('#searchResults').addClass('d-none');
                $('#listsPage').addClass('d-none');
                $('#discoverPage').addClass('d-none');
                $('#profilePage').removeClass('d-none')
                $(`#listModal`).modal('hide');
            }, 1000);
        })
    }

    $('#profilePageFollowButton').click(() => {
        follow();
        $('#listModal').modal('hide');
    })

    function populateUserFeed() {
        let allActivity = [];
        let allLists = allFeaturedLists;
        allPopularLists.forEach((list) => {
            allLists.push(list);
        })
        fetch(`https://wave-kaput-giant.glitch.me/users/`)
            .then(response => response.json())
            .then((users) => {
                users.forEach(function (siteUser) {
                    if (user.following.includes(siteUser.id)) {
                        siteUser.recentActivity.forEach((activity) => {
                            allActivity.push({activity, userId: siteUser.id});
                        })
                    }
                })
            }).then(() => {
            console.log("all", allActivity)
            let sortedActivity = allActivity.sort((a, b) => {
                return new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime();
            })
            console.log("sorted", sortedActivity);
            sortedActivity.forEach((currentActivity) => {
                let activitiedList = allLists.filter((list) => {
                    return currentActivity.activity.listId === list.id
                })
                fetch(`https://wave-kaput-giant.glitch.me/users/${currentActivity.userId}`)
                    .then(response => response.json()).then((userData) => {
                    if (currentActivity.activity.type === "comment") {
                        $(`#homePageUserFeed`).append(`
                                <div class="row col-10 userFeedItem">
                                    <p class="text-muted fs-5">${time_ago(currentActivity.activity.date)}</p>
                                    <p><img class="profilePictureFeedItem comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture"> <a class="fw-bold userLink" data-id="${userData.id}">${userData.id}</a> commented on <span class="profilePageRecentActivityListLink listTitle" data-id="${activitiedList[0].id}">${activitiedList[0].list_name}</span></p>
                                    <div class="row col-8 p-0 m-0 p-3 rounded-3">
                                        <div class="col-3 listComment" data-commenterId="${userData.id}">
                                            <img class="profilePictureListComment comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture">
                                            <div class="d-flex flex-column justify-content-center">
                                                <p class="mb-1" ${userData.id}</p>
                                            </div>
                                        </div>
                                        <div class="col-8">
                                            <p>${currentActivity.activity.comment}</p>
                                        </div>
                                    </div>
                                    <hr class="mt-4 text-center">
                                </div>
                                `)
                    } else if (currentActivity.activity.type === "like") {
                        $(`#homePageUserFeed`).append(`
                                <div class="row col-10 userFeedItem">
                                    <p class="text-muted fs-5">${time_ago(currentActivity.activity.date)}</p>
                                    <p><img class="profilePictureFeedItem comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture"> <a class="fw-bold userLink" data-id="${userData.id}">${userData.id}</a> liked <span class="profilePageRecentActivityListLink listTitle" data-id="${currentActivity.activity.listId}">${activitiedList[0].list_name}</span></p>
                                    <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                                        <div>
                                            <h5 class="listTitle mb-1">${activitiedList[0].list_name}</h5>
                                            <p class="mb-2 cardFontSize"><img class="profilePicture" src="img/profilePictures/default.jpg" alt="Profile Picture" id="popularListProfilePicture_${activitiedList[0].id}_homePageUserFeed_${activitiedList[0].creator}"> ${activitiedList[0].creator}  |  <span id="popularListLastEdited_${activitiedList[0].id}_homePageUserFeed">${time_ago(activitiedList[0].last_edited)}</span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${activitiedList[0].id}_homePageUserFeed">${activitiedList[0].likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${activitiedList[0].id}_homePageUserFeed">${activitiedList[0].comments.length}</span></p>
                                            <p class="mb-0 cardFontSize" id="listCard_desc${activitiedList[0].id}_homePageUserFeed"></p>
                                        </div>
                                    </div>
                                    <hr class="mt-4 text-center">
                                </div>
                                `)
                        fetch(`https://wave-kaput-giant.glitch.me/users/${activitiedList[0].creator}`)
                            .then(response => response.json()).then((creator) => {
                            $(`#popularListProfilePicture_${activitiedList[0].id}_homePageUserFeed_${activitiedList[0].creator}`).attr('src', `img/profilePictures/${creator.profilePic}.jpg`);
                        })
                        if (activitiedList[0].list_desc.length > 100) {
                            $(`#listCard_desc${activitiedList[0].id}_homePageUserFeed`).html(activitiedList[0].list_desc.slice(0, 100) + "...");
                        } else {
                            $(`#listCard_desc${activitiedList[0].id}_homePageUserFeed`).html(activitiedList[0].list_desc);
                        }
                    } else if (currentActivity.activity.type === "listAdd") {
                        $(`#homePageUserFeed`).append(`
                                <div class="row col-10 userFeedItem">
                                    <p class="text-muted fs-5">${time_ago(currentActivity.activity.date)}</p>
                                    <p><img class="profilePictureFeedItem comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture"> <a href="#mainPageBody" class="fw-bold userLink" data-id="${userData.id}">${userData.id}</a> added <span id="profilePageListAddName_${activitiedList[0].id}_homePageUserFeed_${currentActivity.activity.content.id}"></span> to <span class="profilePageRecentActivityListLink listTitle" data-id="${currentActivity.activity.listId}">${activitiedList[0].list_name}</span></p>
                                    <div class="row justify-content-center p-0 m-0">
                                        <div class="col-4 p-3 rounded-3">
                                            <img class="w-100" src="" alt="" id="profilePageActivityListAdd_homePageUserFeed_${currentActivity.activity.content.id}_${currentActivity.activity.content.id}">
                                        </div>
                                    </div>
                                    <hr class="mt-4 text-center">
                                </div>
                                `)
                        fetch(`https://api.themoviedb.org/3/${currentActivity.activity.content.type}/${currentActivity.activity.content.id}?api_key=${apiKeyTMDP}&language=en-US`)
                            .then(response => response.json()).then((data) => {
                            if (data.hasOwnProperty("title")) {
                                $(`#profilePageListAddName_${activitiedList[0].id}_homePageUserFeed_${currentActivity.activity.content.id}`).html(data.title)
                            } else {
                                $(`#profilePageListAddName_${activitiedList[0].id}_homePageUserFeed_${currentActivity.activity.content.id}`).html(data.name)
                            }
                            $(`#profilePageActivityListAdd_homePageUserFeed_${currentActivity.activity.content.id}_${currentActivity.activity.content.id}`).attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`)
                        })
                    } else if (currentActivity.activity.type === "newList") {
                        $(`#homePageUserFeed`).append(`
                                <div class="row col-10 userFeedItem">
                                    <p class="text-muted fs-5">${time_ago(currentActivity.activity.date)}</p>
                                    <p><img class="profilePictureFeedItem comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture"> <a class="fw-bold userLink" data-id="${userData.id}">${userData.id}</a> created the list: <span class="profilePageRecentActivityListLink listTitle" data-id="${currentActivity.activity.listId}">${activitiedList[0].list_name}</span></p>
                                    <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                                        <div>
                                            <h5 class="listTitle mb-1">${activitiedList[0].list_name}</h5>
                                            <p class="mb-2 cardFontSize"><img class="profilePicture" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture" id="popularListProfilePicture_${activitiedList[0].id}_homePageUserFeed_${activitiedList[0].creator}"> ${activitiedList[0].creator}  |  <span id="popularListLastEdited_${activitiedList[0].id}_homePageUserFeed">${time_ago(activitiedList[0].last_edited)}</span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${activitiedList[0].id}_homePageUserFeed">${activitiedList[0].likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${activitiedList[0].id}_homePageUserFeed">${activitiedList[0].comments.length}</span></p>
                                            <p class="mb-0 cardFontSize" id="listCard_desc${activitiedList[0].id}_homePageUserFeed"></p>
                                        </div>
                                    </div>
                                    <hr class="mt-4 text-center">
                                </div>
                                `)
                        if (activitiedList[0].list_desc.length > 100) {
                            $(`#listCard_desc${activitiedList[0].id}_homePageUserFeed`).html(activitiedList[0].list_desc.slice(0, 100) + "...");
                        } else {
                            $(`#listCard_desc${activitiedList[0].id}_homePageUserFeed`).html(activitiedList[0].list_desc);
                        }
                    } else if (currentActivity.activity.type === "follow") {
                        $(`#homePageUserFeed`).append(`
                                <div class="row col-10 userFeedItem">
                                    <p class="text-muted fs-5">${time_ago(currentActivity.activity.date)}</p>
                                    <p><img class="profilePictureFeedItem comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture"> <a class="fw-bold userLink" data-id="${userData.id}">${userData.id}</a> began following ${currentActivity.activity.user}</p>
                                    <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                                        <div class="row justify-content-center">
                                            <div class="col-3">
                                                <img class="profilePictureListComment p-0" src="img/profilePictures/default.jpg" alt="Profile Picture" id="followedUserProfilePic_${currentActivity.activity.user}_homePageUserFeed">
                                            </div>
                                            <div class="row col-9">
                                                <h5 class="mb-1">${currentActivity.activity.user}</h5>
                                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserListsCreated_${currentActivity.activity.user}_homePageUserFeed">0</h4>
                                                    <p class="text-muted cardFontSize">Lists</p>
                                                </div>
                                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserFollowers_${currentActivity.activity.user}_homePageUserFeed">0</h4>
                                                    <p class="text-muted cardFontSize">Followers</p>
                                                </div>
                                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserFollowing_${currentActivity.activity.user}_homePageUserFeed">0</h4>
                                                    <p class="text-muted cardFontSize">Following</p>
                                                </div>
                                                <p class="mb-0 cardFontSize" id="userCard_desc_${currentActivity.activity.user}_homePageUserFeed"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr class="mt-4 text-center">
                                </div>
                                `)
                        fetch(`https://wave-kaput-giant.glitch.me/users/${currentActivity.activity.user}`)
                            .then(response => response.json()).then((followedUser) => {
                            $(`#followedUserProfilePic_${currentActivity.activity.user}_homePageUserFeed`).attr('src', `img/profilePictures/${followedUser.profilePic}.jpg`);
                            $(`#followedUserListsCreated_${currentActivity.activity.user}_homePageUserFeed`).html(followedUser.createdLists.length);
                            $(`#followedUserFollowers_${currentActivity.activity.user}_homePageUserFeed`).html(followedUser.followers.length);
                            $(`#followedUserFollowing_${currentActivity.activity.user}_homePageUserFeed`).html(followedUser.following.length);
                            if (followedUser.description.length > 100) {
                                $(`#userCard_desc_${currentActivity.activity.user}_homePageUserFeed`).html(followedUser.description.slice(0, 100) + "...");
                            } else {
                                $(`#userCard_desc_${currentActivity.activity.user}_homePageUserFeed`).html(followedUser.description);
                            }
                        });
                    }
                    $('.userLink').click(function () {
                        populateProfilePage($(this).data('id'));
                    })
                })
            })
        })
    }

    function populateRecentActivity(userData, location) {
        let sortedActivity = userData.recentActivity.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        let allLists = allFeaturedLists;
        allPopularLists.forEach((list) => {
            allLists.push(list);
        })
        for (let i = 0; i < sortedActivity.length; i++) {
            let activitiedList = '';
            activitiedList = allLists.filter((list) => {
                return sortedActivity[i].listId === list.id
            })
            if (sortedActivity[i].type === "comment") {
                $(`#${location}`).append(`
            <div class="row justify-content-center">
                <p class="text-muted">${time_ago(sortedActivity[i].date)}</p>
                <p>${userData.id} commented on <a class="profilePageRecentActivityListLink listTitle" data-id="${activitiedList[0].id}" data-bs-toggle="modal" data-bs-target="#listModal">${activitiedList[0].list_name}</a></p>
                <div class="row col-8 p-0 m-0 p-3 rounded-3">
                    <div class="col-3 listComment" data-commenterId="${userData.id}">
                        <img class="profilePictureListComment comment_${userData.id}" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture">
                        <div class="d-flex flex-column justify-content-center">
                            <p class="mb-1" ${userData.id}</p>
                        </div>
                    </div>
                    <div class="col-8">
                        <p>${sortedActivity[i].comment}</p>
                    </div>
                </div>
                <hr class="mt-4 col-10 text-center">
            </div>
            `)
            } else if (sortedActivity[i].type === "like") {
                $(`#${location}`).append(`
            <div class="row justify-content-center">
                <p class="text-muted">${time_ago(sortedActivity[i].date)}</p>
                <p>${userData.id} liked <a class="profilePageRecentActivityListLink listTitle" data-id="${sortedActivity[i].listId}">${activitiedList[0].list_name}</a></p>
                <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                    <div>
                        <h5 class="listTitle mb-1">${activitiedList[0].list_name}</h5>
                        <p class="mb-2 cardFontSize"><img class="profilePicture" src="img/profilePictures/default.jpg" alt="Profile Picture" id="popularListProfilePicture_${activitiedList[0].id}_${location}_${activitiedList[0].creator}"> ${activitiedList[0].creator}  |  <span id="popularListLastEdited_${activitiedList[0].id}_${location}">${time_ago(activitiedList[0].last_edited)}</span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${activitiedList[0].id}_${location}">${activitiedList[0].likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${activitiedList[0].id}_${location}">${activitiedList[0].comments.length}</span></p>
                        <p class="mb-0 cardFontSize" id="listCard_desc${activitiedList[0].id}_${location}"></p>
                    </div>
                </div>
                <hr class="mt-4 col-10 text-center">
            </div>
            `)
                fetch(`https://wave-kaput-giant.glitch.me/users/${activitiedList[0].creator}`)
                    .then(response => response.json()).then((creator) => {
                    $(`#popularListProfilePicture_${activitiedList[0].id}_${location}_${activitiedList[0].creator}`).attr('src', `img/profilePictures/${creator.profilePic}.jpg`);
                })
                if (activitiedList[0].list_desc.length > 100) {
                    $(`#listCard_desc${activitiedList[0].id}_${location}`).html(activitiedList[0].list_desc.slice(0, 100) + "...");
                } else {
                    $(`#listCard_desc${activitiedList[0].id}_${location}`).html(activitiedList[0].list_desc);
                }
            } else if (sortedActivity[i].type === "listAdd") {
                $(`#${location}`).append(`
            <div class="row justify-content-center">
                <p class="text-muted">${time_ago(sortedActivity[i].date)}</p>
                <p>${userData.id} added <span id="profilePageListAddName_${activitiedList[0].id}_${location}_${sortedActivity[i].content.id}"></span> to <a class="profilePageRecentActivityListLink listTitle" data-id="${sortedActivity[i].listId}">${activitiedList[0].list_name}</a></p>
                <div class="row justify-content-center p-0 m-0">
                    <div class="col-4 p-3 rounded-3">
                        <img class="w-100" src="" alt="Content Poster" id="profilePageActivityListAdd_${sortedActivity[i].content.id}">
                    </div>
                </div>
                <hr class="mt-4 col-10 text-center">
            </div>
            `)
                fetch(`https://api.themoviedb.org/3/${sortedActivity[i].content.type}/${sortedActivity[i].content.id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json()).then((data) => {
                    if (data.hasOwnProperty("title")) {
                        $(`#profilePageListAddName_${activitiedList[0].id}_${location}_${sortedActivity[i].content.id}`).html(data.title)
                    } else {
                        $(`#profilePageListAddName_${activitiedList[0].id}_${location}_${sortedActivity[i].content.id}`).html(data.name)
                    }
                    $(`#profilePageActivityListAdd_${sortedActivity[i].content.id}`).attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`)
                })
            } else if (sortedActivity[i].type === "newList") {
                $(`#${location}`).append(`
            <div class="row justify-content-center">
                <p class="text-muted">${time_ago(sortedActivity[i].date)}</p>
                <p>${userData.id} created the list: <a class="profilePageRecentActivityListLink listTitle" data-id="${sortedActivity[i].listId}">${activitiedList[0].list_name}</a></p>
                <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                    <div>
                        <h5 class="listTitle mb-1">${activitiedList[0].list_name}</h5>
                        <p class="mb-2 cardFontSize"><img class="profilePicture" src="img/profilePictures/${userData.profilePic}.jpg" alt="Profile Picture" id="popularListProfilePicture_${activitiedList[0].id}_${location}_${activitiedList[0].creator}"> ${activitiedList[0].creator}  |  <span id="popularListLastEdited_${activitiedList[0].id}_${location}">${time_ago(activitiedList[0].last_edited)}</span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${activitiedList[0].id}_${location}">${activitiedList[0].likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${activitiedList[0].id}_${location}">${activitiedList[0].comments.length}</span></p>
                        <p class="mb-0 cardFontSize" id="listCard_desc${activitiedList[0].id}_${location}"></p>
                    </div>
                </div>
                <hr class="mt-4 col-10 text-center">
            </div>
            `)
                if (activitiedList[0].list_desc.length > 100) {
                    $(`#listCard_desc${activitiedList[0].id}_${location}`).html(activitiedList[0].list_desc.slice(0, 100) + "...");
                } else {
                    $(`#listCard_desc${activitiedList[0].id}_${location}`).html(activitiedList[0].list_desc);
                }
            } else if (sortedActivity[i].type === "follow") {
                $(`#${location}`).append(`
                <div class="row justify-content-center">
                    <p class="text-muted">${time_ago(sortedActivity[i].date)}</p>
                    <p>${userData.id} began following ${sortedActivity[i].user}</p>
                    <div class="row justify-content-center col-8 p-0 m-0 p-3 rounded-3">
                        <div class="row justify-content-center">
                            <div class="col-3">
                                <img class="profilePictureListComment p-0" src="img/profilePictures/default.jpg" alt="Profile Picture" id="followedUserProfilePic_${sortedActivity[i].user}_${location}">
                            </div>
                            <div class="row col-9">
                                <h5 class="mb-1">${sortedActivity[i].user}</h5>
                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserListsCreated_${sortedActivity[i].user}_${location}">0</h4>
                                    <p class="text-muted cardFontSize">Lists</p>
                                </div>
                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserFollowers_${sortedActivity[i].user}_${location}">0</h4>
                                    <p class="text-muted cardFontSize">Followers</p>
                                </div>
                                <div class="col-4 d-flex flex-column align-content-end align-items-center">
                                    <h4 class="mb-0 text-center cardFontSize" id="followedUserFollowing_${sortedActivity[i].user}_${location}">0</h4>
                                    <p class="text-muted cardFontSize">Following</p>
                                </div>
                                <p class="mb-0 cardFontSize" id="userCard_desc_${sortedActivity[i].user}_${location}"></p>
                            </div>
                        </div>
                    </div>
                    <hr class="mt-4 col-10 text-center">
                </div>
                `)
                fetch(`https://wave-kaput-giant.glitch.me/users/${sortedActivity[i].user}`)
                    .then(response => response.json()).then((followedUser) => {
                    $(`#followedUserProfilePic_${sortedActivity[i].user}_${location}`).attr('src', `img/profilePictures/${followedUser.profilePic}.jpg`);
                    $(`#followedUserListsCreated_${sortedActivity[i].user}_${location}`).html(followedUser.createdLists.length);
                    $(`#followedUserFollowers_${sortedActivity[i].user}_${location}`).html(followedUser.followers.length);
                    $(`#followedUserFollowing_${sortedActivity[i].user}_${location}`).html(followedUser.following.length);
                    if (followedUser.description.length > 100) {
                        $(`#userCard_desc_${sortedActivity[i].user}_${location}`).html(followedUser.description.slice(0, 100) + "...");
                    } else {
                        $(`#userCard_desc_${sortedActivity[i].user}_${location}`).html(followedUser.description);
                    }
                });
            }
        }
        $(`.profilePageRecentActivityListLink`).click(function () {
            populateListModal($(this).data('id'))
        });
    }

    function generateProfileListsCards(username, lists, location) {
        $(`#${location}`).html('');
        lists.forEach((list) => {
            $(`#${location}`).append(`
                <div class="card col-12 m-1 border-0 p-3 rounded-3 listCard">
                  <div class="row g-0">
                    <div class="col-12">
                      <div>
                        <div class="d-flex justify-content-between">
                            <h5 class="listTitle" id="listCard_${list.id}_${location}" data-id="${list.id}">${list.list_name}</h5>
                            <button class="btn btn-dark d-none" data-id="${list.id}" id="editListButton_${list.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        </div>
                        <p class="mb-0"><span id="popularListLastEdited_${list.id}_${location}"></span> | <i class="fa-solid fa-heart"></i> <span id="listCardLikes_${list.id}_${location}">${list.likes}</span>  |  <i class="fa-solid fa-comment"></i> <span id="listCardComments_${list.id}_${location}">${list.comments.length}</span></p>
                        <p class="mb-0" id="listCard_desc${list.id}_${location}"></p>
                      </div>
                    </div>
                  </div>
                </div>
        `)
            $(`#popularListLastEdited_${list.id}_${location}`).html(`Updated ${time_ago(list.last_edited)}`)
            $(`#editListButton_${list.id}`).click(function () {
                populateEditListModal($(this).data('id'));
            })
            if (user.id === username) {
                $(`#editListButton_${list.id}`).removeClass('d-none');
            }
            $(`#listCard_${list.id}_${location}`).click(function () {
                populateListModal($(this).data("id"));
            });
            (list.list_desc.length > 100) ? $(`#listCard_desc${list.id}_${location}`).html(list.list_desc.slice(0, 100) + "...") : $(`#listCard_desc${list.id}_${location}`).html(list.list_desc);
        })
    }

    function follow() {
        let updatedFollowingList = {
            following: user.following, recentActivity: recentActivityPush({
                type: "follow",
                user: $(`#profilePageUsername`).html(),
                date: new Date()
            })
        };
        updatedFollowingList.following.push($(`#profilePageUsername`).html());
        const url = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
        const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedFollowingList)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            user.following = updatedFollowingList.following;
            user.recentActivity = updatedFollowingList.recentActivity;
            $(`#profilePageFollowButton`).addClass('d-none');
            $(`#profilePageFollowingButton`).removeClass('d-none');
        });
        fetch(`https://wave-kaput-giant.glitch.me/users/${$(`#profilePageUsername`).html()}`)
            .then(response => response.json())
            .then((profileUser) => {
                let updatedFollowersList = {followers: profileUser.followers};
                updatedFollowersList.followers.push(user.id);
                const url1 = `https://wave-kaput-giant.glitch.me/users/${$(`#profilePageUsername`).html()}`;
                const options1 = {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedFollowersList)
                };
                fetch(url1, options1)
                    .then(response => response.json()).then(data => {
                    $('#profilePageFollowers').html(updatedFollowersList.followers.length);
                    $(`#profilePageFollowButton`).addClass('d-none');
                    $(`#profilePageFollowingButton`).removeClass('d-none');
                })
            })
    }

    $('#profilePageFollowingButton').click(() => {
        unfollow();
    })

    function unfollow() {
        let updatedFollowingList = {following: user.following.filter(item => item !== $(`#profilePageUsername`).html())};
        const url = `https://wave-kaput-giant.glitch.me/users/${user.id}`;
        const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedFollowingList)
        };
        fetch(url, options)
            .then(response => response.json()).then(data => {
            user.following = updatedFollowingList.following;
            $(`#profilePageFollowButton`).addClass('d-none');
            $(`#profilePageFollowingButton`).removeClass('d-none');
        });
        fetch(`https://wave-kaput-giant.glitch.me/users/${$(`#profilePageUsername`).html()}`)
            .then(response => response.json())
            .then((profileUser) => {
                let updatedFollowersList = {followers: profileUser.followers.filter(item => item !== user.id)};
                const url1 = `https://wave-kaput-giant.glitch.me/users/${$(`#profilePageUsername`).html()}`;
                const options1 = {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedFollowersList)
                };
                fetch(url1, options1)
                    .then(response => response.json()).then(data => {
                    $('#profilePageFollowers').html(updatedFollowersList.followers.length);
                    $(`#profilePageFollowButton`).removeClass('d-none');
                    $(`#profilePageFollowingButton`).addClass('d-none');
                })
            })
    }

    function recentActivityPush(newActivity) {
        let sortedActivity = user.recentActivity.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        if (sortedActivity.length === 15) {
            sortedActivity[15] = newActivity;
        } else {
            sortedActivity.push(newActivity);
        }
        return sortedActivity
    }

    function populateEditListModal(listId) {
        $('#editListModalMovies').html('');
        $(`#editListModalComments`).html('');
        $(`#editListModal`).data('data-list-id', listId);
        fetch(`https://daffy-tasteful-brownie.glitch.me/lists/${listId}`)
            .then(response => response.json()).then((list) => {
            for (let i = 0; i < list.content.length; i++) {
                fetch(`https://api.themoviedb.org/3/${list.content[i].type}/${list.content[i].id}?api_key=${apiKeyTMDP}&language=en-US`)
                    .then(response => response.json())
                    .then((data) => {
                            if (list.content[i].type === 'movie') {
                                $(`#editListModalMovies`).append(`
                                <div class="rounded-3 m-2" data-id="${list.content[i].id}" data-type="${list.content[i].type}" id="editListContent_${list.content[i].id}">
                                    <button class="editListDeleteButton btn-danger btn d-none"><i class="fa-solid fa-trash"></i></button>
                                    <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="rounded-2 editListContent" alt="Movie Poster" style="height: 20em">
                                </div>
                            `)
                            } else {
                                $(`#editListModalMovies`).append(`
                                <div class="rounded-3 m-2" data-id="${list.content[i].id}" data-type="${list.content[i].type}" id="editListContent_${list.content[i].id}">
                                    <button class="editListDeleteButton btn-danger btn d-none"><i class="fa-solid fa-trash"></i></button>
                                    <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" class="rounded-2 editListContent" alt="Movie Poster" style="height: 20em">
                                </div>
                            `)
                            }
                            $(`#editListContent_${list.content[i].id}`).hover(
                                function () {
                                    $(`#editListContent_${list.content[i].id}`).children().addClass('contentOutline');
                                },
                                function () {
                                    $(`#editListContent_${list.content[i].id}`).children().removeClass('contentOutline');
                                }
                            ).click(function () {
                                $(`#editListContent_${list.content[i].id}`).children(":button").toggleClass('d-none');
                            });
                            $('.editListDeleteButton').click(function () {
                                $(this).parent().remove();
                            })
                        }
                    )
            }
            $(`#editListModalTitle`).val(list.list_name);
            $(`#editListModalCreator`).html(list.creator);
            $(`#editListModalLastUpdated`).html(`Updated ${time_ago(list.last_edited)} | `)
            $(`#editListModalDescription`).val(list.list_desc);
            $(`#editListLike`).html(`${list.likes}`);
            fetch(`https://wave-kaput-giant.glitch.me/users/${list.creator}`)
                .then(response => response.json())
                .then((data) => {
                    $(`#editListModalProfilePicture`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
                })
            $(`#editListCommentCounter`).html(`${list.comments.length}`);
            if (list.comments.length === 0) {
                $(`#editListModalComments`).append(`
                        <div class="row col-7 p-0 m-0 justify-content-center">
                            <h1 class="text-center">No Comments Yet!</h1>
                        </div>
                        <div class="col-7">
                            <hr>
                        </div>
                    `)
            } else {
                list.comments.forEach((comment) => {
                    $(`#editListModalComments`).append(`
                        <div class="row col-7 p-0 m-0">
                            <div class="d-flex col-4 listComment" data-commenterId="${comment.user}">
                                <img class="profilePictureListComment comment_${comment.user} me-4" src="img/profilePictures/default.jpg" alt="Profile Picture">
                                <div class="d-flex flex-column justify-content-center">
                                    <p class="mb-1 text-center" data-bs-toggle="modal" data-bs-target="#listModal"> ${comment.user}</p>
                                    <p class="text-muted text-center">${time_ago(comment.date)}</p>
                                </div>
                            </div>
                            <div class="col-8">
                                <p>${comment.comment}</p>
                            </div>
                        </div>
                        <div class="col-7">
                        <hr>
                        </div>
                    `)
                    $(`.listComment`).click(function () {
                        populateProfilePage($(this).data('commenterid'));
                    })
                    fetch(`https://wave-kaput-giant.glitch.me/users/${comment.user}`)
                        .then(response => response.json()).then((data) => {
                        $(`.comment_${comment.user}`).attr('src', `img/profilePictures/${data.profilePic}.jpg`)
                    })
                })
            }
        }).then($(`#editListModal`).modal('show'));
    }

    $('.sortable-list').sortable({
        connectWith: '.sortable-list',
        update: function (event, ui) {
            let changedList = this.id;
            let order = $('#editListModalMovies').sortable('toArray');
        }
    });

    function getContentOrder() {
        let content = [];
        $('#editListModalMovies').sortable('toArray').forEach((item) => {
            content.push({id: $(`#${item}`).data('id'), type: $(`#${item}`).data('type')})
        })
        return content;
    }

    $(`#editListSaveChanges`).click(() => {
        editListSave($(`#editListModal`).data('data-list-id'));
        $(`#editListModal`).modal('hide');
    });

    function editListSave(listId) {
        let updateContent = {
            list_name: $(`#editListModalTitle`).val(),
            list_desc: $(`#editListModalDescription`).val(),
            content: getContentOrder(),
            last_edited: new Date()
        }
        const url = `https://daffy-tasteful-brownie.glitch.me/lists/${listId}`;
        const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateContent)
        };
        fetch(url, options)
            .then(response => response.json()).then(data2 => {
            let replacementIndex = allPopularLists.findIndex((list) => {
                return list.id === parseInt(listId);
            })
            allPopularLists[replacementIndex] = data2;
            populateEditListModal($(`#editListModal`).data('data-list-id'));
            populateProfilePage(user.id);
        })
    }

    function returnSmallest(a, b) {
        return a < b ? a : b;
    }

    function time_ago(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        let time_formats = [
            [60, 'seconds', 1],
            [120, '1 minute ago', '1 minute from now'],
            [3600, 'minutes', 60],
            [7200, '1 hour ago', '1 hour from now'],
            [86400, 'hours', 3600],
            [172800, 'Yesterday', 'Tomorrow'],
            [604800, 'days', 86400],
            [1209600, 'Last week', 'Next week'],
            [2419200, 'weeks', 604800],
            [4838400, 'Last month', 'Next month'],
            [29030400, 'months', 2419200],
            [58060800, 'Last year', 'Next year'],
            [2903040000, 'years', 29030400],
            [5806080000, 'Last century', 'Next century'],
            [58060800000, 'centuries', 2903040000]
        ];
        let seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;
        if (seconds === 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        let i = 0,
            format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    function toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : ` ${minutes}m`;
    }

    function randomizeLists(lists) {
        let currentIndex = lists.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [lists[currentIndex], lists[randomIndex]] = [
                lists[randomIndex], lists[currentIndex]];
        }
        return lists;
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

    $('.navLink').click(function () {
        $('.navLink').removeClass('active');
        $(this).addClass('active');
    })
})


//TODOS:

// responseive!
//
//highlight movies already on list in list modal dropdown

// discover top rated card size when only limited number of cards
//
// footer with API and my contact information


//BUGS
