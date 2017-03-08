## Instructions
Dragging and dropping the HTML file should be enough to make it start.

From there simply drag a row into another table and it should work.

From my experience the API is quite slow but I built a loading bar to indicate that it is working.
## How it was built
I used jQuery and vanilla JavaScript to build this application. 
I mostly used jQuery to make calls to the jsonplaceholder API for GET and POST methods.  Using AJAX jQuery would update the tables to reflect the changes.  I've attached a minified version of the jQuery library- v3.1.1.
The drag and dropping were implemented using HTML5's Drag and Drop API and JavaScript. 
This app was built and tested on my Linux machine using Google Chrome and it seems to be working well.
I also did some quick testing on Firefox.


##Addenum

The only console log statement is printing the response from the server.
Also I've added a gif showing my use of the web app in screencast.gif
That and enjoy the festive colors

![screencast](https://cloud.githubusercontent.com/assets/5385234/23720467/c05c2484-040c-11e7-88f6-8afac4b7f751.gif)
