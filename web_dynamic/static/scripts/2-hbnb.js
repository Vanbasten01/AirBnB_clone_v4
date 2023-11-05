const $ = window.$;
$(document).ready(function () {
  const amenityDict = {};
  $('input[type=checkbox]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).prop('checked')) {
      amenityDict[amenityId] = amenityName;
    } else {
      delete amenityDict[amenityId];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});