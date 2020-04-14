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

    if(empty($_POST["q"]) || empty($_POST["answers"]) || empty($_POST["name"])) {
        $send->error = 1;
        $send->errorInfo = "Incomplete data!";
        customExit($send);
    }
    else {
        $strAnswers = $_POST["answers"];
        $name = mysqli_real_escape_string($connect, $_POST["name"]);
        $key = mysqli_real_escape_string($connect, $_POST["q"]);

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

            if(json_decode($data) == null || json_decode($strAnswers) == null) {
                $send->error = 1;
                $send->errorInfo = "Unable to verify data integrity!";
                customExit($send);
            }
            else {
                $data = json_decode($data);
                $answers = json_decode($strAnswers);
                $correctAnswers = getCorrectAnswers($data);
                if($myData = verifyArrs($answers, $correctAnswers)) {
                    $score = $myData[1]*10;
                    $query = "INSERT INTO submissions (identifier, answers, score) VALUES ('$key', '$strAnswers', '$score')";
                    $connect->query($query);
                    if(mysqli_affected_rows($connect) == 1) {
                        $send->error = 0;
                        $send->evalData = $myData;
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
                    $send->errorInfo = "FATAL: Data Manipulated!";
                    customExit($send);
                }
            }
        }
    }

    function getCorrectAnswers($data) {
        $answersArr = [];
        for($i = 0; $i < count($data); $i++) {
            $answersArr[$i] = array();
            for($j = 0; $j < count($data[$i]->options); $j++) {
                array_push($answersArr[$i], (int)$data[$i]->options[$j]->answer);
            }
        }

        return $answersArr;
    }

    function verifyArrs($arr1, $arr2) {
        $totalCorrect = 0;
        $correctAnswers = 0;
        $wrongAnswers = 0;
        if(count($arr1) != count($arr2)) {
            return false;
        }

        for($i = 0; $i < count($arr2); $i++) {
            if(count($arr1[$i]) != count($arr2[$i])) {
                return false;
            }

            for($j = 0; $j < count($arr2[$i]); $j++) {
                if($arr2[$i][$j] == 1) {
                    $totalCorrect++;
                }

                if($arr1[$i][$j] == 1 && $arr2[$i][$j] == 1) {
                    $correctAnswers++;
                }
                else if($arr1[$i][$j] == 1 && $arr2[$i][$j] == 0) {
                    $wrongAnswers++;
                }
            }
        }

        return [$totalCorrect, $correctAnswers, $wrongAnswers];
    }
?>