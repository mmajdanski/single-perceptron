const CANVAS_SIZE = 600;
const NUM_DATA_POINTS = 150;

export const genData = () => {
  let dataPoints = [];
  for (let x = 0; x < NUM_DATA_POINTS; x++) {
    dataPoints[x] = {
      x: Math.random() * CANVAS_SIZE,
      y: Math.random() * CANVAS_SIZE,
      bias: 1
    };
  }

  return dataPoints;
};

export const labelData = dataPoints => {
  let labeledData = dataPoints.map(data => {
    return data.x > data.y ? { ...data, label: 1 } : { ...data, label: -1 };
  });

  return labeledData;
};

export const weightData = dataPoints => {
  let weightedData = dataPoints.map(data => {
    return {
      ...data,
      weight: Math.random() * 2 - 1,
      bias_weight: Math.random() * 2 - 1
    };
  });

  return weightedData;
};

export const guessData = dataPoints => {
  let guessData = dataPoints.map(data => {
    let weightedSum =
      data.x * data.weight +
      data.y * data.weight +
      data.bias_weight * data.bias;
    return { ...data, guess: Math.sign(weightedSum) };
  });

  return guessData;
};

export const trainedData = (dataPoints, learningRate) => {
  let trainData = dataPoints.map(data => {
    let error = data.label - data.guess;
    let newWeight = 0;
    let deltaWeight = 0;
    let newBiasWeight = 0;
    if (error !== 0) {
      newWeight = data.weight + error * data.x * data.y * learningRate;
      newBiasWeight = data.bias_weight + data.bias * error * learningRate;
      deltaWeight = newWeight - data.weight;
    } else {
      newWeight = data.weight;
      newBiasWeight = data.bias_weight;
      deltaWeight = 0;
    }
    return {
      ...data,
      weight: newWeight,
      deltaWeight: deltaWeight,
      bias_weight: newBiasWeight
    };
  });

  return trainData;
};

export const meanSquareError = dataPoints => {
  let meanSquareError = 0;
  dataPoints.map(data => {
    let error = data.label - data.guess;
    return (meanSquareError += Math.pow(error, 2));
  });

  return meanSquareError;
};
