/**
 * scripts.js
 *
 * Computer Science 50
 * Final Project
 *
 */
 
 $(document).ready(function(){
	
	// Clicking the search button initiates the search
	$("#search").click(function(){
		
		// Resets the page if user searches more than once
		document.getElementById("list").innerHTML = "";
		
		// variables to be submitted to the $.getJSON request
		var search = "s=";
		search += document.getElementById('input').value.replace(" ", "+");
		console.log(search);
		var omdb = "http://www.omdbapi.com/";
		
		// $.getJSON request to OMDb API
		$.getJSON(omdb, search, function(data){			
			
			// fail condition
			if (data.Response === "False"){
				$("#list").append("<h1>Movie not Found</h1>");
			
			// pass condition which creates a results table
			} else {
				var results = "<table><tr>"			
				for (var i = 0, j = 1; i < 9; i++, j++){
					if (data.Search[i] === undefined)
						continue;
					results += "<td id='" + data.Search[i].imdbID + "' class='result'>";					
					results += "<b id='" + data.Search[i].imdbID + "'>Title: </b>" + data.Search[i].Title + "<br>";
					results += "<b id='" + data.Search[i].imdbID + "'>Year: </b>" + data.Search[i].Year + "<br>";
					results += "<img id='" + data.Search[i].imdbID + "' alt='Image not Found' src='" + data.Search[i].Poster + "'/>";
					results += "</td>";
					if (j % 3 === 0){
						results += "</tr><tr class='results'>";
					}
				}
				results += "</tr></table>"			
				
				// append results table to a div within body
				$("#list").append(results);
			}
			// function which pulls up info about the selected movie
			select();
		});		
	});
	
	library();
	
	rando();
});

// brings up info window for movie that user clicked on
function select(){
    // function executes when movie is cliked
	$(".result").click(function(event){
		
		// pull movie ID when element is clicked
		document.getElementById("choice").innerHTML = "<img id='exit' src='/img/exit.gif'/>";
		
		// initiate GET request with omdb api through $.getJSON
		var omdb = "http://www.omdbapi.com/"
		var id = "i=" + event.target.id + "&plot=full";		
		$.getJSON(omdb, id, function(data){
			var info = ["Title", "Year", "Runtime", "Genre", "Director", "Actors", "imdbRating", "Plot"];
			var JSON = [data.Title, data.Year, data.Runtime, data.Genre, data.Director, data.Actors, data.imdbRating, data.Plot];
			var imdbID = data.imdbID;
			
			// instantiate poster
			$("#choice").append("<img alt='poster' class='poster' src='" + data.Poster + "'/>");			
			
			// loops through JSON data to instantiate movie info
			for (var i = 0, j = 15; i < info.length; i++, j+=25){
				$("#choice").append("<div class='info' style='top: " + j + "px;'>" + info[i] + ": " + JSON[i] + "</div>");
			}
			$("#choice").append("<button id='select' type='submit'>Add to List</button>");			
			$("#choice").fadeIn();

            // sends movie data to php server via AJAX call once "Add to List" button is clicked
			$("#select").click(function(){
			    $.ajax({			    
			        url: "search.php",
			        method: "POST",
			        dataType: "text",
			        data: "title=" + data.Title + "&year=" + data.Year + "&runtime=" + data.Runtime +
			                "&genre=" + data.Genre + "&director=" + data.Director + "&actors=" + data.Actors +
			                "&rating=" + data.imdbRating + "&plot=" + data.Plot + "&poster=" + data.Poster + "&imdbID=" + imdbID, 
			        success: function(){
			            $("#choice").hide();
				        $("#confirm").fadeIn();
				        setTimeout(function(){$("#confirm").fadeOut()}, 1500);
			        }			        
			    });			 
			    event.preventDefault();						
			});
		});	
		
		// closes window if exit button is clicked
		$("#exit").click(function(){
			$("#choice").hide();
		});		
	});	
}

