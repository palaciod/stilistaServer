# stilistaServer
A server for the Stilista iOS application.

Stilista compares your location with nearby users to create a list of hair stylists that are filtered by the distance you choose. 
Stilista also shows the exact location of the stylist that you wish to meet and allows you request an appointment. 
A user can sign up as a client or a hair stylist. After an appointment clients can also leave reviews on hair stylists. *Note Map-Kit does not work at all in the iPhone simulator.



## Languages: 
1. JavaScript

#### What can the app do?
1. The app can authenticate users 
2. Allow clients to locate nearby hair stylists and check their reviews.
3. Allow clients to post and delete reviews.
4. Allow stylists to accept and decline jobs.
5. A rating system for stylists.
6. Users can upload profile pictures, which are uploaded to firebase storage.
7. Clients can filter the distance of neaby hair stylists.

### How Do We Locate Nearby Users?
 - Every type of user will show their location via the CLLocation provided by one of swift’s libraries. Once the geo location is stored in the cluster I use MongoDB’s custom geo query to sort the nearest users. 
