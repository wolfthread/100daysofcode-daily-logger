// CLASSES

// counter for accomplishments and links input fields
class InputFieldsCounter {
  constructor() {
    this.numLinks = 1;
    this.numAccomplishments = 1;
  }
}

// runner class for timer
class Runner {
  constructor() {
    this.timerStarted = null;
    this.timerNotStarted = true;
  }
}

// timer class
class Timer {
  constructor() {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }
  // methods
  increaseSeconds() {
    if (this.seconds < 59) {
      this.seconds += 1;
    } else {
      this.increaseMinutes();
      this.reset("seconds");
    }
  }

  increaseMinutes() {
    if (this.minutes < 59) {
      this.minutes += 1;
    } else {
      this.increaseHours();
      this.reset("minutes");
    }
  }

  increaseHours() {
    this.hours += 1;
    if (this.hours == 1) {
      popupModal(
        "challengeSuccessModal",
        "challengeSucessText",
        "You have completed the Daily Hour Requirement!"
      );
    }
  }

  reset(id) {
    switch (id) {
      case "seconds":
        this.seconds = 0;
        break;
      case "minutes":
        this.minutes = 0;
        break;
      case "hours":
        this.hours = 0;
        break;
      case "all":
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        break;
      default:
        break;
    }
  }
}

// OBJECTS INSTANCIATIONS
var timer = new Timer();
var entriesCounter = new InputFieldsCounter();
var currentRunner = new Runner();

// MAIN FUNCTIONS

// adding an element to a card
function addElementToCard(elementToAdd, elementId, attributes, cardId) {
  var element = document.createElement(elementToAdd);
  element.setAttribute(...attributes);
  element.setAttribute("id", elementId);
  document.getElementById(cardId).appendChild(element);
}

// removing an element from a card
function removeElementFromCard(cardId) {
  item = document.getElementById(cardId);
  var numItems = item.childNodes.length;
  try {
    item.removeChild(item.childNodes[numItems - 1]);
  } catch {
    popupModal("mainModal", "mainModalText", "There's nothing to remove.");
  }
}

// calling the addElementToCard function with cutsom inputs
function addLinkInput() {
  currLinkId = "link-" + entriesCounter.numLinks;
  addElementToCard("input", currLinkId, ["type", "text"], "linkInput");
  entriesCounter.numLinks += 1;
  LAST_LINK_ID = currLinkId;
}

// calling the addElementToCard function with custom inputs
function addAccomplishmentInput() {
  currAccomplishmentId = "accomplishment-" + entriesCounter.numAccomplishments;
  addElementToCard(
    "input",
    currAccomplishmentId,
    ["type", "text"],
    "accomplishmentInput"
  );
  entriesCounter.numAccomplishments += 1;
  LAST_ACCOMPLISHMENT_ID = currAccomplishmentId;
}

// removal functions
function removeAccomplishmentInput() {
  removeElementFromCard("accomplishmentInput");
  entriesCounter.numAccomplishments -= 1;
}

function removeLinkInput() {
  removeElementFromCard("linkInput");
  entriesCounter.numLinks -= 1;
}

// taking the user inputs and adding the paragraphs in appropriate sections
function addMultipleParagraphs(limit, name, destination) {
  for (let i = 1; i < limit; i++) {
    id = name + i;
    loggedId = id + "-Log";
    let element = document.createElement("p");
    element.setAttribute("id", loggedId);
    document.getElementById(destination).appendChild(element);
    item = document.getElementById(id).value;
    document.getElementById(loggedId).innerHTML = item;
  }
}

// main function to take input and format it for twitter and github pushes
function formatLogs() {
  // today's date
  today = new Date();
  trimmedDate = today.toString().substring(0, 15);
  document.getElementById("dateGithub").innerHTML = trimmedDate;
  // grabbing user input for day
  day = document.getElementById("inputDay").value;
  converted = parseInt(day, 10);
  // check if input is a number
  if (isNaN(converted)) {
    popupModal("mainModal", "mainModalText", "Please enter a valid number.");
  } else {
    document.getElementById("dayNumTwitter").innerHTML = day;
    document.getElementById("dayNumGithub").innerHTML = day;
  }
  // update twitter and github format cards with formatted texts from the user inputs
  thoughts = document.getElementById("inputThoughts").value;
  document.getElementById("twitterBlurb").innerHTML = thoughts;
  document.getElementById("thoughts").innerHTML = thoughts;
  addMultipleParagraphs(entriesCounter.numLinks, "link-", "linksLog");
  addMultipleParagraphs(
    entriesCounter.numAccomplishments,
    "accomplishment-",
    "accomplishmentsLog"
  );
  addMultipleParagraphs(
    entriesCounter.numAccomplishments,
    "accomplishment-",
    "twitterProgress"
  );
}

// MODAL CODE

// modal close
function triggerModalClose(element) {
  var modal = document.getElementById(element);
  modal.style.display = "none";
}

// keeping this one general as we might implement different modals later on
function popupModal(id, placeholder, text) {
  var modal = document.getElementById(id);
  document.getElementById(placeholder).innerHTML = text;
  modal.style.display = "block";
}

// COPYING FUNCTIONS

// Copying the card text
function copyText(element) {
  var text = document.getElementById(element);
  if (document.body.createTextRange) {
    // IE
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else {
    // all others
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  document.execCommand("copy");
  popupModal("mainModal", "mainModalText", "Text Successfully Copied.");
  clearSelection();
}

// Clearing selection once copied
function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

// function to call copyText for twitter
function copyTwitter() {
  copyText("twitterLog");
}

// function to call copyText for github
function copyGithub() {
  copyText("githubLog");
}

// TIMER FUNCTIONS

// Formatting the timer display
function formatDisplay(h, m, s) {
  var formatted = "";
  h < 10 ? (formatted += "0" + h) : (formatted += h);
  formatted += ":";
  m < 10 ? (formatted += "0" + m) : (formatted += m);
  formatted += ":";
  s < 10 ? (formatted += "0" + s) : (formatted += s);
  return formatted;
}

// Displaying the timer attributes in the DOM
function displayTimer() {
  placement = document.getElementById("timer");
  var display = formatDisplay(timer.hours, timer.minutes, timer.seconds);
  placement.innerHTML = display;
}

function changeTimerBkgColor(newColor) {
  document.getElementById("timer").style.backgroundColor = newColor;
}

function startTimer() {
  if (currentRunner.timerNotStarted) {
    currentRunner.timerNotStarted = false;
    changeTimerBkgColor("#5cb85c");
    currentRunner.timerStarted = setInterval(function() {
      timer.increaseSeconds();
      displayTimer();
      displayProgress();
    }, 1000);
  } else {
    popupModal("mainModal", "mainModalText", "Timer already started");
  }
}

function stopTimer() {
  clearInterval(currentRunner.timerStarted);
  currentRunner.timerNotStarted = true;
  changeTimerBkgColor("#d9534f");
}

function resetTimer() {
  if (currentRunner.timerNotStarted) {
    currentRunner.timerNotStarted = true;
    timer.reset("all");
    changeTimerBkgColor("#ed9d2b");
    displayTimer();
    displayProgress();
  } else {
    popupModal("mainModal", "mainModalText", "Timer already started");
  }
}

// Updating the progress bar
function displayProgress() {
  currentProgress = timer.hours < 1 ? (timer.minutes / 60) * 100 : 100;
  progressBar = document.getElementById("progressMarker");
  progressBar.style.width = Math.floor(currentProgress).toString() + "%";
}
