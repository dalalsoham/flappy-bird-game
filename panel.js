const score_rate = 0.1;

let generation = 0;
let paused = false;
let mutation_chance = 0.1;
let mutation_amount = 0.1;
let gen_scores = [];
let pipe_gap = 150;

function initialize() {
  document.querySelector('#paused').checked = paused;
  document.querySelector('#mutation-chance').value = mutation_chance;
  document.querySelector('#mutation-amount').value = mutation_amount;
  document.querySelector('#pipe-gap').value = pipe_gap;

  score_graph = new Chart(document.querySelector('#score-graph'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Score',
        data: []
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function updatePanel() {
  document.querySelector('#generation').textContent = `Generation: ${generation}`;
  document.querySelector('#pipes-passed').textContent = `Score: ${floor(tick*score_rate)}`;
  document.querySelector('#survivors').textContent = `Survivors: ${characters.length}`;

  paused = document.querySelector('#paused').checked;
  mutation_chance = document.querySelector('#mutation-chance').value;
  mutation_amount = document.querySelector('#mutation-amount').value;
  pipe_gap = document.querySelector('#pipe-gap').value;
  
  score_graph.data.datasets[0].data = gen_scores;
  score_graph.update();
}

initialize();
setInterval(updatePanel, 100);