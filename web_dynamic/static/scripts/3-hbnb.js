const $ = window.$;
$(document).ready(function () {
  $('.amenities h4').html('&nbsp;');
  const amenityDict = {};
  $('input[type=checkbox]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).prop('checked')) {
      amenityDict[amenityId] = amenityName;
    } else {
      delete amenityDict[amenityId];
    }
   /*if (amenityDict) {
      console.log('full dict')
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
    } else {
      console.log('empty dict');
      $('.amenities h4').html('&nbsp;');
    }
    */
   
    if (Object.keys(amenityDict).length === 0) {
  $('.amenities h4').html('&nbsp;');
} else {
  $('.amenities h4').text(Object.values(amenityDict).join(', '));
}
  });
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
      if (data && data.length > 0) {
        const placesSection = $('section.places');
        data.forEach(function (place) {
          const article = $('<article>');
          article.append('<div class="title_box">');
          article.find('.title_box').append('<h2>' + place.name + '</h2>');
          article.find('.title_box').append('<div class="price_by_night">$' + place.price_by_night + '</div>');
          article.append('<div class="information">');
          article.find('.information').append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '') + '</div>');
          article.find('.information').append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '') + '</div>');
          article.find('.information').append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '') + '</div>');
          article.append('<div class="user">');
          article.append('<div class="description">' + place.description + '</div>');
          placesSection.append(article);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
});
