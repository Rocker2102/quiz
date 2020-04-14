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

    if(empty($_POST)) {
        $send->error = 1;
        $send->errorInfo = "Empty data!";
        customExit($send);
    }
    else {
        $data = $_POST["data"];
        if(json_decode($data) == null) {
            $send->error = 1;
            $send->errorInfo = "Unable to read data!";
            customExit($send);
        }
        else {
            if(validateData($data) == 1) {
                $identifier = bin2hex(random_bytes(8));
                $query = "INSERT INTO data (quiz_data, unique_identifier) VALUES ('$data', '$identifier')";
                $connect->query($query);
                if(mysqli_affected_rows($connect) == 1) {
                    $send->error = 0;
                    $send->link = getLink($identifier);
                    customExit($send);
                }
                else {
                    $send->error = 1;
                    $send->errorInfo = "Unable to update database!";
                    customExit($send);
                }
            }
            else {
                $send->error = 1;
                $send->errorInfo = "Data validation failed!";
                customExit($send);
            }
        }
    }

    /* Validates data according to the minimum criteria of each field to verify the integrity of the data before being saved to database! */
    function validateData($data) {
        $data = json_decode($data);
        $answerTypeArr = [1, 2];
        $optionTypeArr = [0, 1];

        for($i = 0; $i < count($data); $i++) {
            if($i != $data[$i]->index) {
                return -1;
            }
            if(!in_array($data[$i]->answerType, $answerTypeArr)) {
                return -1;
            }
            if($data[$i]->question == "" || empty($data[$i]->question)) {
                return -1;
            }

            for($j = 0; $j < count($data[$i]->options); $j++) {
                if($data[$i]->options[$j]->value == "" || empty($data[$i]->options[$j]->value)) {
                    return -1;
                }
                if(!in_array($data[$i]->options[$j]->answer, $optionTypeArr)) {
                    return -1;
                }
            }
        }

        return 1;
    }

    function getLink($ui) {
        // $baseUrl = "https://studentsnitsk.ml/quiz/view/?".$ui;
        $url = "http://localhost/development/quiz/view/?".$ui;
        return $url;
    }
?>