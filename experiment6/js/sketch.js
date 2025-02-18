// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

const fillers = {
  /*
  adventurer: ["My dude", "Bro", "WesBot", "Adventurer", "Traveller", "Fellow", "Citizen", "Ashen One", "Dragonborn", "Cool person", "Tarnished", "勇者", "$adventurer and $adventurer", "$adventurer, $adventurer, and $adventurer", "Geoff"],
  pre: ["Fra", "Tro", "Gre", "Pan", "Ast", "Ara"],
  post: ["gria", "ston", "gott","-on-the-lee", "ora", "Ara", "uwu"],
  people: ["kindly", "meek", "brave", "wise", "sacred", "cherished", "honored", "forgotten", "apathetic", "mystic", "orca", "帥氣"],
  item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
  num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
  looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
  loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
  baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
  message: ["call", "txt", "post", "decree", "shoutz", "tweets", "choiche", "hearkens", "harkening", "harkenening", "harkenenening", "...wait, no! Come back", "Watermelon"],
  */
  gamer: ["Gamer", "Dude", "broski", "Burger", "Gabagool", "Silver", "My guy", "Champ"],
  site: ["A", "B"],
  econ: ["eco", "full buy", "force pistols", "zeco", "Hero buy"],
  strat: ["rush no stop", "slow default", "default", "walk out", "run boost", "let them dump utility"],
  legend: ["Olofmeister", "Shroud", "Aleksib", "S1mple", "donk", "ZywOo", "ropz", "NiKo", "XANTARES", "device", "coldzera", "kennyS", "Twistzz", "Stewie2K", "EliGE", "FalleN", "GeT_RiGhT", "tarik"],
  item: ["Ak", "M4", "Deagle", "Smoke", "p250", "zeus", "flashbang", "Mac10"],
  win: ["dub", "win", "victory", "cheese", "epic no.1 victory", "bread", "game over with", "round", "dubskii", "pogchamp"],
  motto: ["pull through", "focus up", "lock in", "drink the gatorade", "steamroll", "poop on the other team", "start poopin", "clutch up"],
  match: ["gone too long", "been so easy", "us sweating", "beaten us", "run its course", "brought about the best in us", "me shaking", "us dialed in", "me thinking we're playing $legend"],
  
};


/*

const template = `$adventurer, heed my $message!

I have just come from $pre$post where the $people folk are in desperate need. Their town has been overrun by $baddies. You must venture forth at once, taking my $item, and help them.

It is told that the one who can rescue them will be awarded with $num $looty $loots. Surely this must tempt one such as yourself!
`;
*/

const template = `$gamer, it's time to get this $win!

Here's the strat that will win us this CS game, all you need to do is channel your inner $legend. We're going to try to $strat out $site and then end on $site.
I can drop you a $item before the round starts. This game has $match yet, I know we're going to $motto and get this $win. $gamer are you with me? 
`;

// STUDENTS: You don't need to edit code below this line.

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