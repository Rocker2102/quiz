<?php
    // error_reporting(0);

    $host = "localhost";
    $user = "root";
    $pass = "";
    $db = "quiz";

    date_default_timezone_set("Asia/Kolkata");

    $connect = new mysqli($host, $user, $pass, $db);

    if($connect->connect_error) {
        $server = -1;
    }
    else {
        $server = 1;
    }
?>