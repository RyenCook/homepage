const CONFIG = [
    DuckDuckGo = {
        links: [
            link1 = {
                name: "CANVAS",
                url: "https://utk.instructure.com/"
            },
            link2 = {
                name: "DRIVE",
                url: "https://drive.google.com"
            },
            link3 = {
                name: "GITHUB",
                url: "https://github.com"
            },
            link4 = {
                name: "GMAIL",
                url: "https://mail.google.com"
            },
            link5 = {
                name: "NETFLIX",
                url: "https://www.netflix.com/browse"
            },
            link6 = {
                name: "REDDIT",
                url: "https://www.reddit.com"
            },
            link6 = {
                name: "MYUTK",
                url: "https://my.utk.edu"
            },
            link6 = {
                name: "YOUTUBE",
                url: "https://youtube.com/"
            }
        ],
        icontype: "fas",
        icon: "fa-search",
        url: "https://duckduckgo.com/",
        query: "?q=",
        ph: "",
        name: "DuckDuckGo",
        method: "post",
        color: "#555" //Not used yet
    },

    Reddit = {
        links: [
            link1 = {
                name: "ALL",
                url: "https://reddit.com/r/all"
            },
            link2 = {
                name: "ARTING",
                url: "https://www.reddit.com/me/m/arting/"
            },
            link3 = {
                name: "DESIGN",
                url: "https://www.reddit.com/me/m/design/"
            },
            link4 = {
                name: "FRONTPAGE",
                url: "https://reddit.com"
            }
        ],
        icontype: "fab",
        icon: "fa-reddit",
        url: "https://reddit.com/r/",
        query: "",
        ph: "r/",
        name: "reddit",
        method: "post",
        color: "#555" //Not used yet
    },

    Youtube = {
        links: [
            link1 = {
                name: "SUBSCRIPTIONS",
                url: "https://www.youtube.com/feed/subscriptions"
            },
            link2 = {
                name: "TRENDING",
                url: "https://www.youtube.com/feed/trending"
            }
        ],
        icontype: "fab",
        icon: "fa-youtube",
        url: "https://www.youtube.com/results",
        query: "?search_query=",
        ph: "",
        name: "youtube",
        method: "post",
        color: "#555" //Not used yet
    },

    Github = {
        links: [
            link1 = {
                name: "REPOSITORIES",
                url: "https://github.com/RyenCook?tab=repositories"
            },
        ],
        icontype: "fab",
        icon: "fa-github-alt",
        url: "https://github.com//search",
        query: "?q=",
        ph: "",
        name: "github",
        method: "post",
        color: "#555" //Not used yet
    },

    Amazon = {
        links: [
            link1 = {
                name: "ORDERS",
                url :"https://www.amazon.com/gp/css/order-history"
            }
        ],
        icontype: "fab",
        icon: "fa-amazon",
        url: "https://www.amazon.com/s/",
        query: "ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=",
        ph: "",
        name: "amazon",
        method: "post",
        color: "#555" //Not used yet
    }
];

const GREETINGS = ["hello world", "hola", " bonjour", "welcome home", "bienvenue", "bienvenidos",
    "olá", "dzien' dobry", "hej", "ciào", "guten tag", "hallo",
    "ello", "salut", "saluton", "salve", "dobro požalovat", "walcome", "alatuyla",
    "konnichi wa", "marhaba", "jambo", "ni hau", "o shit waddup",
    "moshi moshi", "hi welcome to chili's", "hoi", "goedendag", "hyvää päivää",
    "shalom", "ma kore", "namaste", "ohayou gozaimasu", "kwe kwe", "nuqneh",
    "sup braddah", "moïen", "sain baina uu", "ya'at'eeh", "privet", "zdravstvuyte",
    "shwmai", "sawubona"
];

var defaultEng = DuckDuckGo;
var currEng = defaultEng;
var logo = document.querySelector("i").classList;
var input = document.querySelector("input");
var form = document.querySelector("form");
var curr = 0;


function getEngine() {
    eng = getQueryVariable("engine");
    get = {};

    for (var i = 0; i < CONFIG.length; i++) {
        get[CONFIG[i].name] = CONFIG[i];
    }

    return get[eng];
    //console.log("HASH: " + hash.name);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }

    return (false);
}
//console.log(getQueryVariable("engine"));

//Changes all required things when changing search-engine
function setEngine(obj) {
    oldEng = currEng;
    currEng = obj;
    document.getElementById("buttons").innerHTML = null;
    for (i = 0; i < currEng.links.length; i++) {
        document.getElementById("buttons").innerHTML += '<a class="btn" href="' + currEng.links[i].url + '">' + obj.links[i].name + '</a>\n';
        if (!(i % 5) && i != 0) {
            //document.getElementById("buttons").innerHTML += '<br><br><br>';
        }
    }

    //form.action = currEng.url;
    console.log(form.action);
    input.placeholder = currEng.ph;
    //window.location. = "?engine=" + currEng.name;
    input.name = currEng.query;
    form.method = currEng.method;

    logo.remove(oldEng.icontype)
    logo.remove(oldEng.icon);
    logo.add(currEng.icontype)
    logo.add(currEng.icon);
    //DEBUG
    console.log("OBJ SET: " + oldEng.name + " -> " + currEng.name + " ~~ " + i + "/" + currEng.links.length + " buttons added.");
    //DEBUG

    for (var i = 0; i < CONFIG.length; i++) {
        if (CONFIG[i].name == currEng.name) {
            curr = i;
            //Sets curr to engines array-number, so that nextSearchEngine knows what comes next
        }
    }
}

function nextSearchEngine() {
    //Sets engine to the next object in CONFIG
    if (curr < CONFIG.length) {
        if (curr < (CONFIG.length) - 1) {
            setEngine(CONFIG[++curr]);
            console.log(CONFIG.length);
            console.log(curr);
        } else {
            curr = 0;
            setEngine(CONFIG[curr]);
        }
    } else {
        console.log("critical error")
    }
}

//Runs when form is submitted
function search() {
    window.location = (currEng.url + currEng.query + input.value);
    return false;
}


function init() {
    if (getQueryVariable("engine")) {
        var temp = getEngine();
        setEngine(temp);

        //DEBUG
        console.log("ENGINE SET: " + temp.name);
        //DEBUG

    } else {
        setEngine(defaultEng);
    }
    document.title = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

init();