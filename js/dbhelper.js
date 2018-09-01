/**
 * Common database helper functions.
 */

 // RL TODO Add import idb, createObjectStore, etc stuff here.


class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // RL  const port = 8000 // Change this to your server port
    const port = 1337;
    console.log("port1 = ",port);
    // RL return `http://localhost:${port}/data/restaurants.json`;
    return `http://localhost:${port}/restaurants`;
  }

  // RL TODO Add static get DATABASE_REVIEWS_URL() here.

  /**
   * Fetch all restaurants.
   */

  // RL TODO Will need to also pass id as a parameter to function fetchRestaurants.
  static fetchRestaurants(callback) {

  /* RL Comment out this entire xhr block and replace with fetch block
    //RL TODO Replace xhr with fetchURL
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    // RL TODO fetch will use DBHelper.DATABASE_URL and then method: "GET"
    // RL TODO Comment out the rest of this xhr stuff once I get fetch working.
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        console.log("xhr.responseText = ", xhr.responseText);
        const json = JSON.parse(xhr.responseText);
        console.log("json.restaurants = ", json.restaurants);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        console.log("ERROR BABY");
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  */

// RL Using fetch
    fetch(`${DBHelper.DATABASE_URL}`)
    .then(function(response) {
      return response.json();
    })
    .then(data => callback(null, data))
    .catch(error => callback(`Request failed. Returned status of ${error,statusText}`, null));
  }
/* */


  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id); // RL TODO Should I change this line?
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    }); // RL TODO Might need id here
  }

  // RL TODO Add static fetchRestaurantReviewsById(id, callback) here.

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {

    // RL TODO Maybe add conditional if(fetchedNeighborhoods) here.

    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        // RL TODO Maybe change uniqueNeighborhoods to fetchedNeighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {

    // RL TODO Maybe add if (fetchedCuisines) here

    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        // RL TODO Maybe replace uniqueCuisines with fetchedCuisines below.
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
   // RL TODO Maybe add type as a parameter to static imageUrlForRestaurant
  static imageUrlForRestaurant(restaurant) {
    // RL TODO Maybe check for restaurant.photograph here and return URL with ${type} to path based on it.
    // RL return (`/img/${restaurant.photograph}`);
    return (`/img/${restaurant.photograph}.jpg`);

  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // RL TODO The section below will be different if use GoogleMaps instead of MapBox
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

// RL TODO Add static getStaticAllRestaurantsMapImage(restaurants)
// RL TODO Add static addPendingRequestToQueue(url, method, body)
// RL TDOD Add static nextPending()
// RL TODO Add static attemptCommitPending(callback)
// RL TODO Add static updateCachedRestaurantData(id, updateObj)
// RL TODO Add static updateFavorite(id, newState, callback)
// RL TODO Add static updateCachedRestaurantReview(id, bodyObj)
// RL TODO Add static saveNewReview(id, bodyObj, callback)
// RL TODO Add static handleFavoriteClick(id, newState)
// RL TODO Add static saveReview(id, name, rating, comment, callback)


