Curbalert allows users to post images and details of things people are giving or throwing away in their area, becoming viewable on a public map. Assisted by Google Directions, users can make their way to hidden treasures that are simply going to waste.  

#Curbalert Frontend uses React and relies on a Rails backend, named Curbalert-Backend in repository. Curbalert uses custom CSS, with styling framework Semantic UI React, and React Transition Group library. API's included are Geolocation API, Google Directions API, and Leaflet API. For image storage, Curbalert Backend uses Rails with active storage enabled, which uses AWS S3 Cloud to store images.  

#Start Build. 
To begin frontend, run 'npm install'.  
Then run 'npm start' to start local server.  
  
#Use Deployed  
Curbalert is already deployed to curbalert.netlify.app, relying on https://curbalert-api.herokuapp.com endpoint. If there are still dynos, a list of items should appear upon logging in, otherwise, unfortunately this endpoint will not be usable.  
  
//Allow location services to get the most out of Curbalert. Location services allows the user to see where they are on the map, which in turn helps the user fill in address form inputs in the create a post form, without requiring the user to do so manually. Allowing location services also grants access to Google Directions, a feature allowing users to see their directions to an item in the city.  
  
New users can register an account using register form. If simply testing, log in with username Eric and password pig12345. There will be 10 seconds of inactivity after clicking "Submit" because Heroku backend needs to wake.  
  
//Upon logging in, there will be a navbar to the left, a map with user location in the center(if user allowed location services), and the item section with dashboard and active items on the right. Items will appear in the active items section, which will also appear on the map. Items can be added to dashboard for closer attention by clicking the "+" on active items. Items have a zoom in button for the image, and a map locator button which will center the map on the item and expand the item's marker. A user can see the details of item, see Google Directions to the item (if user allowed location services), and claim an item. The user must be less than 1 km away from item to claim.  
  
On the navbar, you can make a post, see post history, and signout.  
  
For creating a post, a user can upload an image and be able to see a preview of image, fill in address of item (address inputs should already be filled in if user allowed location services), select a category of item, and include details of item. All of these details are vital so other users may search for keywords in the active items bar.  
  
If user makes a post, the item should appear in post history.  
  
Lastly, a user can sign out, which will save all items on dashboard to the account.  
