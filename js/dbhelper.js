/**
 * Common database helper functions.
 */

// Ni TODO None of this IIFE stuff is necessary out here.  All of the code can be put inside the DBHelper class.

// RL TODO Add import idb, createObjectStore, etc stuff here.
// RL https://developers.google.com/web/ilt/pwa/lab-indexeddb

// RL (from Working with IndexedDB & Lab: IndexedDB)
var idbApp = (function() {
// RL (function() {

// RL Allison said to get rid of this -->   'use strict';

  // RL check for indexedDB support (from Working with IndexedDB & Lab: IndexedDB)
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB. What up with that?!?');
    return;
  }

  // RL open database (from Working with IndexedDB & Lab: IndexedDB)
  // RL get error idb not defined
  var dbPromise = idb.open('restaurant-review', 1, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        // a placeholder case so that the switch block will
        // execute when the database is first created
        // (oldVersion is 0)
        // RL debugger;
        console.log('case 0: but NOT Creating the restaurant review object store');
        // RL upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
      case 1:
        //RL debugger;
        console.log('case 1: Creating the restaurant review object store');
        upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
    }
  });

  // RL NS about these below
  // add restaurants to database
  function addRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
      .then(response => response.json())
      .then(function(restaurants) {
      console.log('successfully pulled restaurants json data')
      // now cache it -- using put(restaurant)
      dbPromise.then( (db) => {
        let restaurantValStore = db.transaction('restaurants', 'readwrite').objectStore('restaurants')

          // RL pythonic ..LOL ...  for (const restaurant of restaurants) {
          restaurants.forEach((restaurant) => {

            restaurantValStore.put(restaurant)
          })
      })
      // now return it -- using getAll()
        callback(null, restaurants);
      }).catch(function (err) {
        dbPromise.then( (db) => {
          // RL Combined let tx = and let restaurantValStore = steps into one line below.
          let restaurantValStore = db.transaction('restaurants').objectStore('restaurants');
          restaurantValStore.getAll()
            // RL .then(restaurants => callback(null, restaurants));
            .then(restaurants => (null, restaurants));
              
        })
      })
  }

  // RL get restaurant by id -- using get(parseInt(id))
  function getByID(id) {
    // RL (from Lab: IndexedDB)
    return dbPromise.then(function(db) {
      const tx = db.transaction('restaurants', 'readonly');
      const store = tx.objectStore('restaurants');
      // RL no index so instead of index.openCursor(range) use store.get(parseInt(id))
      return store.get(parseInt(id));
      }).catch(function(e) {
      console.log("idbApp.fetchRestaurantById errored out:", e);
    });
  }

  // RL get all restaurants (Left as an exercise in Lab: IndexedDB)
  function getAll() {
  dbPromise.then(db => {
    return db.transaction('restaurants')
      // RL Get all objects from the restaurants object store using getAll() method on the object store.
      .objectStore('restaurants').getAll();
  }).then(allObjs => console.log(allObjs));
  }

  // RL return promises
  return {
    dbPromise: dbPromise,
    addRestaurants: addRestaurants,
    getByID: getByID,
    getAll: getAll
  };
} ) (); // RL Why first ) not show where matching ( is?


// RL *************************************************

class DBHelper {  // RL Closing } at very end of file??


  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // RL  const port = 8000 // Change this to your server port
    const port = 1337;
    console.log("port1 = ",port);

