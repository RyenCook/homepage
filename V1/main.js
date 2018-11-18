// Randomizes and fades in text after document load
$(document).ready(function(){

  var greetings = ["hello world", "hola", " bonjour", "welcome home", "bienvenue", "bienvenidos",
                   "olá", "dzien' dobry", "hej", "ciào", "guten tag", "hallo",
                   "ello", "salut", "saluton", "salve", "dobro požalovat", "walcome", "alatuyla",
                   "do u no de wae", "konnichi wa", "marhaba", "jambo", "ni hau", "o shit waddup", 
                   "moshi moshi", "hi welcome to chili's", "hoi", "goedendag", "hyvää päivää",
                   "shalom", "ma kore", "namaste", "ohayou gozaimasu", "kwe kwe", "nuqneh",
                   "sup braddah", "moïen", "sain baina uu", "ya'at'eeh", "privet", "zdravstvuyte",
                   "shwmai", "sawubona"];
    var rand = Math.floor(Math.random() * greetings.length);
    type('grtn',greetings[rand]);
    $('title').text(greetings[rand]);
});

// Randomly generate a time interval to simulate "typing"
function randomInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Types out text typewriter-style
function type(id, text){
  $('#'+id).addClass('notblinking');
  var rand = 0
  for (var i = 0; i < text.length; i++) {
    rand += parseInt(randomInterval(40,300));
    var typing = setTimeout(function(y){
      $('#'+id).append(text.charAt(y));
    },rand, i);
  };
  // SPECIAL CASES
  setTimeout(function(){
    $('#'+id).removeClass('notblinking');
    if(text === "do u no de wae") {
      $('#grtn').html('<a id="grtn" href=https://www.youtube.com/embed/eix7fLsS058 class="special-greeting blinking">do u no de wae</a>');
    } else {
      $('#'+id).addClass('blinking');
    }
  },rand+333);
}

// Toggles fade of the sub-menus
$(function () {
    $("#yt").click(function () {
      $("#video").fadeToggle("fast");
    });
    $("#tb").click(function () {
        $("#trello").fadeToggle("fast");
    });
    $("#sb").click(function () {
        $("#school").fadeToggle("fast");
    });
});
