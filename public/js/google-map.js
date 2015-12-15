angular.module('GoogleMap', []).factory('GoogleMap', function() {
  var GoogleMap = {};
  var places = [];
  var map;
  var infowindow;
  var loaded = false;

  GoogleMap.load = function(placeIds) {
    if (loaded) {
      initMap(placeIds);
    } else {
      $.ajax({
        url: "https://maps.googleapis.com/maps/api/js",
        dataType: 'script',
        data: {
          key: "AIzaSyAyKVis94HQFIABYgPsPWkxsgLgTuGnb_8",
          libraries: "places"
        },
        success: function(response) {
          loaded = true;
          initMap(placeIds);
        }
      });
    }
  }

  function centerMap(places) {
    var bounds = new google.maps.LatLngBounds();
    for(var i = 0; i < places.length; i++) {
      if ( !places[i].pending ) {
        var point = new google.maps.LatLng(places[i].lat, places[i].lon);
        bounds.extend(point);
      }
    }
    map.setCenter(bounds.getCenter());
  }

  function createMarker(place, label) {
    var marker = new google.maps.Marker({
      map: map,
      position: {lat: place.lat, lng: place.lon},
      label: label
    });
    google.maps.event.addListener(marker, 'click', function() {
      var content = "<b>" + place.name + "</b><br>" + place.address + "<br>"
      if (place.website) {
        content += "<a href='" + place.website + "'>" + place.website + "</a>"
      }
      infowindow.setContent(content);
      infowindow.open(map, this);
    });
  }

  function initMap(places) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.0786291, lng: -76.921581},
      zoom: 11
    });

    infowindow = new google.maps.InfoWindow();

    var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, 0)
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }
      marker.setPosition(place.geometry.location);

      var address = '<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '<br>';

      var place_index = places.map(function(place){return place.place_id;}).indexOf(place.place_id)
      if ( place_index == -1) {
        var add_link = '<a class="suggest" href="#locations">Suggest This Place!</a>';
      } else if ( places[place_index].pending ) {
        var add_link = "<i>We're Already Looking Into Adding this Location...</i>";
      } else {
        var add_link = "<i>We Already Host Events at this Location...</i>";
      }

      infowindow.setContent(address + add_link);
      infowindow.open(map, marker);

      $('a.suggest').on('click', function(event){
        event.preventDefault();
        var data = {
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng()
        }
        $.ajax({
          url: '/places',
          method: 'POST',
          data: data,
          success: function(data){
            places.push(place);
            $(event.currentTarget).replaceWith("<i>We'll Look Into Adding this Location...Thanks!</i>");
          }
        });
      });
    });

    var label = 1;
    for(i=0; i < places.length; i++){
      if ( !places[i].pending ) {
        createMarker(places[i], (label++).toString());
      }
    }
    centerMap(places);
  }

  return GoogleMap;
});