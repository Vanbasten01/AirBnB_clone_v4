const $ = window.$;
$(document).ready(function () {
  $('.amenities h4').html('&nbsp;');
  $('.locations h4').html('&nbsp;');
  const amenityDict = {};
  const stateDict = {};
  const cityDict = {};
  $('.amenities input[type=checkbox]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).prop('checked')) {
      amenityDict[amenityId] = amenityName;
      console.log('Updated amenity dictionary:', amenityDict);
    } else {
      delete amenityDict[amenityId];
    }
    if (Object.keys(amenityDict).length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else {
      $('.amenities h4').text(Object.values(amenityDict).join(', '));
    }
  });
  $('.locations h2 input[type=checkbox]').change(function () {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');
    if ($(this).prop('checked')) {
      stateDict[stateId] = stateName;
      console.log('Updated state dictionary:', stateDict);
    } else {
      delete stateDict[stateId];
    }
    if (Object.keys(stateDict).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(stateDict).join(', '));
    }
  });
  $('.locations li ul input[type=checkbox]').change(function () {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');
    if ($(this).prop('checked')) {
      cityDict[cityId] = cityName;
      cityDict[cityId] = cityName;
      console.log('Updated city dictionary:', cityDict);
    } else {
      delete cityDict[cityId];
    }
    if (Object.keys(cityDict).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(cityDict).join(', '));
    }
  });

  $(document).on('click', '.toggle-review', function () {
    const aplaceId = $(this).closest('.reviews').data('place');
    fetchReviews(aplaceId);
  });

  function renderPlaces (data) {
    const placesSection = $('section.places');
    data.forEach(function (place) {
      const article = $('<article>');
      article.append('<div class="title_box">');
      article.find('.title_box').append('<h2>' + place.name + '</h2>');
      article.find('.title_box').append('<div class="price_by_night">$' + place.price_by_night + '</div>');
      article.append('<div class="information">');
      article.find('.information').append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
      article.find('.information').append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
      article.find('.information').append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');
      article.append('<div class="user">');
      article.append('<div class="description">' + place.description + '</div>');
      article.append('<div class="reviews" data-place="' + place.id + '">');
      article.find('.reviews').append('<h2 class="article_subtitle">Reviews<span class="article_subtitle_span toggle-review">Show</span></h2><ul></ul></div>');
      // Append the article to the places section
      placesSection.append(article);
    });
  }

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      renderPlaces(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
  $('button').click(function () {
    const amenityidsList = Object.keys(amenityDict);
    const stateidsList = Object.keys(stateDict);
    const cityidsList = Object.keys(cityDict);
    const Dict = {};
    if (amenityidsList) {
      Dict.amenities = amenityidsList;
    }
    if (stateidsList) {
      if (cityidsList.length === 0) {
        Dict.states = stateidsList;
      }
    }
    if (cityidsList) {
      Dict.cities = cityidsList;
    }

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify(Dict),
      success: function (data) {
        $('section.places').empty();
        renderPlaces(data);
        console.log(data);
      }
    });
  });
  function fetchReviews (placeId) {
    const $reviews = $(`.reviews[data-place="${placeId}"]`);
    const $toggleReview = $reviews.find('.toggle-review');
    console.log(placeId);

    if ($toggleReview.text() === 'Show') {
      const $h2 = $reviews.find('h2');
      // GET request to fetch reviews
      $.ajax({
        url: `http://localhost:5001/api/v1/places/${placeId}/reviews`,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);
          $h2.html(`${data.length} Reviews<span class="article_subtitle_span toggle-review">Hide</span>`);
          const $ul = $reviews.find('ul');
          data.forEach((rev) => {
            $.ajax({
              url: `http://localhost:5001/api/v1/users/${rev.user_id}`,
              type: 'GET',
              dataType: 'json',
              success: (u) => {
                console.log(rev.user_id);
                console.log(u);
                $ul.append(`
                                <li>
                                    <h3>From ${u.first_name} ${u.last_name} on ${rev.created_at}</h3>
                                    <p>${rev.text}</p>
                                </li>`);
              },
              error: (jqXHR, textStatus, errorThrown) => {
                console.error(textStatus, errorThrown);
              }
            });
          });
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.error(textStatus, errorThrown);
        }
      });
    } else {
      $reviews.find('h2').html('Reviews<span class="article_subtitle_span toggle-review">Show</span>');
      $reviews.find('ul').empty();
    }
  }
});
