<?php

    // configuration
    require("../includes/config.php"); 

    // when entering page from menu go to search_movie.php
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        // render search_movie.php
        render("search_movie.php", ["title" => "Find a Movie"]);                
    }
  
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {                        
        // store user's session id
        $id = $_SESSION["id"];
        
        query("INSERT INTO movies (title, year, runtime, genre, director, actors, rating, plot, poster, id, imdbID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", $_POST["title"], $_POST["year"], $_POST["runtime"], $_POST["genre"], $_POST["director"], $_POST["actors"], $_POST["rating"], $_POST["plot"], $_POST["poster"], $id, $_POST["imdbID"]);
    }   
    
?>
