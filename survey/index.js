Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-success";

var json = {
    showCompletedPage: false,
    questions: [
        {
            type: "radiogroup",
            name: "personality",
            title: "Which PBS personality has had the greatest impact on you?",
            isRequired: true,
            colCount: 1,
            choices: [
                "Bill Nye",
                "Bob Ross",
                "Fred Rogers",
                "Julia Child",
                "LeVar Burton"
            ]
        }
    ]
};

window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        $.ajax({
            type: 'POST',
            url: '/submit/index.php',
            data: {'response': JSON.stringify(result.data)},
            dataType: 'json',
            success: function(response) {
                localStorage.setItem('answer', result.data.personality);
                showAnswer(result.data.personality);
            }
        });
    });

showAnswer = function(answer) {
    document.querySelector('#surveyResult')
        .innerHTML = '<div class="jumbotron">'
                   + '<h1 class="display-4">You selected <span class="text-muted">' + answer + '</span>!</h1>'
                   + '<p class="lead">Thanks for taking the survey!</p>'
                   + '<p class="lead"><a class="btn btn-success btn-lg" href="/graph" role="button">See results!</a></p>'
                   + '</div>';
};

var answer = localStorage.getItem('answer');
if (answer == null) {
    $("#surveyElement").Survey({model: survey});
}
else {
    showAnswer(answer);
}
