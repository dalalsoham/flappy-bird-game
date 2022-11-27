class Network {
    constructor(weights = [randomMat(2, 3), randomMat(3, 1)], biases = [random(-1, 1), random(-1, 1)]) {
      this.weights = [];
      weights.forEach((weight) => {
        this.weights.push(nj.array(weight));
      })
      this.biases = biases;
    }
  
    feed(input) {
      var pre_h = nj.add(nj.dot(nj.array(input), this.weights[0]), nj.array([this.biases[0], this.biases[0], this.biases[0]]));
      var h = nj.sigmoid(pre_h);
  
      var pre_o = nj.add(nj.dot(nj.array(h), this.weights[1]), nj.array([this.biases[1]]));
      var o = nj.sigmoid(pre_o);
  
      return o;
    }
  }
  
  function randomMat(height, width) {
    var mat = [];
    for (var i = 0; i < height; i++) {
      mat[i] = [];
      for (var j = 0; j < width; j++) {
        mat[i][j] = random(-1, 1);
      }
    }
  
    return mat;
  }
  
  function mutate(network, chance, amount) {
    var new_weights = [];
    network.weights.forEach((weights) => {
      var weight_array = weights.tolist();
      var new_weight_array = [];
      weight_array.forEach((row) => {
        new_row = [];
        row.forEach((value) => {
          if (random(0, 1) < chance) {
            new_row.push(min(max(value + random(-amount, amount), -1), 1));
          } else {
            new_row.push(value);
          }
        });
        new_weight_array.push(new_row);
      });
      new_weights.push(new_weight_array);
    });
    
    var new_biases = [];
    network.biases.forEach((bias) => {
      if (random(0, 1) < chance) {
        new_biases.push(random(-1, 1));
      
      } else {
        new_biases.push(bias);
      }
    });
  
    return new Network(new_weights, new_biases);
  }