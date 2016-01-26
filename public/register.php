<?php

    // configuration
    require("../includes/config.php");

    // if user reached page via GET (as by clicking a link or via redirect)
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        // else render form
        render("register_form.php", ["title" => "Register"]);
    }

    // else if user reached page via POST (as by submitting a form via POST)
    else if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        
        // check for content in "username"
        if (empty($_POST["username"]))
        {
            apologize("Missing username");
        }
        
        // check for content in "password" and "confirmation"
        else if (empty($_POST["password"]))
        {
            apologize("Missing password");
        }
        else if (empty($_POST["confirmation"]))
        {
            apologize("Missing confirmation");
        }
        
        // compare password and confirmation 
        else if ($_POST["password"] !== $_POST["confirmation"])
        {
            apologize("Passwords do not match");
        }
        
        // enter login data to MySQL        
        $result = query("INSERT INTO users (username, hash) VALUES(?, ?)", $_POST["username"], crypt($_POST["password"]));

        // check for pre-existing username
        if ($result === false)
        {
            apologize("That username already exists");
        }
        
        // save user id for this session
        $rows = query("SELECT LAST_INSERT_ID() AS id");
        $id = $rows[0]["id"];        
        $_SESSION["id"] = $id;
        
        // redirect to index
        redirect("/");
        

    }
    
    

?>
