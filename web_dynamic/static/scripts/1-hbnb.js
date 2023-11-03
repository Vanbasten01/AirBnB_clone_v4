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
});
