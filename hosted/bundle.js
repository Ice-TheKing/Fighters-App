'use strict';

var activeFighters = [];
var parseJSON = function parseJSON(xhr, content) {
  if (xhr.response) {
    //const obj = JSON.parse(xhr.response);
    console.dir(obj);
  }
};

var randomNum = function randomNum(num) {
  // random number from 1 - num
  var random = Math.floor(Math.random() * num) + 1;
  return random;
};

var handleResponse = function handleResponse(xhr) {
  var content = document.querySelector('#responses');

  var jsonResponse = 'No Response';

  if (xhr.response) {
    jsonResponse = JSON.parse(xhr.response);
  }

  switch (xhr.status) {
    case 200:
      //content.innerHTML = '<b>Success</b>';
      //console.dir(jsonResponse);
      break;
    case 201:
      content.innerHTML = '<b>Created Fighter</b>';
      //console.dir(jsonResponse);
      break;
    case 204:
      //content.innerHTML = '<b>Updated (No Content)</b>';
      //console.dir(jsonResponse);
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      content.innerHTML = content.innerHTML + '<br>' + jsonResponse.message;
      //console.dir(jsonResponse);
      break;
    case 404:
      content.innerHTML = '<b>404 Not Found</b>';

      // no response if it is a HEAD request
      if (jsonResponse.message) {
        content.innerHTML = content.innerHTML + '<br>Message: ' + jsonResponse.message;
      }

      //console.dir(jsonResponse);
      break;
    default:
      content.innerHTML = '<b>Response Code Not implemented by Client</b>';
      break;
  }
};

var sendPost = function sendPost(e, nameForm) {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');

  var fighterNameField = nameForm.querySelector('#fighterNameField');
  var playerNameField = nameForm.querySelector('#playerNameField');
  var healthField = nameForm.querySelector('#healthField');
  var damageField = nameForm.querySelector('#damageField');
  var speedField = nameForm.querySelector('#speedField');
  var armorField = nameForm.querySelector('#armorField');
  var critField = nameForm.querySelector('#critField');

  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = 'fighterName=' + fighterNameField.value;
  formData = formData + '&playerName=' + playerNameField.value;
  formData = formData + '&health=' + healthField.value;
  formData = formData + '&damage=' + damageField.value;
  formData = formData + '&speed=' + speedField.value;
  formData = formData + '&armor=' + armorField.value;
  formData = formData + '&crit=' + critField.value;

  xhr.send(formData);

  // update the display of the fighters again
  getFighters();

  e.preventDefault();
  return false;
};

var addLog = function addLog(text) {
  var xhr = new XMLHttpRequest();
  xhr.open('post', '/addLog');

  var formData = 'text=' + text;

  xhr.send(formData);

  return false;
};

