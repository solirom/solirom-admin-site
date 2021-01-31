var hash = {
    "&#354;": "&#538;",
    "&#355;": "&#539;",
    "&#351;": "&#537;",
    "&#350;": "&#536;"    
};

$(document).ready(function() {
    new ClipboardJS(".btn", {
        target: function(trigger) {
            return trigger.nextElementSibling;
        }
    });    
    
    $("#search-button").click(function() {
        search();
    });
    
    $("#search-string").keypress(function (event) {
        var code = event.keyCode || event.which;
        
        if (code == 13) {
            search();
        }
    });    
    
});

function search() {
    $("#search-button > i").toggleClass("fa-search fa-spinner fa-spin");
    var searchString = $("#search-string").val();
    searchString = searchString.split("").map((letter) => hash[letter] || letter).join("");
    
    if (searchString != '') {
        $.ajax({
            "url": "/exist/apps/dlr-api/api/bibliography/all-sigla?q=" + searchString,
            dataType: "html"
        }).done(function (data) {
            $("#content").html(data);    
            $("#search-button > i").toggleClass("fa-search fa-spinner fa-spin");
        });
    }    
}
