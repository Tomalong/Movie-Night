Movie Night is a website that helps users remember what movies they intend to watch in the future and then decide what movie
they want to watch on their next movie night. A video walkthrough of the website can be found at:

https://youtu.be/Xu35vHHFuDw

Users navigate to the search page to search for movies they are interested in watching.  Once the user enters a search term a 
$.getJSON request is sent to the OMBD API which retrieves movie titles related to the search term, information associated with
each title, and a poster for the movie. A user can decide which movie in the results they want to watch sometime later and save
the movie, and associated information, to their library. 

Users can navigate to the library page to see the titles they've saved for later.

On the home page the user can click the "Let's Watch a Movie!" button and a random movie from their library, and its associated
information, will be displayed. 
