$(document).ready(function() {
    $("select").formSelect();
    $(".tooltipped").tooltip({enterDelay: 300, exitDelay: 300});
});

function showToast(htmlData, classData = "red white-text", icon = "info") {
    let toastIcon = "<i class='material-icons left'>" + icon + "</i>";
    return M.toast({html: toastIcon + htmlData, classes: classData});
}

$("#options").on("click", "div > div > button", function(e) {
    $(this).parent().parent().remove();
    showToast("Option removed", "red white-text", "delete_outline");
});

$("#add-option-btn").on("click", function() {
    let optionData = getOptionContainer();
    $("#options").append(optionData);
    showToast("Option Added!", "green", "done");
    M.updateTextFields();
});

function getCheckedOptions() {
    let count = 0;
    let elements = $("#options").children();
    for(i = 0; i < elements.length; i++) {
        if($(elements[i]).find("label > input").prop("checked"))
            count++;
    }
    return count;
}

$("#options").on("click", "div > div > label > input", function() {
    let checkedCount = getCheckedOptions();
    let answerType = Number($("#answer-type").val());

    if(answerType == 1 && checkedCount > 1) {
        $(this).prop("checked", false);
        showToast("Only 1 answer is allowed for chosen answer type!");
    }
});

$("#answer-type").on("change", function() {
    let checkedCount = getCheckedOptions();
    let optionVal = $("#answer-type").val();

    if(optionVal == 1 && checkedCount > 1) {
        let elements = $("#options").children();
        for(i = 0; i < elements.length; i++) {
            $(elements[i]).find("label > input").prop("checked", false);
        }
    }
});

function verifyOptions() {
    let elements = $(".option-container");
    for(i = 0; i < elements.length; i++) {
        let val = $(elements[i]).find("input[type='text']").val();
        if(val == "" || val.length == 0) {
            return false;
        }
    }
    return true;
}

$("#save-question-btn").on("click", function() {
    if($("#question").val() == "" || $("#question").val().length == 0) {
        showToast("Empty Question!");
        return;
    }

    let numOptions = $("#options").children().length;
    if(numOptions == 0) {
        showToast("Atleast 1 option is required!");
        return;
    }
    else {
        if(!verifyOptions()) {
            showToast("Invalid option data!", "red black-text", "warning");
            return;
        }
    }

    let checkedCount = getCheckedOptions();
    if(checkedCount == 0) {
        showToast("Atleast 1 answer is required!");
        return;
    }

    storage(2);
});

/* Stores the data before it is sent to server */
let questionsArr = [];
/* stores the index of the current question being displayed/modified */
let currentIndex = -1;

function formatAnswer(data) {
    if(data == true){
        return "1";
    }
    else {
        return "0";
    }
}

function reIndexArr() {
    for(i = 0; i < questionsArr.length; i++) {
        questionsArr[i].index = i;
    }
    currentIndex = -1;
}

function storage(option = 1) {
    if(currentIndex >= 0 && option != 1) {
        option = 3;
    }

    let obj = {
        index: 0,
        answerType: "",
        question: "",
        options: []
    }

    let optionVal = "";
    let optionAns = "";
    let elements = $("#options").children();

    switch(option) {
        case 1: return questionsArr;
        case 2:
            obj.question = $("#question").val();
            obj.answerType = $("#answer-type").val();
            for(i = 0; i < elements.length; i++) {
                optionVal = $(elements[i]).find("div > input[type='text']").val();
                optionAns = formatAnswer($(elements[i]).find("label > input[type='checkbox']").prop("checked"));
                obj.options.push({value: optionVal, answer: optionAns});
            }
            obj.index = questionsArr.length;
            questionsArr.push(obj);
            showToast("Question saved!", "green black-text", "done_all");
            currentIndex = obj.index;
            orderQuestions();
            break;
        case 3:
            obj.question = $("#question").val();
            obj.answerType = $("#answer-type").val();
            for(i = 0; i < elements.length; i++) {
                optionVal = $(elements[i]).find("div > input[type='text']").val();
                optionAns = formatAnswer($(elements[i]).find("label > input[type='checkbox']").prop("checked"));
                obj.options.push({value: optionVal, answer: optionAns});
            }
            obj.index = currentIndex;
            questionsArr[currentIndex] = obj;
            showToast("Question updated!", "green black-text", "done_all");
            break;
        default: return false;
    }
    return true;
}

