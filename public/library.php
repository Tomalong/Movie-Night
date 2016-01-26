<?php    
    
    // configuration
    require("../includes/config.php");     
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        // store user's session id
        $id = $_SESSION["id"];
        
        // query user's history
        $movie = query("SELECT * FROM movies WHERE id = ?", $id); 
        
        // cull user's history
        $library = [];
        foreach ($movie as $row)
        {
            $library[] = [
                "poster" => $row["poster"],
                "title" => $row["title"],
                "year" => $row["year"],
                "director" => $row["director"],
                "actors" => $row["actors"],
                "imdbID"  => $row["imdbID"]
            ];
        }        
        
        if($_SERVER['QUERY_STRING'] !== "")
        {                        
            // remove selected movie from SQL database
            query("DELETE FROM movies WHERE imdbID = ? AND id = ?", $_GET["imdbID"], $id);

        }        
        
        // render library
        render("library.php", ["library" => $library, "title" => "library"]);
    }
    
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {        
        
        // store user's session id
        $id = $_SESSION["id"];
        
        // get movie id from browser AJAX request
        $imdbID = $_POST["imdbID"];           
                                    
        // create array element to store movie info in
        $info = [];                
        $info = query("SELECT * FROM movies WHERE imdbID = ? AND id = ?", $imdbID, $id);          
        
        // output movie info as JSON (pretty-printed for debugging convenience)
        header("Content-type: application/json");
        print(json_encode($info, JSON_PRETTY_PRINT));
            
     
    }

?>
