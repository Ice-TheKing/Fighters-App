let activeFighters = [];
const parseJSON = (xhr, content) => {
  if(xhr.response) {
    //const obj = JSON.parse(xhr.response);
    console.dir(obj);
  }
};

const randomNum = (num) => {
  // random number from 1 - num
  let random = Math.floor(Math.random() * num) + 1;
  return random;
};

const handleResponse = (xhr) => {
  const content = document.querySelector('#responses');
  
  let jsonResponse = 'No Response';
  
  if(xhr.response) {
    jsonResponse = JSON.parse(xhr.response);
  }
  
  switch(xhr.status) {
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
      content.innerHTML = `${content.innerHTML}<br>${jsonResponse.message}`;
      //console.dir(jsonResponse);
      break;
    case 404:
      content.innerHTML = '<b>404 Not Found</b>';
      
      // no response if it is a HEAD request
      if(jsonResponse.message) {
        content.innerHTML = `${content.innerHTML}<br>Message: ${jsonResponse.message}`;
      }
      
      //console.dir(jsonResponse);
      break;
    default:
      content.innerHTML = '<b>Response Code Not implemented by Client</b>';
      break;
  }
};

const sendPost = (e, nameForm) => {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const fighterNameField = nameForm.querySelector('#fighterNameField');
  const playerNameField = nameForm.querySelector('#playerNameField');
  const healthField = nameForm.querySelector('#healthField');
  const damageField = nameForm.querySelector('#damageField');
  const speedField = nameForm.querySelector('#speedField');
  const armorField = nameForm.querySelector('#armorField');
  const critField = nameForm.querySelector('#critField');
  
  const xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr);
  
  let formData = `fighterName=${fighterNameField.value}`;
  formData = `${formData}&playerName=${playerNameField.value}`;
  formData = `${formData}&health=${healthField.value}`;
  formData = `${formData}&damage=${damageField.value}`;
  formData = `${formData}&speed=${speedField.value}`;
  formData = `${formData}&armor=${armorField.value}`;
  formData = `${formData}&crit=${critField.value}`;
  
  xhr.send(formData);
  
  // update the display of the fighters again
  getFighters();
  
  e.preventDefault();
  return false;
};

const addLog = (text) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/addLog');
  
  let formData = `text=${text}`;
  
  xhr.send(formData);
  
  return false;  
};

const updateFighter = (fighter) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/addFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr);
  
  let formData = `fighterName=${fighter.fighterName}`;
  formData = `${formData}&playerName=${fighter.playerName}`;
  formData = `${formData}&health=${fighter.health}`;
  formData = `${formData}&damage=${fighter.damage}`;
  formData = `${formData}&speed=${fighter.speed}`;
  formData = `${formData}&armor=${fighter.armor}`;
  formData = `${formData}&crit=${fighter.crit}`;
  formData = `${formData}&battles=${fighter.battles}`;
  formData = `${formData}&wins=${fighter.wins}`;
  formData = `${formData}&secure=${true}`;
  
  xhr.send(formData);
  
  // e.preventDefault();
  return false;
};

const removeFighter = (fighter) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/removeFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  let formData = `fighterName=${fighter.fighterName}`;
  formData = `${formData}&playerName=${fighter.playerName}`;
  formData = `${formData}&health=${fighter.health}`;
  formData = `${formData}&damage=${fighter.damage}`;
  formData = `${formData}&speed=${fighter.speed}`;
  formData = `${formData}&armor=${fighter.armor}`;
  formData = `${formData}&crit=${fighter.crit}`;
  formData = `${formData}&battles=${fighter.battles}`;
  formData = `${formData}&wins=${fighter.wins}`;
  
  xhr.send(formData);
  return false;
};

const xhrRequestFighters = () => {
  // for getting back the JSON object with the fighters and return it
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/getFighters');
  let fighters = {};
  
  xhr.onload = () => {
    switch(xhr.status) {
        case 200:
          if(xhr.response) {
            fighters = (JSON.parse(xhr.response)).fighters;
            return fighters;
          }
          break;
      }
  };
  xhr.send();
  
  // return fighters;
};