var updateFighter = function updateFighter(fighter) {
  var xhr = new XMLHttpRequest();
  xhr.open('post', '/addFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = 'fighterName=' + fighter.fighterName;
  formData = formData + '&playerName=' + fighter.playerName;
  formData = formData + '&health=' + fighter.health;
  formData = formData + '&damage=' + fighter.damage;
  formData = formData + '&speed=' + fighter.speed;
  formData = formData + '&armor=' + fighter.armor;
  formData = formData + '&crit=' + fighter.crit;
  formData = formData + '&battles=' + fighter.battles;
  formData = formData + '&wins=' + fighter.wins;
  formData = formData + '&secure=' + true;

  xhr.send(formData);

  // e.preventDefault();
  return false;
};

var removeFighter = function removeFighter(fighter) {
  var xhr = new XMLHttpRequest();
  xhr.open('post', '/removeFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  var formData = 'fighterName=' + fighter.fighterName;
  formData = formData + '&playerName=' + fighter.playerName;
  formData = formData + '&health=' + fighter.health;
  formData = formData + '&damage=' + fighter.damage;
  formData = formData + '&speed=' + fighter.speed;
  formData = formData + '&armor=' + fighter.armor;
  formData = formData + '&crit=' + fighter.crit;
  formData = formData + '&battles=' + fighter.battles;
  formData = formData + '&wins=' + fighter.wins;

  xhr.send(formData);
  return false;
};

var getFighters = function getFighters(e) {
  var responseForm = document.querySelector('#responses');
  var xhr = new XMLHttpRequest();

  xhr.open('get', '/getFighters');

  xhr.onload = function () {
    handleResponse(xhr);
    switch (xhr.status) {
      case 200:
        // responseForm.innerHTML = '<b>Success<br>';
        if (xhr.response) {
          // responseForm.innerHTML = `${responseForm.innerHTML}${xhr.response}`;
          var fighters = JSON.parse(xhr.response).fighters;
          // display the fighters
          displayFighters(fighters);
        }
        break;
    }
  };
  xhr.send();

  // update log
  updateLog();

  if (e) // check if e exists, so that we can call getFighters from within the code and not just the button
    e.preventDefault();
  return false;
};

var displayFighters = function displayFighters(fighters) {
  // get all the info back
  var content = document.querySelector('#content');
  // clear content
  content.innerHTML = '';

  // since our array of fighters is indexed by string, we gotta loop through it like this
  Object.keys(fighters).forEach(function (key, index) {
    // display the fighter
    displayFighter(this[key]);
  }, fighters);
};

var displayFighter = function displayFighter(fighter) {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  var content = document.querySelector('#content');
  var div = document.createElement('div');
  var h1 = document.createElement('h1');
  var h2 = document.createElement('h2');
  var ul = document.createElement('ul');
  var selectButton = document.createElement('button');

  // set the classname of div to cardBox so that it can display in a box
  div.className = 'cardBox';

  var active = false;
  for (var i = 0; i < activeFighters.length; i++) {
    if (activeFighters[i] == fighter.fighterName) {
      active = true;
    }
  }
  if (active === true) {
    div.className = div.className + ' active';
  }

  h1.textContent = '' + fighter.fighterName;
  h2.textContent = 'Created by: ' + fighter.playerName;

  // Create list items for each attribute
  var battles = document.createElement('li');
  var wins = document.createElement('li');
  var health = document.createElement('li');
  var damage = document.createElement('li');
  var speed = document.createElement('li');
  var armor = document.createElement('li');
  var crit = document.createElement('li');

  // Fill the text content of each
  battles.textContent = 'Battles: ' + fighter.battles;
  wins.textContent = 'Wins: ' + fighter.wins;
  health.textContent = 'Health: ' + fighter.health;
  damage.textContent = 'Damage: ' + fighter.damage;
  speed.textContent = 'Speed: ' + fighter.speed;
  armor.textContent = 'Armor: ' + fighter.armor;
  crit.textContent = 'Crit: ' + fighter.crit;

  // Append it to the unordered list
  ul.appendChild(battles);
  ul.appendChild(wins);
  ul.appendChild(health);
  ul.appendChild(damage);
  ul.appendChild(speed);
  ul.appendChild(armor);
  ul.appendChild(crit);

  // append everything to the div
  div.appendChild(h1);
  div.appendChild(h2);
  div.appendChild(ul);

  // add it to the content
  content.appendChild(div);

  // make a function to set the fighter as active if they click the div
  var setActive = function setActive() {
    // add the clicked user's name to the activeFighters object
    // check if its already there
    var currentlyActive = false;
    for (var _i = 0; _i < activeFighters.length; _i++) {
      if (activeFighters[_i] == fighter.fighterName) {
        currentlyActive = true;
        // since it exists, we want to remove it
        activeFighters.splice(_i, 1);
      }
    }

    if (currentlyActive == false) activeFighters.push(fighter.fighterName);

    // check to see if active fighters is greater than 2. If it is, remove the first index (so the newer clicked object stays instead of the older one)
    if (activeFighters.length > 2) activeFighters.splice(0, 1);

    // redraw the fighters html section
    getFighters();
  };

  // make an onclick for the div to flip the value of active
  div.onclick = setActive;
  div.style.cursor = 'pointer';
};

var fight = function fight(death) {
  // for getting back the JSON object with the fighters and return it
  if (activeFighters.length != 2) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('get', '/getFighters');
  var fighters = {};

  xhr.onload = function () {
    switch (xhr.status) {
      case 200:
        if (xhr.response) {
          fighters = JSON.parse(xhr.response).fighters;
          runBattle(fighters, death);
        }
        break;
      default:
        break;
    }

    // update fighters
    getFighters();
  };
  xhr.send();
  return false;
};

var runBattle = function runBattle(fighters, death) {
  // pull the fighters that were selected
  if (!(fighters[activeFighters[0]] && fighters[activeFighters[1]])) {
    // for some reason, the active fighters do not exist in the array. Tell the user to try again
    console.dir('invalid fighters');
    return;
  }
  var fighter1 = fighters[activeFighters[0]];
  var fighter2 = fighters[activeFighters[1]];

  var result = {};

  // determine the winner
  result = calculateWinner(fighter1, fighter2);

  if (!result.winner || !result.loser) {
    console.dir('Something went wrong when calculating winner. Please try again');
    return;
  }

  result.winner.battles = parseInt(result.winner.battles);
  result.winner.wins = parseInt(result.winner.wins);
  result.loser.battles = parseInt(result.loser.battles);
  result.winner.battles += 1;
  result.winner.wins += 1;
  result.loser.battles += 1;

  // increase stats of fighters

  // remove the loser and increase skill of the winner if its a deathmatch
  if (death === true) {
    removeFighter(result.loser);

    // add death log
    addLog(result.winner.fighterName + ' <span style="color:red;">killed</span> ' + result.loser.fighterName + ' in a deathmatch');

    // increase winner's stats
    fighter1 = increaseStats(result.winner);
  } else {
    updateFighter(result.loser);

    // add spar log
    addLog(result.winner.fighterName + ' <span style="color:rgba(57,142,41,1);">defeated</span> ' + result.loser.fighterName + ' in a battle');
  }

  updateFighter(result.winner);

  // reset active fighters
  activeFighters = [];
};

var calculateWinner = function calculateWinner(fighter1, fighter2) {
  /* COMBAT ORDER
  1: speed + d6 vs speed + d6 winner goes first in round
  2: check crit on a percentile
  3: damage + d6, armor
  4: if(crit) damage = parseint(damage*=1.5);
  5: target.health -= Math.max(0,(damage - armor));
  6: repeat 1-5 for lower speed roll
  7: loop 1-6 until a character has less than 1 health
  */

  // add an iteratable health property. This is the health we will subtract from so we don't modify the original health values
  fighter1.iterHealth = fighter1.health;
  fighter2.iterHealth = fighter2.health;

  var result = {};
  var diceSides = 8; // each roll will happen with this many sides. (if 6 sided, random values will be from 1 - 6)
  var roll = 0;

  // pointers to the fighters depending on who's turn it is
  var attacker = {};
  var defender = {};

  while (true) {
    /* evaluate speeds */
    roll = randomNum(diceSides);
    var f1Speed = fighter1.speed + roll;

    roll = randomNum(diceSides);
    var f2Speed = fighter2.speed + roll;

    console.dir(fighter1.fighterName + ' Speed: ' + f1Speed + ' ' + fighter2.fighterName + ' Speed: ' + f2Speed);

    if (f1Speed > f2Speed) {
      attacker = fighter1;
      defender = fighter2;
    } else {
      attacker = fighter2;
      defender = fighter1;
    }

    console.dir(attacker.fighterName + ' will go first');

    // attack with the current turn
    attack(attacker, defender, diceSides);
    if (defender.iterHealth <= 0) {
      result.winner = attacker;
      result.loser = defender;
      return result;
    }
    attack(defender, attacker, diceSides);
    if (attacker.iterHealth <= 0) {
      result.winner = defender;
      result.loser = attacker;
      return result;
    }
  }

  return result;
};

var attack = function attack(attacker, defender, diceSides) {
  // check crit
  var crit = false;
  var roll = randomNum(100); // chance of 1 - 100. Percentile
  if (attacker.crit * 2 >= roll) {
    // crit chance is double what the crit value of the character is. So crit 3 = 6% chance
    // if the roll is less or equal to the crit chance, the attacker has crit
    crit = true;
  }

  console.dir(attacker.fighterName + ' crit roll: ' + roll + '. crit: ' + crit);

  roll = randomNum(diceSides);
  var damage = attacker.damage + roll;
  // roll = randomNum(diceSides);
  // let armor = defender.armor + roll;
  var armor = defender.armor; // right now, rolling a d6 for armor is really op

  console.dir(attacker.fighterName + ' damage: ' + damage + ' ' + defender.fighterName + ' armor: ' + armor);

  // if crit, multiply the damage by 1.5
  if (crit) damage = parseInt(damage *= 1.5);

  // subtract armor from damage
  defender.iterHealth -= Math.max(0, damage - armor);

  console.dir(defender.fighterName + ' health now = ' + defender.iterHealth);
};

var increaseStats = function increaseStats(fighter) {
  var randomStat = Math.floor(Math.random() * 5 + 1); // random number between 1 and 5

  // upgrade a random stat by one
  switch (randomStat) {
    case 1:
      fighter.health = Number(fighter.health) + 1;
      addLog(fighter.fighterName + '\'s health has increased by 1');
      break;
    case 2:
      fighter.damage = Number(fighter.damage) + 1;
      addLog(fighter.fighterName + '\'s damage has increased by 1');
      break;
    case 3:
      fighter.speed = Number(fighter.speed) + 1;
      addLog(fighter.fighterName + '\'s speed has increased by 1');
      break;
    case 4:
      fighter.armor = Number(fighter.armor) + 1;
      addLog(fighter.fighterName + '\'s armor has increased by 1');
      break;
    case 5:
      fighter.crit = Number(fighter.crit) + 1;
      addLog(fighter.fighterName + '\'s crit has increased by 1');
      break;
    default:
      break;
  }

  // return the fighter back
  return fighter;
};

var calculatePointsLeft = function calculatePointsLeft(nameForm, pointField) {
  var healthField = nameForm.querySelector('#healthField');
  var damageField = nameForm.querySelector('#damageField');
  var speedField = nameForm.querySelector('#speedField');
  var armorField = nameForm.querySelector('#armorField');
  var critField = nameForm.querySelector('#critField');

  var totalValue = Number(healthField.value) + Number(damageField.value) + Number(speedField.value) + Number(armorField.value) + Number(critField.value);

  var pointsLeft = 36 - totalValue;
  pointField.textContent = 'Points Left: ' + pointsLeft;
};

var initStatFields = function initStatFields(nameForm, pointField) {
  var healthField = nameForm.querySelector('#healthField');
  var damageField = nameForm.querySelector('#damageField');
  var speedField = nameForm.querySelector('#speedField');
  var armorField = nameForm.querySelector('#armorField');
  var critField = nameForm.querySelector('#critField');

  var callCalculatePoints = function callCalculatePoints() {
    return calculatePointsLeft(nameForm, pointField);
  };

  healthField.addEventListener('input', callCalculatePoints);
  damageField.addEventListener('input', callCalculatePoints);
  speedField.addEventListener('input', callCalculatePoints);
  armorField.addEventListener('input', callCalculatePoints);
  critField.addEventListener('input', callCalculatePoints);
};

var updateLog = function updateLog() {
  var xhr = new XMLHttpRequest();

  xhr.open('get', '/getLog');

  xhr.onload = function () {
    switch (xhr.status) {
      case 200:
        var logForm = document.querySelector('#logContent');

        // clear form
        logForm.innerHTML = '';

        // retrieve the array of logs
        var logArray = JSON.parse(xhr.response).log;

        // log each element
        for (var i = 0; i < logArray.length; i++) {
          logItem(logArray[i], logForm);
        }

        break;
    }
  };
  xhr.send();
  return false;
};

var logItem = function logItem(text, logForm) {
  logForm.innerHTML = '<p>' + text + '</p>' + logForm.innerHTML; // add the text before everything else
};

var init = function init() {
  var nameForm = document.querySelector('#nameForm');
  var methodSelect = document.querySelector('#methodSelect');
  var pointField = document.querySelector('#pointField');

  var addFighter = function addFighter(e) {
    return sendPost(e, nameForm);
  };
  var findFighters = function findFighters(e) {
    return getFighters(e);
  };

  nameForm.addEventListener('submit', addFighter);

  initStatFields(nameForm, pointField);

  // set up the fight buttons
  var fightButton = document.querySelector('#fightButton');
  var deathMatchButton = document.querySelector('#deathMatchButton');
  var startFight = function startFight() {
    return fight(false);
  }; // (is death active) = false
  var startDeathMatch = function startDeathMatch() {
    return fight(true);
  }; // (is death active) = true

  fightButton.addEventListener('click', startFight);
  deathMatchButton.addEventListener('click', startDeathMatch);

  // set the initial fighter
  getFighters();

  // set the page to reload fighters every 2 seconds
  window.setInterval(function () {
    getFighters();
  }, 2000);
};
window.onload = init;
