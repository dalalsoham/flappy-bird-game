const best_select = 2;
const rand_select = 0;
const spawn_select = 25;
const character_offspring = 75;
const initial_characters = (best_select + rand_select) * character_offspring + spawn_select;

const character_height = 30;
const pipe_spacing = 450;

let pipes = [];
let tick = 0;
let characters = [];
let backup = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(185, 222, 241);

  if (characters.length === 0) {
    newGeneration();
  }

  drawPipes();
  drawCharacters();

  if (!paused) {
    movePipes();
    addPipes();
    moveCharacters();
    tick++;
  }
}

function addPipes() {
  function newPipe(x_pos = width) {
    pipes.push({ x: x_pos, y: height / 2 + random(-height * 1 / 4, height * 1 / 4), gap: pipe_gap - (tick + 500) / 30 });
  }

  if (tick === 0) {
    new_pipes_x = [];
    for (var i = width; i > pipe_spacing; i -= pipe_spacing) {
      new_pipes_x.push(i);
    }

    new_pipes_x.reverse().forEach((new_pipe_x) => {
      newPipe(new_pipe_x);
    });
  } else if (pipes[pipes.length - 1].x <= width - pipe_spacing) {
    newPipe();
  }
}

function drawPipes() {
  pipes.forEach((pipe) => {
    stroke(19, 156, 19);
    strokeWeight(10);
    strokeCap(SQUARE);
    line(pipe.x, 0, pipe.x, pipe.y - pipe.gap / 2 - character_height);
    line(pipe.x, height, pipe.x, pipe.y + pipe.gap / 2 + character_height);
  });
}

function movePipes() {
  var new_pipes = [];
  pipes.forEach((pipe) => {
    pipe.x -= (tick + 500) / 200;
    if (!(pipe.x < -10)) {
      new_pipes.push(pipe)
    }
  });
  pipes = new_pipes;

  var new_characters = [];
  var one_lost = false;
  characters.forEach((character) => {
    if (character.y >= height || character.y <= 0) {
      character.lost = true;
      character.death = tick;
      backup.push(character);
    } else {
      pipes.forEach((pipe) => {
        if (abs(character.x - pipe.x) <= 50 && !(pipe.y - pipe.gap < character.y && character.y < pipe.y + pipe.gap)) {
          character.lost = true;
          character.death = tick;
          backup.push(character);
        }
      });
    }

    if (!character.lost) {
      new_characters.push(character);
    } else {
      one_lost = true;
    }
  });

  if (one_lost) {
    document.querySelector("#thump-audio").play();
  }

  characters = new_characters;
}

function drawCharacters() {
  stroke(0, 0, 0);
  strokeWeight(2);
  characters.forEach((character) => {
    fill(224, 218, 22);
    ellipse(character.x, character.y, character_height);
  });
}

function moveCharacters() {
  for (var i = 0; i < characters.length; i++) {
    character = characters[i];
    character.vel -= 0.35 * (tick + 500) / 500;
    character.y -= character.vel;

    var x_dist = null;
    var closest_pipe = null;
    pipes.forEach((pipe) => {
      if (x_dist === null) {
        x_dist = pipe.x - character.x;
        closest_pipe = pipe;
        if (x_dist < 0) {
          x_dist = null;
        }
      }
    });

    var y_dist = character.y - closest_pipe.y;

    if (character.network.feed([min(x_dist / pipe_spacing, 1), nj.tanh(y_dist / height).tolist()[0]]).tolist()[0] >= 0.5) {
      jump(i);
    }
  }
}

function jump(char_i) {
  characters[char_i].vel = 8 + (tick + 500) / 500;
  characters[char_i].last_jump = tick;
}

function newGeneration() {
  if (generation > 0) {
    gen_scores.push({ x: generation, y: floor(tick * score_rate) });
  }

  generation++;

  if (generation === 1) {
    for (var i = 0; i < initial_characters; i++) {
      characters.push({ x: width / 8, y: height / 3, vel: 0, lost: false, network: new Network(), last_jump: 0, death: null });
    }
  } else {
    var selected = [];
    var sorted = backup.sort(compareHealth);

    selected = selected.concat(sorted.slice(-best_select));
    for (var i = 0; i < rand_select; i++) {
      selected.push(backup[floor(random(0, backup.length))]);
    }

    selected.forEach((selected_character) => {
      for (var i = 0; i < character_offspring; i++) {
        characters.push({ x: width / 8, y: height / 3, vel: 0, lost: false, network: mutate(selected_character.network, mutation_chance, mutation_amount), last_jump: 0, death: null });
      }
    });

    for (var i = 0; i < spawn_select; i++) {
      characters.push({ x: width / 8, y: height / 3, vel: 0, lost: false, network: new Network(), last_jump: 0, death: null });
    }
  }

  backup = [];
  pipes = [];
  tick = 0;
}

function compareHealth(a, b) {
  if (a.death < b.death) {
    return -1;
  }
  if (a.death > b.death) {
    return 1;
  }
  return 0;
}