    // RL stage1 return `http://localhost:${port}/data/restaurants.json`;
    // RL stage2 return `http://localhost:${port}/restaurants`;
    // RL stage3 remove the restaurants endpt bec it could be reviews endpt.
    return `http://localhost:${port}/`; 
  }

  // RL TODO Add static get DATABASE_REVIEWS_URL() here. (RL: For stage3?)
  static get DATABASE_REVIEWS_URL() {
    const port = 1337;
    console.log("port2 = ",port);
    // RL stage2 return `http://localhost:${port}/restaurants`;
    return `http://localhost:${port}/reviews`; 
  }

  // RL open database (from Working with IndexedDB & Lab: IndexedDB)
  static dbPromise() {
    return idb.open('db', 2, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          // a placeholder case so that the switch block will
          // execute when the database is first created
          // (oldVersion is 0)
          // RL debugger;
          // RL console.log('case 0');
          upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
        case 1:
          //RL debugger;
          // RL console.log('case 1');
          const reviewsStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id'});
          // RL From https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex
          reviewsStore.createIndex('restaurant', 'restaurant_id');
      }
    }); // RL Put a semicolon here or not ???
  }

  /**
   * Fetch all restaurants.
   */


  // RL TODO Will need to also pass id as a parameter to function fetchRestaurants.
  static fetchRestaurants1(callback) {
    // RL First check whether we have restaurants data already in indexedDB
    console.log("restaurants = ",window.restaurants);
    if (!window.restaurants) {
  // RL If no restaurants yet, then fetch restaurant JSON from the sails server
  // RL 1st method
  /* RL Comment out this entire xhr block and replace with fetch block
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        console.log("xhr.responseText = ", xhr.responseText);
        const json = JSON.parse(xhr.responseText);
        console.log("json.restaurants = ", json.restaurants);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  */

  // RL 2nd method

    // RL Using fetch
    // RL Back-ticks enclose template literal. The ${expression} indicates placeholder.
    // RL The expression in the placeholder gets passed to the function fetch in this case.
    // MG No need for template literal here if there's no other parts to the string except this one template literal.
    // RL fetch(`${DBHelper.DATABASE_URL}`)
    // fetch(DBHelper.DATABASE_URL)
    // .then(function(response) {
    //   // RL Got next if block from Introduction to fetch() article
    //   if (response.status !== 200) {
    //     console.log('Looks like there was a problem. Status Code: ' +
    //       response.status);
    //     return;
    //   }
    //   // RL Add next 2 console.log
    //   console.log('Yooooo, response.status = ', response.status);
    //   // RL Cannot read response.json() in console.log statement because
    //   // RL will cause TypeError that response data already read when
    //   // RL try to read response.json() again in the return statement.
    //   // RL console.log('Baby, the response.json() = ', response.json());
    //   return response.json();
    // })
    // .then(data => callback(null, data))
    // // RL Replace template literal with regular string
    // // RL .catch(error => callback(`Request failed. Returned status of ${error,statusText}`, null));
    // .catch(error => callback(error, null));

    // RL 3rd method
    idbApp.addRestaurants(callback);
    
    // RL 4th method
    // RL return this.dbPromiseLz()
    }
  }


static fetchRestaurants() {
  return this.dbPromise()
    .then(db => {
      // RL debugger;
      const tx = db.transaction('restaurants');
      const restaurantStore = tx.objectStore('restaurants');
      return restaurantStore.getAll();
    })
    .then(restaurants => {
      if (restaurants.length !== 0) {
        return Promise.resolve(restaurants);
        }
      return this.fetchAndCacheRestaurants();
    })
}

static fetchAndCacheRestaurants() {
  return fetch(DBHelper.DATABASE_URL + 'restaurants')
    .then(response => response.json())
    .then(restaurants => {
      return this.dbPromise()
        .then(db => {
          const tx = db.transaction('restaurants', 'readwrite');
          const restaurantStore = tx.objectStore('restaurants');
          restaurants.forEach(restaurant => restaurantStore.put(restaurant));
          return tx.complete.then(() => Promise.resolve(restaurants));
        });
    });
}


// RL **********



