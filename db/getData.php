<?php
    $send = new stdClass;
    require_once("connect.php");

    function customExit($data) {
        echo json_encode($data);
        exit();
    }

    /* '$server' variable is initialized in 'connect.php' */
    if($server == -1) {
        $send->error = 1;
        $send->errorInfo = "Server offline!";
        customExit($send);
    }

    if(empty($_GET["q"])) {
        $send->error = 1;
        $send->errorInfo = "Invalid Request!";
        customExit($send);
    }
    else {
        $key = mysqli_real_escape_string($connect, $_GET["q"]);
        $query = "SELECT quiz_data FROM data WHERE unique_identifier = '$key'";
        $result = $connect->query($query);

        if($result->num_rows == 0) {
            $send->error = 1;
            $send->errorInfo = "Requested quiz not found!";
            customExit($send);
        }
        else {
            $row = $result->fetch_assoc();
            $data = $row["quiz_data"];

            if(json_decode($data) == null) {
                $send->error = 1;
                $send->errorInfo = "Unable to verify data integrity!";
                customExit($send);
            }
            else {
                $data = json_decode($data);
                removeAnswers($data);
                $send->error = 0;
                $send->quizData = $data;
                customExit($send);
            }
        }
    }

    /* Removes the answers from the data receieved from the server */
    function removeAnswers($data) {
        for($i = 0; $i < count($data); $i++) {
            for($j = 0; $j < count($data[$i]->options); $j++) {
                $data[$i]->options[$j]->answer = -1;
            }
        }
    }
?>