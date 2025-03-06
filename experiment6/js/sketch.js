// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

const fillers = {
  gamer: ["Gamer", "Dude", "broski", "Burger", "Gabagool", "Silver", "My guy", "Champ", "NVM","Prod"],
  site: ["A", "B"],
  econ: ["eco", "full buy", "force pistols", "zeco", "Hero buy", , "Broken Buy"],
  strat: ["rush no stop", "slow default", "default", "walk out", "run boost", "let them dump utility"],
  legend: ["Olofmeister", "Shroud", "Aleksib", "S1mple", "donk", "ZywOo", "ropz", "NiKo", "XANTARES", "device", "coldzera", "kennyS", "Twistzz", "Stewie2K", "EliGE", "FalleN", "GeT_RiGhT", "Tarik", "Donk"],
  item: ["Ak", "M4", "Deagle", "Smoke", "p250", "zeus", "flashbang", "Mac10"],
  win: ["dub", "win", "victory", "cheese", "epic no.1 victory", "bread", "game over with", "round", "dubskii", "pogchamp"],
  motto: ["pull through", "focus up", "lock in", "drink the gatorade", "steamroll", "poop on the other team", "start poopin", "clutch up"],
  match: ["gone too long", "been so easy", "us sweating", "beaten us", "run its course", "brought about the best in us", "me shaking", "us dialed in", "me thinking we're playing $legend"],
  
};



const template = `$gamer, it's time to get this $win!

Here's the strat that will win us this CS game, all you need to do is channel your inner $legend. We're going to try to $strat out $site and then end on $site.
I can drop you a $item before the round starts. This game has $match yet, I know we're going to $motto and get this $win. $gamer are you with me? 
`;


const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();