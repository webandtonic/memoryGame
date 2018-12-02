// JavaScript Document
document.addEventListener("DOMContentLoaded", function () {

  // global variables, arrays, nodeLists

  const memoryCards = document.querySelectorAll("article.memory-card"); // outer card container

  const divs = document.querySelectorAll("div.memory-card"); // inner card container

  const pictures = ["goldfish", "brassica_napus", "dicentra", "edelweiss", "flowers", "h_vulgare", "pulsatilla", "syringa", "goldfish", "brassica_napus", "dicentra", "edelweiss", "flowers", "h_vulgare", "pulsatilla", "syringa"]; // array for the actual card pairs

  const buttons = document.querySelectorAll("button.reset");

  let cards = []; // array for current card pair to check for matches

  let openedCards = []; // array to count the open card pairs

  let timer;

  let moves = 0;

  let sec = 0;

  let min = 0;

  // function declarations

  function sortPictures() {
    pictures.sort(function(a, b){return 0.5 - Math.random()});
  }

  function addEvtLst() {
    for (let memoryCard of memoryCards) {
    memoryCard.addEventListener("click", openCard);
    }
  }

  function createPicture() {
    for (i = 0; i < 16; i += 1) { //looping through the pictures array
      let pictureElement = document.createElement("picture");
      pictureElement.setAttribute("class", pictures[i]);
      let sourceElement = document.createElement("source");
      sourceElement.setAttribute("media", "(min-width: 750px)");
      sourceElement.setAttribute("srcset", ("images/" + pictures[i] + "_300.jpg"));
      let imgElement = document.createElement("img");
      imgElement.setAttribute("src", ("images/" + pictures[i] + "_150.jpg"));
      imgElement.setAttribute("alt", pictures[i]);
      pictureElement.appendChild(sourceElement);
      pictureElement.appendChild(imgElement);
      divs[i].appendChild(pictureElement);
    }
  }

  function removePicture() {
    for (let div of divs) {
      let pic = div.querySelector("picture");
      div.removeChild(pic);
    };
  }

  function countSeconds() {
    sec = sec + 1;
    if (sec > 59) {
      min = min + 1;
      sec = 0;
    }
    displayTime();
  }

  function displayTime() {
    let time = ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec);
    document.querySelector("p.timer").innerHTML = ("Time: " + time);
  }

  function displayTotalTime() {
    let time = ((min < 10) ? "0" + min : min) + "min " + ((sec < 10) ? "0" + sec : sec) + "sec";
    document.querySelector("span.time").innerHTML = time;
  }

  function startTimer() {
    timer = setInterval(countSeconds, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function resetTimer() {
    stopTimer();
    sec = 0;
    min = 0;
    displayTime();
    startTimer();
  }


  function countMoves() {
    moves = moves + 1;
    document.querySelector("p.counter").innerHTML = ("Moves: " + moves);
    if (moves == 73) {
      document.querySelector("span.fa:nth-of-type(1)").classList.remove("checked");
    } else if (moves == 61) {
      document.querySelector("span.fa:nth-of-type(2)").classList.remove("checked");
    } else if (moves == 49) {
      document.querySelector("span.fa:nth-of-type(3)").classList.remove("checked");
    } else if (moves == 37) {
      document.querySelector("span.fa:nth-of-type(4)").classList.remove("checked");
    } else if (moves == 25) {
      document.querySelector("span.fa:nth-of-type(5)").classList.remove("checked");
    }
  }


  function openCard() {
    this.querySelector('picture').style.display = "block";
    countMoves();
    let card = this.querySelector("picture").getAttribute("class");
    cards.push(card);
    if (cards.length > 1) {
      if (cards[0] === cards[1]) {
        let matches = document.getElementsByClassName(card);
        for (let match of matches) {
          function removeClasses() { // function to run after the css animation "whoop" contained in the class "match"
            match.parentNode.parentNode.classList.remove("match");
            match.parentNode.parentNode.removeAttribute("style");
            match.parentNode.parentNode.removeEventListener("click", openCard); // take the card pair out of the game
          }
          match.parentNode.parentNode.classList.add("match");
          match.parentNode.parentNode.style.animationPlayState = "running";
          setTimeout(removeClasses, 500); // make sure the css animation has run before running the removeClasses function
        }
        cards.splice(0, 2);
        openedCards.push(card);
        if (openedCards.length === 8) {
          endGame();
        }
      } else {
          closeCards();
          cards.splice(0, 2);
        }
      }
  }

  function closeCards() {
    for (let card of cards) {
      let mismatches = document.getElementsByClassName(card); // collect the opened cards - !!! this will collect the opened cards and the matching closed ones !!!
      for (let mismatch of mismatches) { // loop through the opened cards and their matches
        function removeClasses() { // function to run after the css animation "wriggle" contained in the class "mismatch"
          mismatch.parentNode.parentNode.classList.remove("mismatch");
          mismatch.parentNode.parentNode.removeAttribute("style");
          mismatch.removeAttribute("style");
        }
        if (mismatch.hasAttribute("style")){ // make sure only the opened cards are animated (style attribute added on opening)
          mismatch.parentNode.parentNode.classList.add("mismatch");
          mismatch.parentNode.parentNode.style.animationPlayState = "running";
        };
        setTimeout(removeClasses, 500); // make sure the css animation has run before running the removeClasses function
      }
    }
  }

  function startGame() {
    startTimer();
    document.querySelector("section.start-game").style.display = "none";
  }

  function endGame() {
    stopTimer();
    displayTotalTime();
    document.querySelector("span.moves").innerHTML = moves;
    let rating = document.querySelectorAll(".checked");
    document.querySelector("span.rating").innerHTML = rating.length;
    document.querySelector("section.new-game").style.display = "flex";
  }

  function newGame() {
    sortPictures();
    addEvtLst();
    removePicture();
    createPicture();
    cards.splice(0, cards.length);
    openedCards.splice(0, openedCards.length);
    moves = 0;
    document.querySelector("p.counter").innerHTML = ("Moves: " + moves);
    const stars = document.querySelectorAll("span.fa");
    for (let star of stars) {
      star.classList.add("checked");
    }
    resetTimer();
    document.querySelector("section.new-game").style.display = "none"; // close the end-of-game modal
  }

  // functions to run on DOMContentLoaded

  sortPictures();

  addEvtLst();

  createPicture();

  // add event listeners to the buttons on DOMContentLoaded

  for (let button of buttons) {
    button.addEventListener("click", newGame);
  };

  document.querySelector("button.start").addEventListener("click", startGame);

});
