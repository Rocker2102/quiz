$(document).ready(function() {
    $("select").formSelect();
    $(".tooltipped").tooltip({enterDelay: 300, exitDelay: 300});
    getQuiz();
});

function showToast(htmlData, classData = "red white-text", icon = "info") {
    let toastIcon = "<i class='material-icons left'>" + icon + "</i>";
    return M.toast({html: toastIcon + htmlData, classes: classData});
}

function getIdentifier() {
    let currentUrl = window.location.href;
    let split = currentUrl.split("?");

    if(split.length != 2) {
        return false;
    }
    else {
        let identifier = split[1];
        if(identifier.length == 0 || identifier == "") {
            return false;
        }
        else {
            return identifier;
        }
    }
}

function getQuiz() {
    let identifier = getIdentifier();
    if(!identifier) {
        $("#header-text").html("Invalid URL (Identifer)!");
        $("#my-preloader").hide();
        return;
    }
    else {
        $("#header-text").html("Loading Quiz...");
        fetchQuiz(identifier);
    }
}

function fetchQuiz(identifier) {
    let errorIcon = "<i class='material-icons' style='font-size: 72px;'>warning</i>";

    $.ajax({
        url: "../db/getData.php?q=" + identifier,
        type: "GET",
        timeout: 30000,
        beforeSend: function() {

        },
        success: function(receive) {
            try {
                JSON.parse(receive);
            }
            catch(e) {
                showToast("Data Error!");
                return;
            }

            let data = JSON.parse(receive);
            if(data.error == 0) {
                showToast("Loading data ...", "blue", "av_timer");
                $("#my-preloader").hide();
                $("#header-text").html("Quiz");
                loadQuiz(data.quizData);
                return;
            }
            else {
                showToast(data.errorInfo);
                return;
            }
        },
        error: function() {
            $("#my-preloader").html(errorIcon);
        }
    })
}

/* Stores the data receieved from the server */
let questionsArr = [];
/* Stores the index of the current question being displayed */
let currentIndex = -1;
/* Stores the answers to be sent to the server */
let answersArr = [];

function loadQuiz(data) {
    questionsArr = data;
    defaultAnswers();
    $("#quiz-area").show();
    orderQuestions(data);
}

function defaultAnswers(begin = 0, end = questionsArr.length) {
    for(i = begin; i < end; i++) {
        answersArr[i] = [];
        for(j = 0; j < questionsArr[i].options.length; j++) {
            answersArr[i].push(0);
        }
    }
}

function orderQuestions() {
    let list = "";

    if(currentIndex < 0) {
        list = "<option value='' disabled selected>Choose</option>";
    }

    let selected = "";
    for(i = 0; i < questionsArr.length; i++) {
        if(i == currentIndex) {
            selected = " disabled selected";
        }
        else {
            selected = "";
        }
        list += "<option value='" + questionsArr[i].index + "'" + selected + ">" + (i + 1) + ". " + questionsArr[i].question.substring(0, 30) + " ...</option>";
    }
    $("#question-list").html(list);
    $("#question-list").formSelect();
}

$("#question-list").on("change", function() {
    currentIndex = Number($(this).val());
    loadQuestion($(this).val());
    orderQuestions();
    orderButtons();
});

function loadQuestion(index) {
    let answerType = Number(questionsArr[index].answerType);
    $("#question").html((Number(currentIndex) + 1) + ". " + questionsArr[index].question);
    if(!displayOptions(answerType)) {
        showToast("Unable to decode options!", "red white-text", "warning");
        return;
    }
}

function getRadioContainer(optionVal = "Default", optionStatus = 0) {
    if(optionStatus == 1) {
        optionStatus = " checked";
    }

    return "<div class='col s6'><label><input class='with-gap' name='single-correct' type='radio' " + optionStatus + "/><span>" + optionVal + "</span></label></div>";
}

function getCheckboxContainer(optionVal = "Default", optionStatus = 0) {
    if(optionStatus == 1) {
        optionStatus = " checked='checked'";
    }

    return "<div class='col s6'><label><input type='checkbox' " + optionStatus + "/><span>" + optionVal + "</span></label></div>";
}

function displayOptions(answerType) {
    if(answerType == 1) {
        optionContainer = getRadioContainer;
    }
    else if(answerType == 2) {
        optionContainer = getCheckboxContainer;
    }
    else {
        return false;
    }

    let options = "";
    for(i = 0; i < questionsArr[currentIndex].options.length; i++) {
        options += optionContainer(questionsArr[currentIndex].options[i].value, answersArr[currentIndex][i]);
    }
    $("#options").html(options);
    return true;
}