const getFighters = (e) => {
  const responseForm = document.querySelector('#responses');
  const xhr = new XMLHttpRequest();
  
  xhr.open('get', '/getFighters');
  
  xhr.onload = () => {
    handleResponse(xhr);
    switch(xhr.status) {
      case 200:
        // responseForm.innerHTML = '<b>Success<br>';
        if(xhr.response) {
          // responseForm.innerHTML = `${responseForm.innerHTML}${xhr.response}`;
          const fighters = (JSON.parse(xhr.response)).fighters;
          // display the fighters
          displayFighters(fighters);
        }
        break;
    }
  };
  xhr.send();
  
  // update log
  updateLog();
  
  if(e) // check if e exists, so that we can call getFighters from within the code and not just the button
    e.preventDefault();
  return false;
};

const displayFighters = (fighters) => {
  // get all the info back
  const content = document.querySelector('#content');
  // clear content
  content.innerHTML = '';
  
  // since our array of fighters is indexed by string, we gotta loop through it like this
  Object.keys(fighters).forEach(function(key, index) {
    // display the fighter
    displayFighter(this[key]);
  }, fighters);
};

const displayFighter = (fighter) => {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  const content = document.querySelector('#content');
  const div = document.createElement('div');
  const h1 = document.createElement('h1');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');
  const selectButton = document.createElement('button');

  // set the classname of div to cardBox so that it can display in a box
  div.className = 'cardBox';

  let active = false;
  for(let i = 0; i < activeFighters.length; i++) {
    if(activeFighters[i] == fighter.fighterName) {
      active = true;
    }
  }
  if(active === true) {
    div.className = `${div.className} active`;
  }

  h1.textContent = `${fighter.fighterName}`;
  h2.textContent = `Created by: ${fighter.playerName}`;

  // Create list items for each attribute
  const battles = document.createElement('li');
  const wins = document.createElement('li');
  const health = document.createElement('li');
  const damage = document.createElement('li');
  const speed = document.createElement('li');
  const armor = document.createElement('li');
  const crit = document.createElement('li');
  
  
  // Fill the text content of each
  battles.textContent = `Battles: ${fighter.battles}`;
  wins.textContent = `Wins: ${fighter.wins}`;
  health.textContent = `Health: ${fighter.health}`;
  damage.textContent = `Damage: ${fighter.damage}`;
  speed.textContent = `Speed: ${fighter.speed}`;
  armor.textContent = `Armor: ${fighter.armor}`;
  crit.textContent = `Crit: ${fighter.crit}`;

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
  const setActive = () => {
    // add the clicked user's name to the activeFighters object
    // check if its already there
    let currentlyActive = false;
    for(let i = 0; i < activeFighters.length; i++) {
      if(activeFighters[i] == fighter.fighterName) {
        currentlyActive = true;
        // since it exists, we want to remove it
        activeFighters.splice(i, 1);
      }
    }
    
    if(currentlyActive == false)
      activeFighters.push(fighter.fighterName);
    
    // check to see if active fighters is greater than 2. If it is, remove the first index (so the newer clicked object stays instead of the older one)
    if(activeFighters.length > 2)
      activeFighters.splice(0, 1);
    
    // redraw the fighters html section
    getFighters();
  };

  // make an onclick for the div to flip the value of active
  div.onclick = setActive;
  div.style.cursor = 'pointer';
};