$("#question-list").on("change", function() {
    resetContent();
    let newIndex = Number($(this).val());
    loadQuestion(newIndex);
    orderQuestions();
    showToast("Question " + (newIndex + 1) + " loaded!", "blue");
});

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
        list += "<option value='" + questionsArr[i].index + "'" + selected + ">" + (i + 1) + ". " + questionsArr[i].question.substring(0, 15) + " ...</option>";
    }
    $("#question-list").html(list);
    $("#question-list").formSelect();
}

function loadQuestion(index) {
    currentIndex = index;
    $("#question").val(questionsArr[index].question);
    $("#answer-type").val(Number(questionsArr[index].answerType));

    let options = "";

    for(i = 0; i < questionsArr[index].options.length; i++) {
        options += getOptionContainer(questionsArr[index].options[i].value, questionsArr[index].options[i].answer);
    }
    $("#options").html(options);
    M.updateTextFields();
    $("select").formSelect();
}

$("#reset-btn").click(function() {
    resetContent();
    currentIndex = -1;
    orderQuestions();
});

function resetContent() {
    let optionData = getOptionContainer();

    $("#question").val("");
    $("#answer-type").val("1");
    $("#options").html(optionData);
    M.updateTextFields();
    $("select").formSelect();
    currentIndex = -1;
}

$("#new-question-btn").click(function() {
    if(window.confirm("All unsaved changes will be lost!")) {
        resetContent();
        orderQuestions();
    }
    else {
        return;
    }
});

$("#delete-current").click(function() {
    if(currentIndex < 0) {
        showToast("Save to perform this action!");
        return;
    }
    else {
        if(window.confirm("Sure to delete this question?")) {
            questionsArr.splice(currentIndex, 1);
            showToast("Question deleted!", "red white-text", "delete_forever");
            reIndexArr();
            resetContent();
            orderQuestions();
        }
        else {
            return;
        }
    }
});

function getOptionContainer(optionVal = "", answerStatus = "") {
    if(answerStatus == "1" || answerStatus == 1) {
        answerStatus = " checked='checked'";
    }

    return "<div class='row option-container'><div class='input-field col s6'><input type='text' value='" + optionVal + "'><label>Option Value</label></div><div class='input-field col s3 switch'><label><input type='checkbox'" + answerStatus + "><span class='lever'></span>Answer</label></div><div class='col s3 delete-option-container right-align'><button class='btn-floating waves-effect red delete-option-btn'><i class='material-icons'>delete_forever</i></button></div></div>";
}

$("#quiz-publish-btn").on("click", function() {
    if(questionsArr.length == 0) {
        showToast("Atleast 1 question is required!", "red white-text", "error");
        return;
    }

    $.ajax({
        url: "db/publish.php",
        type: "POST",
        data: {"data": JSON.stringify(questionsArr)},
        timeout: 60000,
        beforeSend: function() {
            showToast("Publishing...", "orange", "publish");
            $("#quiz-publish-btn").attr("disabled", true);
        },
        success: function(receive) {
            $("#quiz-publish-btn").attr("disabled", false);

            try {
                JSON.parse(receive);
            }
            catch(e) {
                showToast("Data Error!");
                return;
            }

            let data = JSON.parse(receive);

            if(Number(data.error) == 0) {
                showToast("Quiz published!", "green white-text", "done_all");
                $("#published-link").css({"display": "block"});
                let linkBtn = "<a class='btn waves-effect indigo' href=" + data.link + " target='_blank'><i class='material-icons left'>link</i>Link to Quiz</a>";
                $("#published-link").html(linkBtn);
            }
            else {
                showToast(data.errorInfo, "red white-text", "close");
                return;
            }
        },
        error: function() {
            showToast("Server error!", "red", "close");
            $("#quiz-publish-btn").attr("disabled", false);
        }
    });
});