# Blackbird

## Title

### Team Members
- Sin Chi Chiu
- David Yau

### The Application
This is an application that allows video creators to upload their contents and only subscribers who paid the subscription fee can view such contents. This application is similar to [PATREON](https://www.patreon.com/), but with the video playback integrated to aim at video creators. 

### Key Features by Beta version
- Third Party Authentication: allow users to create account and sign in using third party applications(Twitter, Google, etc.)
- Manually Adding Subscribers: allow creators to add subscribers manually
- Video Uploads: allow creators to upload thier videos
- Video Playback: allow subscribers to watch contents from thier subscription
- Thumbnail Preview of Video: automatically generate or manually adding thumbnail for a video
- Subscriptions: allow subscribers to view who they subscribed to (no payment yet)

### Key Features by Final Version
- Payment system: allow subscribers to subscribe to a creator by paying through paypal
-- If we decide to do monthly subscription, we can make it so that it automatically renews the subscription for video creator(if the subscriber allows it)
- Multiple resolution playback: allow users to watch content in different resolution
- Live streaming from creators: allow creators to broadcast real time contents to subscribers
-- also allow subscribers to chat(post text) while creator is streaming
### Technologies
- NodeJs: used for testing and developing our application
- NPM packages (some packages may or may not be used; list is subject to change): 
-- express & express-session: to handle HTTP requests
-- videojs contrib hls: for video playback and live streaming 
-- file upload thumbnail: creates a thumbnail given an image/video
-- paypalxo: an easy way to use PayPal API
-- google sign in: allows a user to login via a google account
- PayPal sandbox: for testing this application to mock PayPal transctions

### Top 5 Technical Challenges
- On the Fly Switching Resolution: allow switching resolution during video playback
- Live Streaming: allow creators to use webcam/camera or screen capture to broadcast
- Payment System: ensure sercurity on user's information
- NPM Packages: finding and utilizing NPM packages that work well with our application
- Frontend: designing and building the frontend that is easy to use/navigate