const fight = (death) => {
  // for getting back the JSON object with the fighters and return it
  if(activeFighters.length != 2) {
    return;
  }
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/getFighters');
  let fighters = {};
  
  xhr.onload = () => {
    switch(xhr.status) {
      case 200:
        if(xhr.response) {
          fighters = (JSON.parse(xhr.response)).fighters;
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
};

const runBattle = (fighters, death) => {
  // pull the fighters that were selected
  if(!(fighters[activeFighters[0]] && fighters[activeFighters[1]])) {
    // for some reason, the active fighters do not exist in the array. Tell the user to try again
    console.dir('invalid fighters');
    return;
  }
  let fighter1 = fighters[activeFighters[0]];
  let fighter2 = fighters[activeFighters[1]];

  let result = {};
  
  // determine the winner
  result = calculateWinner(fighter1, fighter2);
  
  if(!result.winner || !result.loser) {
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
  if(death === true) {
    removeFighter(result.loser);
    
    // add death log
    addLog(`${result.winner.fighterName} <span style="color:red;">killed</span> ${result.loser.fighterName} in a deathmatch`);
    
    // increase winner's stats
    fighter1 = increaseStats(result.winner);
  } else {
    updateFighter(result.loser);
    
    // add spar log
    addLog(`${result.winner.fighterName} <span style="color:rgba(57,142,41,1);">defeated</span> ${result.loser.fighterName} in a battle`);
  }
  
  updateFighter(result.winner);
  
  // reset active fighters
  activeFighters = [];
};

const calculateWinner = (fighter1, fighter2) => {
  /* COMBAT ORDER
  1: speed + d6 vs speed + d6 winner goes first in round
  2: check crit on a percentile
  3: damage + d6, armor + d6
  4: if(crit) damage = parseint(damage*=1.5);
  5: target.health -= Math.max(0,(damage - armor));
  6: repeat 1-5 for lower speed roll
  7: loop 1-6 until a character has less than 1 health
  */
  
  // add an iteratable health property. This is the health we will subtract from so we don't modify the original health values
  fighter1.iterHealth = fighter1.health;
  fighter2.iterHealth = fighter2.health;
  
  let result = {};
  let diceSides = 8; // each roll will happen with this many sides. (if 6 sided, random values will be from 1 - 6)
  let roll = 0;
  
  // pointers to the fighters depending on who's turn it is
  let attacker = {};
  let defender = {};
  
  while(true) {
    /* evaluate speeds */
    roll = randomNum(diceSides);
    let f1Speed = fighter1.speed + roll;
    
    roll = randomNum(diceSides);
    let f2Speed = fighter2.speed + roll;
    
    console.dir(`${fighter1.fighterName} Speed: ${f1Speed} ${fighter2.fighterName} Speed: ${f2Speed}`);
    
    if(f1Speed > f2Speed) {
      attacker = fighter1;
      defender = fighter2;
    } else {
      attacker = fighter2;
      defender = fighter1;
    }
    
    console.dir(`${attacker.fighterName} will go first`);
    
    // attack with the current turn
    attack(attacker, defender, diceSides);
    if(defender.iterHealth <= 0) {
      result.winner = attacker;
      result.loser = defender;
      return(result);
    }
    attack(defender, attacker, diceSides);
    if(attacker.iterHealth <= 0) {
      result.winner = defender;
      result.loser = attacker;
      return(result);
    }
  }  
  
  return result;
};

const attack = (attacker, defender, diceSides) => {  
  // check crit
  let crit = false;
  let roll = randomNum(100); // chance of 1 - 100. Percentile
  if((attacker.crit * 2) >= roll) { // crit chance is double what the crit value of the character is. So crit 3 = 6% chance
    // if the roll is less or equal to the crit chance, the attacker has crit
    crit = true;
  }
  
  console.dir(`${attacker.fighterName} crit roll: ${roll}. crit: ${crit}`);
  
  roll = randomNum(diceSides);
  let damage = attacker.damage + roll;
  // roll = randomNum(diceSides);
  // let armor = defender.armor + roll;
  let armor = defender.armor; // right now, rolling a d6 for armor is really op
  
  console.dir(`${attacker.fighterName} damage: ${damage} ${defender.fighterName} armor: ${armor}`);
  
  // if crit, multiply the damage by 1.5
  if(crit) damage = parseInt(damage*=1.5);
  
  // subtract armor from damage
  defender.iterHealth -= Math.max(0, (damage-armor) );
  
  console.dir(`${defender.fighterName} health now = ${defender.iterHealth}`);
}

const increaseStats = (fighter) => {
  const randomStat = Math.floor((Math.random() * 5) + 1); // random number between 1 and 5
  
  // upgrade a random stat by one
  switch(randomStat) {
    case 1:
      fighter.health = Number(fighter.health) + 1;
      addLog(`${fighter.fighterName}'s health has increased by 1`);
      break;
    case 2:
      fighter.damage = Number(fighter.damage) + 1;
      addLog(`${fighter.fighterName}'s damage has increased by 1`);
      break;
    case 3:
      fighter.speed = Number(fighter.speed) + 1;
      addLog(`${fighter.fighterName}'s speed has increased by 1`);
      break;
    case 4:
      fighter.armor = Number(fighter.armor) + 1;
      addLog(`${fighter.fighterName}'s armor has increased by 1`);
      break;
    case 5:
      fighter.crit = Number(fighter.crit) + 1;
      addLog(`${fighter.fighterName}'s crit has increased by 1`);
      break;
    default:
      break;
  }
  
  // return the fighter back
  return fighter;
};

const calculatePointsLeft = (nameForm, pointField) => {
  const healthField = nameForm.querySelector('#healthField');
  const damageField = nameForm.querySelector('#damageField');
  const speedField = nameForm.querySelector('#speedField');
  const armorField = nameForm.querySelector('#armorField');
  const critField = nameForm.querySelector('#critField');
  
  let totalValue = Number(healthField.value) + 
                   Number(damageField.value) + 
                   Number(speedField.value) + 
                   Number(armorField.value) + 
                   Number(critField.value);
  
  let pointsLeft = 36 - totalValue;
  pointField.textContent = `Points Left: ${pointsLeft}`;
};

const initStatFields = (nameForm, pointField) => {
  const healthField = nameForm.querySelector('#healthField');
  const damageField = nameForm.querySelector('#damageField');
  const speedField = nameForm.querySelector('#speedField');
  const armorField = nameForm.querySelector('#armorField');
  const critField = nameForm.querySelector('#critField');
  
  const callCalculatePoints = () => calculatePointsLeft(nameForm, pointField);
  
  healthField.addEventListener('input', callCalculatePoints);
  damageField.addEventListener('input', callCalculatePoints);
  speedField.addEventListener('input', callCalculatePoints);
  armorField.addEventListener('input', callCalculatePoints);
  critField.addEventListener('input', callCalculatePoints);
};

const updateLog = () => {
  const xhr = new XMLHttpRequest();
  
  xhr.open('get', '/getLog');
  
  xhr.onload = () => {
    switch(xhr.status) {
      case 200:
        let logForm = document.querySelector('#logContent');
        
        // clear form
        logForm.innerHTML = ``;
        
        // retrieve the array of logs
        let logArray = (JSON.parse(xhr.response)).log;
        
        // log each element
        for(let i = 0; i < logArray.length; i++) {
          logItem(logArray[i], logForm);
        }
        
        break;
    }
  };
  xhr.send();
};

const logItem = (text, logForm) => {
  logForm.innerHTML = `<p>${text}</p>${logForm.innerHTML}`; // add the text before everything else
};

const init = () => {
  const nameForm = document.querySelector('#nameForm');
  const methodSelect = document.querySelector('#methodSelect');
  const pointField = document.querySelector('#pointField');
  
  const addFighter = (e) => sendPost(e, nameForm);
  const findFighters = (e) => getFighters(e);
  
  nameForm.addEventListener('submit', addFighter);
  
  initStatFields(nameForm, pointField);

  // set up the fight buttons
  const fightButton = document.querySelector('#fightButton');
  const deathMatchButton = document.querySelector('#deathMatchButton');
  const startFight = () => fight(false); // (is death active) = false
  const startDeathMatch = () => fight(true); // (is death active) = true

  fightButton.addEventListener('click', startFight);
  deathMatchButton.addEventListener('click', startDeathMatch);
  
  // set the initial fighter
  getFighters();
  
  // set the page to reload fighters every 2 seconds
  window.setInterval(function(){
    getFighters();
  }, 2000);
};
window.onload = init;
