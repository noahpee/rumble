
const items = {
    items:['bag','banana','bathroom','boots','breakfast','bubblegum','chair','cthulhu','dog-duck','dragon','pen','pet-sweep','scissors','tauntaun','unicorn','water-can','wine-glass'],
    darkMode: true,
    comment: "",
  };
let votes = {}

let viewers = {}

let objects = []

let displayArray = []

let previousArray = []

let barNames = []

let barViews = []

let barVotes = []

let ch = false

let CHAR;

let settings;

let totalClicks = document.getElementById('questionsInput').value

let gridColumns = document.getElementById('rowsInput').value

function saveSettings() {
    stringify = JSON.stringify(settings);
    localStorage.setItem("items", stringify);
    console.log(stringify)

  }

  function loadSettings() {
    getSettings = localStorage.getItem("items");
    if (getSettings) {
      settings = JSON.parse(getSettings);
    }
  }

  loadSettings()

  console.log(settings)

function RandomObject(name, image) {
    this.name = name
    this.src = image
    this.views = 0
    this.clicks = 0
}

for (i = 0;i < settings.items.length;i++) {
    let list = new RandomObject(settings.items[i], `./images/${settings.items[i]}.jpeg`)
    objects.push(list)
}

function questionNumber() {
    totalClicks = document.getElementById('questionsInput').value
}

function rowNumber() {
    gridColumns = document.getElementById('rowsInput').value

    if (gridColumns > 8 || gridColumns < 3) {
        return
    } else {
        randomNumbers()
    }
}

function randomNumbers() {

    const container = document.getElementById('randomContainer')
    container.innerHTML = ''
    container.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`
    document.getElementById('finalScore').innerHTML = ''

    previousArray = displayArray

    displayArray = []

    for (j = 0;j < gridColumns;j++) {

        let ran = parseInt(Math.floor(Math.random() * 17) + 0)

        if (displayArray.includes(ran) || (previousArray).includes(ran)) {

            j -= 1

        } else if (totalClicks > 0) {

            displayArray.push(ran)
            let p = document.createElement('p');
            let img = document.createElement('img');
            let tile = document.createElement('div')
            tile.className = 'random-tile'
            img.id = ran
            img.className = 'random-image'
            img.src = objects[ran].src
            p.textContent = objects[ran].name
            tile.appendChild(img)
            tile.appendChild(p)
            container.appendChild(tile)
            objects[ran].views ++
            viewers[ran] = objects[ran].views
            tile.onclick = function addVote() {
                objects[event.target.id].clicks++
                totalClicks--
                let keys = objects[event.target.id].name
                let values = objects[event.target.id].clicks
                votes[keys] = values
                randomNumbers()
            }
        } else {
            questionNumber()
            return finalList()
        }
    }
}

function finalList() {

    barNames = []
    barViews = []
    barVotes = []

    const sortable = Object.entries(votes)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    votes = sortable

    const portable = Object.entries(viewers)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    viewers = portable

    const listItems = document.getElementById('finalScore')

    for (f = 0;f < Object.keys(votes).length;f++) {

        const index = objects.findIndex(item => item.name === Object.keys(votes)[f]);

        let finals = document.createElement('li');
        finals.textContent = `${Object.keys(votes)[f]} has a total of ${Object.values(votes)[f]} votes and was seen ${objects[index].views} times (${Math.round((Object.values(votes)[f]/objects[index].views)*100)}%)`
        listItems.appendChild(finals)
        barNames.push(Object.keys(votes)[f])
        barViews.push(objects[index].views)
        barVotes.push(Object.values(votes)[f])
    }
    const ctx = document.getElementById('myChart');

    ctx.innerHTML = ''

    return hitBut()
}

function hitBut() {

    if (ch == true) {
        CHAR.destroy()
    } 

    ch = true

    const ctx = document.getElementById('myChart');    

    CHAR = new Chart(ctx, {

    type: 'bar',
    data: {
    labels: [...barNames],
    datasets: [{
        label: '# of Votes',
        data: [...barVotes],
        borderWidth: 1
    },
    {
        label: '# of Views',
        data: [...barViews],
        borderWidth: 1
    }]
    },
    options: {
    scales: {
        y: {
        beginAtZero: true
        }
    }
    }
});
}

function enterDarkMode() {
    let body = document.body;
    let button = document.getElementById("darkButton");
    body.classList.remove("light");
    body.classList.add("dark");
    button.setAttribute("checked", "checked");
    settings.darkMode = true;
    saveSettings();
  }
  
  function enterLightmode() {
    let body = document.body;
    let button = document.getElementById("lightButton");
    body.classList.remove("dark");
    body.classList.add("light");
    button.setAttribute("checked", "checked");
    settings.darkMode = false;
    saveSettings();
  }

  function pageLoad() {
    let savedSettings = localStorage.getItem("items");
    if (!savedSettings) {
      return;
    }
    loadSettings();
    if (settings.darkMode) {
      enterDarkMode();
    } else {
      enterLightmode();
    }
  //  commentBox.value = settings.comment;
  }
  let mode = document.getElementsByClassName("mode");

  for (let i = 0; i < mode.length; i++) {
    mode[i].addEventListener("click", function () {
      if (this.value === "dark") {
        enterDarkMode();
      }
      if (this.value === "light") {
        enterLightmode();
      }
    });
  }
  
  pageLoad()