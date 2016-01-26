<?php

    // configuration
    require("../includes/config.php"); 
    
    // store user's session id
    $id = $_SESSION["id"]; 
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        
        if($_SERVER['QUERY_STRING'] !== "")
        {                        
            // remove selected movie from SQL database
            query("DELETE FROM movies WHERE imdbID = ? AND id = ?", $_GET["imdbID"], $id);

        }
        
        // render homepage
        render("homepage.php"); 
    }
    
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        
        //process for randomly selecting a movie
        if($_POST["mode"] === "rando")
        {
            // store all movies user has saved in array to convert to JSON
            $movieIDs = [];
            $movieIDs = query("SELECT imdbID FROM movies WHERE id = ?", $id);          
            
            // output movie info as JSON (pretty-printed for debugging convenience)
            header("Content-type: application/json");
            print(json_encode($movieIDs, JSON_PRETTY_PRINT));
        }
        
        else if($_POST["mode"] === "movie")
        {
            // store info for randomly selected movie
            $movie = [];
            $movie = query("SELECT * FROM movies WHERE imdbID = ? AND id = ?", $_POST["imdbID"], $id);
            
            // output movie info as JSON (pretty-printed for debugging convenience)
            header("Content-type: application/json");
            print(json_encode($movie, JSON_PRETTY_PRINT));
        }
        
                
    }              

?>
