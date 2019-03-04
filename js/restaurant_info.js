let restaurant;

/**
 * RL: Reviewer said to replace ES5:var with ES6:let or const.
 */
let newMap;
/* RL   var newMap;  */



/**
 * Initialize map as soon as the page is loaded.
 */
console.log('restaurant_info.js: Before document.addEventListener');
document.addEventListener('DOMContentLoaded', (event) => {
  console.log(L);
  initMap();
});

/**
 * Initialize leaflet map
 */
const initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      console.log('Before self.newMap = L.map: ');
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        // RL mapboxToken: '<your MAPBOX API KEY HERE>',
        // mapboxToken: 'pk.eyJ1Ijoicm9iNGFiY2JhIiwiYSI6ImNqaXFqZzN5cTE5dm0zcXQ4N3FsZ2NtbGMifQ.ZSP-BO8phKgF0poYo62xaA',
        mapboxToken: SECRET.mapbox_key,
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(self.newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    console.log('Before DBHelper.fetchRestaurantById: ');
    // RL debugger;
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = "photo of " + restaurant.name + " restaurant";

  console.log('image.alt = ', image.alt);
  // RL window.alert('image.alt = ' + image.alt);


  /* RL Not sure about next line I added. */
  name.append(address);
  
  console.log('name = ', name);
  // RL window.alert('name = ' + name);

  /* RL TODO Add code for responsive image sizing. */

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  // fill reviews
  console.log('Populate reviews');
  // RL debugger;
  DBHelper.fetchReviewsByRestId(restaurant.id)
    .then(reviews => fillReviewsHTML(reviews))
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    /* RL TODO Add trim function. */

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  console.log('reviews = ', reviews);
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.id = 'no-review';
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.reverse().forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  if (!navigator.onLine) {
    const connection_status = document.createElement('p');
    connection_status.classList.add('offline_label')
    connection_status.innerHTML = "Offline"
    li.classList.add("reviews_offline")
    li.appendChild(connection_status);
  }

  const name = document.createElement('p');
  name.innerHTML = `Name: ${review.name}`;
  /* RL TODO Add className to format CSS. */
  li.appendChild(name);

  const date = document.createElement('p');
  // RL stage2 date.innerHTML = review.date;
  date.innerHTML = `Date: ${new Date(review.createdAt).toLocaleString() }`;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  return li;
}

// RL Stage3 form validation & submission
addReview = () => {
  event.preventDefault();
  // RL Get data from form
  let restaurantId = getParameterByName('id');
  let name = document.getElementById('review-author').value;
  let rating = document.querySelector('#rating_select option:checked').value;
  let comments = document.getElementById('review-comments').value;
  const review = [name, rating, comments, restaurantId];
  
  // RL Add data to DOM
  const frontEndReview = {
    restaurant_id: parseInt(review[3]),
    rating: parseInt(review[1]),
    name: review[0],
    comments: review[2].substring(0, 300),
    createdAt: new Date()
  };
  // RL Send review to backend
  DBHelper.addReview(frontEndReview);
  addReviewHTML(frontEndReview);
  document.getElementById('review-form').reset();
}

addReviewHTML = (review) => {
  if (document.getElementById('no-review')) {
    document.getElementById('no-review').remove();
  }
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');

  /* RL TODO Add code for a11y. */

  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
