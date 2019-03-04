let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
  // RL initMap(); // added
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
console.log('Before fetchNeighborhoods = () =>: ');
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      // RL Change next line
      // RL console.error(error);
      console.log(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      // RL Change next line
      // RL console.error(error);
      console.log(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
console.log('main.js: Before initMap = () =>: ');
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    // mapboxToken: '<your MAPBOX API KEY HERE>',
    mapboxToken: SECRET.mapbox_key,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  // RL debugger;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      // RL Change next line
      // RL console.error(error);
      console.log(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  // RL debugger;
  console.log('Before addMarkersToMap');
  addMarkersToMap();
  console.log('After addMarkersToMap');
}

/**
 * Create restaurant HTML.
 */
console.log('Before createRestaurantHTML');
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);


  /**
   * RL Give alt text to image
   */
  /**
   * Reviewer: Yes, this is the way we should use alternate texts dynamically. Great!! You need to fix similarly for the restaurant details page.
   */
  image.alt = "photo of " + restaurant.name + " restaurant";
  console.log('RL4: image.alt: ', image.alt);


  // RL Italiren yong IntersectionObserver here between image.alt and li.append(image)


  li.append(image);


  /**
 * RL Change h1 to h3 for restaurant.name.
 */
  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  li.append(name);


  // RL Stage3 Add favorite - LZ
  const favorite = document.createElement('button');
  favorite.innerHTML = '♥';
  /*
  favorite.innerHTML = isFavorite
    ? restaurant.name + "is a favorite"
    : restaurant.name + "is not a favorite"
    */
  favorite.classList.add("fav_btn");
  // RL Toggle favorite status on click
  // RL debugger;
  favorite.onclick = function() {
    const isFavNow = !restaurant.is_favorite;
    DBHelper.updateFavoriteStatus(restaurant.id, isFavNow);
    restaurant.is_favorite = !restaurant.is_favorite
    changeFavElementClass(favorite, restaurant.is_favorite)

    // RL From w3schools https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_toggle_class
    // RL element.classList.toggle("isFavorite");

  };
  changeFavElementClass(favorite, restaurant.is_favorite)
  li.append(favorite);

/*
  // RL Stage3 Add favorite - DB
  const isFavorite = (restaurant["is_favorite"] && restaurant["is_favorite"].toString() === "true") ? true : false;
  const favoriteDiv = document.createElement("div");
  favoriteDiv.className = "favorite-icon";
  const favorite = document.createElement('button'); // RL: Both LZ and DB req button
  favorite.style.background = isFavorite
    ? 'url("icons/002-like.svg") no-repeat'
    : 'url("icons/001-like-1.svg") no-repeat'
  favorite.innerHTML = isFavorite
    ? restaurant.name + "is a favorite"
    : restaurant.name + "is not a favorite"
  favorite.id = "favorite-icon" + restaurant.id;
  favorite.onclick = event => handleFavoriteClick(restaurant.id, !isFavorite);
  favoriteDiv.append(favorite);
  div.append(favoriteDiv);
*/

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details for ' + restaurant.name;
  more.href = DBHelper.urlForRestaurant(restaurant);
  console.log('RL: more.href: ', more.href);
  li.append(more)

  return li
}

// RL Stage3
changeFavElementClass = (el, fav) => {
  if (!fav) {
    el.classList.remove('favorite_yes');
    el.classList.add('favorite_no');
    el.setAttribute('aria-label', 'mark as favorite');
    // RL favorite.innerHTML = '♥ Favorite? Yes';
  } else {
    console.log('toggle yes upd');
    el.classList.remove('favorite_no');
    el.classList.add('favorite_yes');
    el.setAttribute('aria-label', 'remove as favorite');
    // RL favorite.innerHTML = '♥ Favorite? No';
  }
}

/**
 * Add markers for current restaurants to the map.
 */
console.log('Add markers for current restaurants to the map.');
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
  // RL debugger;

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

