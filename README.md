# Mobile Web Specialist
---
#### _Three Stage Project - Restaurant Reviews_


## Project Overview: Stage 3

For the **Restaurant Reviews** projects, I incrementally converted a static webpage to a mobile-ready web application. In **Stage One**, I took a static design that lacked accessibility and converted the design to be responsive on different sized displays and accessible for screen reader use. I also added a service worker to begin the process of creating a seamless offline experience for my users.

In **Stage Three**, I took the connected application that I built in Stage One and Stage Two and added additional functionality. I added a form to allow users to create their own reviews. If the app is offline, the form will defer updating to the remote database until a connection is established. Finally, I optimized the site to meet even stricter performance benchmarks than the previous stages, and tested again using Lighthouse.


### Specification

In **Stage One**, we were provided the code for a restaurant reviews website. The code had a lot of issues. It was barely usable on a desktop browser, much less a mobile device. It also didn’t include any standard accessibility features, and it didn’t work offline at all. Our job was to update the code to resolve these issues while still maintaining the included functionality. 

In **Stage Three**, we were provided code for an updated Node development server and a README for getting the server up and running locally on our computer. The README also contained the API we needed to make JSON requests to the server. Once I had the server up, I began the work of improving my Stage Two project code.

This Stage Three server has added capabilities and thus is different from the Stage Two server. The commands to connect to this Stage Three server are the same as with Stage Two.  The only difference is you execute the commands in the Stage Three folder instead of the Stage Two folder.

The documentation for the new server is in the [README](https://github.com/rob4abcba/mws-restaurant-stage-3-server/blob/master/README.md) file for the server.

AFter connecting my application to the external database, I added new features to my app.


### What do I do from here?

1. In this mws-restaurant-stage-3 folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. Meanwhile in the mws-restaurant-stage-3-server folder, follow the commands from that [README](https://github.com/rob4abcba/mws-restaurant-stage-3-server/blob/master/README.md).

3. With your server running, visit the site: `http://localhost:8000`.  My goal was to make the use of the site self-explanatory and intuitive.  The user should clearly see the drop down boxes and intuitively know to select the Neighborhood and/or the Cuisine Type to see restaurants that fit his/her criteria.  When you see a restaurant that looks interesting, you can click on it to see more detail about that restaurant.


## Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information. 

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 

In **Stage Three**, I added a form to allow users to create their own reviews: In previous versions of the application, users could only read reviews from the database. I added a form that adds new reviews to the database. The form includes the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form updates the server when the user is online.

I added functionality to defer updates until the user is connected: If the user is not online, the app notifies the user that they are not connected, and saves the users' data to submit automatically when re-connected. In this case, the review is deferred and sent to the server when connection is re-established (but the review is still visible locally even before it gets to the server.)

The code meets higher performance requirements: In addition to adding new features, the performance targets from Stage Two are now even higher in Stage Three. Using Lighthouse, I measured my site performance against the new targets.

Progressive Web App score should be at 90 or better.
Performance score should be at 90 or better.
Accessibility score should be at 90 or better.

