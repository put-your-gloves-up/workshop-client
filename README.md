[splash]: http://img15.hostingpics.net/pics/120332putyourglovesup.jpg
![Alt text][splash]

# Put your gloves up (CLIENT)

[Be sure to check out our presentation video !](https://youtu.be/DbgDW9NuuXI)

## User guide

_For best results, try to use Put your gloves up by day with a neutral environment (few colors) and good light conditions.
The installation ideally requires colored gloves to be as effective as possible. If you don't have any, try to find colored objects that you can use to replaced those._

Use your colored gloves to produce sound loops ! Each color represents an instrument. Try to move your glove around the screen to produce funny
effects like highpass / lowpass and quality filters.

Default colors available are the following : magenta / yellow / red / blue.

## ~~Try the demo online !~~  *(BROKEN)*

~~You can access a demo by using this URL : http://91.121.120.180/workshop-js/.
Connect two devices to this address, accept the webcam request and call the other device from one of them (identify each other with the IDs given)~~

~~The popin will close and your installation will be ready to use !~~

~~_Put your gloves up_ has been developed to be used on portrait screens.
For best results, simulate a _Nexus 7_ with Google Chrome DevTools or use this URL (http://91.121.120.180/workshop-js/iframed.html) which simulates as much as possible a portrait screen.~~

## How to use it on your computer

### Installation
Clone the repo using this command in your desired folder :

    git clone https://github.com/put-your-gloves-up/workshop-client.git
    
Make sure you have Node installed, then that you have Gulp installed :

    npm install gulp -g
    
Open your terminal at the root of the projet and launch the following commands to download dependencies :

    npm install
    
Once done, you'll have to copy the file '/src/js/config_sample.js' to '/src/js/config.js' and to set it up accordingly to your configuration. For example :

    export default {
        server: "127.0.0.1", // The IP where your put-your-gloves-up-server runs
        port: 3002, // The port where your put-your-gloves-up-server runs
        iceServers: [ // WebRTC identifiants
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        ]
    }
        
If you do not have a server running yet, please go to this repository and follow instructions : https://github.com/put-your-gloves-up/workshop-server

Congratulations ! You have now installed _Put your gloves up Client_ successfully ! 
    
### Usage

Once installed, go to the root folder of the repo and launch the following command :

    gulp
    
It will open your default browser on http://localhost:3000/. 
We recommend to toggle off sync options at http://localhost:3001/sync-options to avoid some problems.

If you want to access the url from another device, just replace _localhost_ by the hosting computer IP.

_Put your gloves up_ has been developed to be used on portrait screens. 
For best results, simulate a _Nexus 7_ with Google Chrome DevTools or use this URL (http://localhost:3000/iframed.html) which simulates as much as possible a portrait screen.
    
## Structure

### src
Source files are stored in the src folder in separate directories (js / css / htdocs / etc.).
Gulp will watch these files and compile them all everytime a file is modified;

### build 
Compiled files are stored there. This folder is our final product, you can access it by http://localhost:3000/ in your browser

### gulp
Automation scripts

