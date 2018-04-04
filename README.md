
# Blackbird

## Videon
The Web App URL: [videon.me](https://videon.me)

Web App Demo video : [Youtube](https://www.youtube.com/watch?v=pfXUJ99TYr8&feature=youtu.be)

- note: to use the paypal payment system, please use the following sandbox account
  - email: videon-creator01@gmail.com
  - password: creator1

### Team Members
- Sin Chi Chiu
- David Yau

### The Application
This is an application that allows video creators to upload their contents and only subscribers who paid the subscription fee can view such contents. This application is similar to [PATREON](https://www.patreon.com/), but with the video playback integrated to aim at video creators. 

### Key Features by Beta version
- Manually Adding Subscribers: allow creators to add subscribers manually
- Video Uploads: allow creators to upload thier videos
- Video Playback: allow subscribers to watch contents from thier subscription
- Subscriptions: allow subscribers to view who they subscribed to (no payment yet)

### Key Features by Final Version
- Payment system: allow subscribers to subscribe to a creator by paying through paypal
- Vue.js frontend integration

### Technologies
- NodeJs: used for testing and developing our application
- PayPal sandbox: for testing this application to mock PayPal transctions
- mongodb: store user information and videos metadata
- cloudinary: storage host for storing the video files
- NPM packages (some packages may or may not be used; list is subject to change): 
- express & express-session: to handle HTTP requests
- paypalxo: an easy way to use PayPal API

### Top 5 Technical Challenges
- Payment System: Paypal integration and ensure sercurity on user's information
- Vue.js Framework: Integrating Vue.js to the backend
- Storage: Finding storage host and integrating it to the backend
- Video upload: Videos need to be reuploaded from the backend to the storage host, and must retrieve the access address from the storage host and store it appropriately