// brings up info window for movie user clicked on from the library
function library(){
    $("td").click(function(event){
    
        // instantiate buttons
        document.getElementById("choice").innerHTML = "<img id='exit' src='/img/exit.gif'/>";
        $("#choice").append("<form action='library.php' method='GET'><button class='del' id='libraryDelete' style='position: absolute; right: 50px;	bottom: 10px;'>Delete</button></form>");
        $("#choice").append("<button class='exit' id='save' style='position: absolute; right: 40%; bottom: 10px;'>Save for Later</button>");
        
        // get imdb ID number from movie the user clicked
        var imdbID = event.target.id;
        
        // send the imdb ID to server and get JSON array back containing movie info
        $.ajax({
            url: "library.php",
            method: "POST",
            dataType: "json",
            data: "delete=no&imdbID=" + imdbID,
            success: function(data, textStatus, jqXHR){
                
                // instantiate movie info to movie info window
                var keys = ["Title", "Year", "Runtime", "Genre", "Director", "Actors", "imdbRating", "Plot"];                
                var info = [data[0].title, data[0].year, data[0].runtime, data[0].genre, data[0].director, data[0].actors, data[0].imdbRating, data[0].plot];
                
                // instantiate poster
			    $("#choice").append("<img alt='poster' class='poster' src='" + data[0].poster + "'/>");
                
                // instantiate movie info
		        for (var i = 0, j = 15; i < keys.length; i++, j+=25){
			        $("#choice").append("<div class='info' style='top: " + j + "px;'>" + keys[i] + ": " + info[i] + "</div>");
		        }
                
                $("#choice").fadeIn();

                // closes window if exit button is clicked
		        $("#exit").click(function(){
			        $("#choice").hide();
		        });
		        
		        // closes window if save for later button is clicked
		        $("#save").click(function(){
			        $("#choice").hide();
		        });		        
		                
                $(".del").click(function(){         
                    del("library.php", imdbID);
                    $("#choice").hide();                   
                });
            },
            error: function(jqXHR, textStatus, errorThrown){
                // log error to browser's console
                console.log(errorThrown.toString());
            }
        });
        event.preventDefault();                                               	
    });
}

// removes movie from SQL database when delete button is clicked
function del(page, id){
         
    $.ajax({
        url: page,
        method: "GET",
        dataType: "text",
        data: "imdbID=" + id,
        success: function(){
            return;
        }
    });
}

// selects a random movie for the user to watch
function rando(){
    $("#rando").click(function(event){
        $.ajax({
            url: "index.php",
            method: "POST",
            dataType: "json",
            data: "mode=rando",
            success: function(data, textStatus, jqXHR){
                
                // create array of movie IDs to in order to randomly select one
                var movieIDs = [];
                for (var i = 0; i < data.length; i++){
                    movieIDs.push(data[i].imdbID);
                }
                
                var seed = Math.round(Math.random() * (data.length - 0) + 0);
                
                var imdbID = movieIDs[seed];
                
                $.ajax({
                    url: "index.php",
                    method: "POST",
                    dataType: "json",
                    data: "mode=movie&imdbID=" + imdbID,
                    success: function(data, textStatus, jqXHR){
                        
                        // instantiate buttons
                        document.getElementById("choice").innerHTML = "<img id='exit' src='/img/exit.gif'/>";
                        $("#choice").append("<button class='del' id='libraryDelete' style='position: absolute; right: 50px;	bottom: 10px;'>Delete</button>");
                        $("#choice").append("<button class='exit' id='save' style='position: absolute; right: 40%; bottom: 10px;'>Save for Later</button>");
                        
                        // instantiate movie info to movie info window
                        var keys = ["Title", "Year", "Runtime", "Genre", "Director", "Actors", "imdbRating", "Plot"];                
                        var info = [data[0].title, data[0].year, data[0].runtime, data[0].genre, data[0].director, data[0].actors, data[0].imdbRating, data[0].plot];
                        
                        // instantiate poster
			            $("#choice").append("<img alt='poster' class='poster' src='" + data[0].poster + "'/>");
                        
                        // instantiate movie info
		                for (var i = 0, j = 15; i < keys.length; i++, j+=25){
			                $("#choice").append("<div class='info' style='top: " + j + "px;'>" + keys[i] + ": " + info[i] + "</div>");
		                }
                        
                        $("#choice").fadeIn();

                        // closes window if exit button is clicked
		                $("#exit").click(function(){
			                $("#choice").hide();
		                });
		                
		                // closes window if save for later button is clicked
		                $("#save").click(function(){
			                $("#choice").hide();
		                });		        
		                        
                        $(".del").click(function(){         
                            del("index.php", imdbID);
                            $("#choice").hide();                   
                        });
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                console.log(errorThrown.toString());
                            }
                        });
                //alert(seed);
                
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(errorThrown.toString());
            }
        });
    });
}