$("#options").on("change", "input[type='radio'], input[type='checkbox']", function() {
    modAnswers();
});

function modAnswers() {
    let arr = [];
    let index = currentIndex;
    let elements = $("#options").find("input[type='checkbox'], input[type='radio']");
    for(i = 0; i < elements.length; i++) {
        if($(elements[i]).prop("checked")) {
            arr.push(1);
        }
        else {
            arr.push(0);
        }
    }
    answersArr[index] = arr;
}

$("#clear-answer").click(function() {
    let index = Number(currentIndex);
    if(index < 0) {
        showToast("Select a question for this operation!");
        return;
    }
    defaultAnswers(index, index + 1);
    loadQuestion(index);
});

$("#next-question, #prev-question").on("click", function() {
    let index = currentIndex;
    if($(this).attr("id") == "next-question") {
        moveTo(++index);
    }
    else if($(this).attr("id") == "prev-question") {
        moveTo(--index);
    }
});

function moveTo(newIndex) {
    if(!orderButtons(newIndex)) {
        return;
    }

    currentIndex = newIndex;
    loadQuestion(newIndex);
    orderQuestions();
}

function orderButtons(newIndex = currentIndex) {
    if(newIndex < 0 || newIndex >= questionsArr.length) {
        showToast("JavaScript Error!");
        return false;
    }

    if((newIndex + 1) >= questionsArr.length) {
        $("#next-question").attr("disabled", true);
    }
    else {
        $("#next-question").attr("disabled", false);
    }

    if(newIndex <= 0) {
        $("#prev-question").attr("disabled", true);
    }
    else {
        $("#prev-question").attr("disabled", false);
    }
    return true;
}

$("#submit-btn").click(function() {
    if(questionsArr.length == 0) {
        showToast("Load a quiz to perform this!")
        return;
    }

    if(!window.confirm("Sure to submit answers?")) {
        return;
    }

    let btn = $("#submit-btn");
    let preloader = "<div class='preloader-wrapper big active'><div class='spinner-layer spinner-blue'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div><div class='spinner-layer spinner-red'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div><div class='spinner-layer spinner-yellow'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div><div class='spinner-layer spinner-green'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>";
    btn.attr("disabled", true);

    $.ajax({
        url: "../db/evaluate.php",
        data: {"q": getIdentifier(),"answers": JSON.stringify(answersArr), "name": "under_dev."},
        type: "POST",
        timeout: "45000",
        beforeSend: function() {
            $("#quiz-area").hide();
            $("#answer-area").addClass("center-align");
            $("#answer-area").html(preloader).show();
        },
        success: function(receive) {
            $("#answer-area").html("").hide();
            $("#quiz-area").show();
            try {
                JSON.parse(receive);
            }
            catch(e) {
                showToast("Data Error!");
                return;
            }

            let data = JSON.parse(receive);

            if(Number(data.error) == 0) {
                showToast("Submitted successfully", "green white-text", "done_outline");
                $("#quiz-area").html("").hide();
                let arr = data.evalData;
                $("#answer-area").html(getAnswerContainer(arr[1]*10, arr[1], arr[2], arr[0]*10)).show();
                return;
            }
            else {
                btn.attr("disabled", false);
                showToast(data.errorInfo, "red white-text", "close");
                return;
            }
        },
        error: function() {
            $("#answer-area").html("").hide();
            $("#quiz-area").show();
            btn.attr("disabled", false);
            showToast("Server error!", "red", "close");
        }
    });
});

function getAnswerContainer(score, correctAnswers, wrongAnswers, maxScore) {
    let container = "<div class='row'><div class='col s12 center-align'><h4><b><i class='material-icons left'>loyalty</i>Score: " + score + "</b></h4></div></div><div class='row'><div class='col s12 center-align green-text'><h5><i class='material-icons left'>done</i>Total Correct: " + correctAnswers + "</h5></div><div class='col s12 center-align red-text'><h5><i class='material-icons left'>close</i>Wrong Answers: " + wrongAnswers + "</h5></div><div class='col s12 center-align blue-text'><h5><i class='material-icons left'>add</i>Max Score:  " + maxScore + "</h5></div></div>";
    return container;
}