/* */


  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    // DBHelper.fetchRestaurants((error, restaurants) => {
    //   if (error) {
    //     callback(error, null);
    //   } else {
    //     const restaurant = restaurants.find(r => r.id == id); // RL TODO Should I change this line?
    //     if (restaurant) { // Got the restaurant
    //       callback(null, restaurant);
    //     } else { // Restaurant does not exist in the database
    //       callback('Restaurant does not exist', null);
    //     }
    //   }
    // }); // RL TODO Might need id here

    idbApp.getByID(id)


      .then((restaurant) => callback(null, restaurant));
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
    // RL debugger;
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
    // RL debugger;
    // RL console.log(${restaurant.photograph});
    // RL return (`/img/${restaurant.photograph}.jpg`);
    return (`/img/${restaurant.id}.jpg`);
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
      marker.addTo(self.newMap);
    return marker;
  }

  static addReview(review) {
    let offline_obj = {
      name: 'addReview',
      data: review,
      object_type: 'review'
    };
    // RL Check if online
    if (!navigator.onLine && (offline_obj.name === 'addReview')) {
      DBHelper.sendDataWhenOnline(offline_obj);
      return;
    }
    let reviewSend = {
      "name": review.name,
      "rating": parseInt(review.rating),
      "comments": review.comments,
      "restaurant_id": parseInt(review.restaurant_id)
    };
    console.log('Send review: ', reviewSend);
    var fetch_options = {
      method: 'POST',
      body: JSON.stringify(reviewSend),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    fetch(`http://localhost:1337/reviews`, fetch_options).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
      } else { return 'API call successfull'}})
    .then((data) => {console.log(`Fetch successfull`)})
    .catch(error => console.log('error: ', error));
  }

  static sendDataWhenOnline(offline_obj) {
    console.log('offline_obj = ', offline_obj);
    localStorage.setItem('data', JSON.stringify(offline_obj.data));
    console.log(`Local Storage: ${offline_obj.object_type} stored`);
      window.addEventListener('online', (event) => {
        console.log('Browser online again! Yay!');
        let data = JSON.parse(localStorage.getItem('data'));
        console.log('Update and clean UI');
        [...document.querySelectorAll(".reviews_offline")]
        .forEach(el => {
          el.classList.remove("reviews_offline")
          el.querySelector(".offline_label").remove()
        });
        if (data !== null) {
          console.log(data);
          if (offline_obj.name === 'addReview') {
            DBHelper.addReview(offline_obj.data);
          }

          console.log('LocalState: data sent to API');

          localStorage.removeItem('data');
          console.log(`Local Stoarage: ${offline_obj.object_type} removed`);
        }
      });
    }


  // RL Add for Stage3
  static updateFavoriteStatus(restaurantId, isFavorite) {
  console.log('Changing status to: ', isFavorite);
  fetch(`http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${isFavorite}`, {
    method: 'PUT'
    })
    .then(() => {
    console.log('Changed');
    this.dbPromise()
      .then(db => {
        const tx = db.transaction('restaurants', 'readwrite');
        const restaurantsStore = tx.objectStore('restaurants');
        restaurantsStore.get(restaurantId)
          .then(restaurant => {
            restaurant.is_favorite = isFavorite;
            restaurantsStore.put(restaurant);
          });
      })
    })
  }


// RL Put here for now

static fetchReviewsByRestId(id) {
  return fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${id}`)
  .then(response => response.json())
  .then(reviews => {
    this.dbPromise()
    .then(db => {
      if (!db) return;
      let tx = db.transaction('reviews', 'readwrite');
        const store = tx.objectStore('reviews');
        if (Array.isArray(reviews)) {
          reviews.forEach(function(review) {
            store.put(review);
          });
        } else {
          store.put(reviews);
        }
        });
    console.log('Restaurant reviews are: ', reviews);
    return Promise.resolve(reviews);
})
  .catch(error => {
    return DBHelper.getStoredObjectById('reviews', 'restaurant', id)
    .then((storedReviews) => {
      console.log('Look for offline stored reviews');
      return Promise.resolve(storedReviews);
    })
  });
    }

}  // RL This is the closing } of class DBHelper ??



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

// RL }  // RL Why this } not show where matching { is ?
console.log("At bottom of dbhelper.js");
console.log("fetchRestaurants => ", DBHelper.fetchRestaurants());

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

