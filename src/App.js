import React, { Component } from "react";
import "./App.css";

import * as ml from "./ml.js";

const CANVAS_SIZE = 600;
/*Below are some config options to play around with */
const CIRCLE_SIZE = 5;
const LEARNING_RATE = 0.00001;
const ITERATIONS = 30;
const TIMEOUT_BETWEEN_ITERATIONS = 1000;

class App extends Component {
  constructor() {
    super();
    this.state = {
      labeledData: [],
      guessData: [],
      iteration: 0,
      mse: 0
    };
  }

  drawKnownData = data => {
    return data.map((data, index) => {
      if (data.label === 1) {
        return (
          <circle
            key={index}
            cx={data.x}
            cy={data.y}
            r={CIRCLE_SIZE}
            fill="blue"
          />
        );
      } else {
        return (
          <circle
            key={index}
            cx={data.x}
            cy={data.y}
            r={CIRCLE_SIZE}
            fill="red"
          />
        );
      }
    });
  };

  drawGuessData = data => {
    return data.map((data, index) => {
      if (data.guess === 1) {
        return (
          <circle
            key={index}
            cx={data.x}
            cy={data.y}
            r={CIRCLE_SIZE}
            fill="blue"
          />
        );
      } else {
        return (
          <circle
            key={index}
            cx={data.x}
            cy={data.y}
            r={CIRCLE_SIZE}
            fill="red"
          />
        );
      }
    });
  };

  startTraining = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        let trainedData = ml.trainedData(this.state.guessData, LEARNING_RATE); //Params are Data, Learning Rate
        let newTrainedData = ml.guessData(trainedData);
        this.setState({ guessData: newTrainedData });
        let meanSquaredError = ml.meanSquareError(this.state.guessData);
        this.setState({ mse: meanSquaredError });
        resolve();
      }, TIMEOUT_BETWEEN_ITERATIONS);
    });
  };

  componentDidMount = () => {
    //We start off by creating a dataset with Labels we "know" are correct
    let genData = ml.genData();
    let labeledData = ml.labelData(genData);
    this.setState({ labeledData: labeledData }); //This is our graph/chart on the left
    //Below is the same Data but the Machine Guessing Weights for the Data
    let weightedData = ml.weightData(labeledData);
    //The machine now has random weights and will "Guess" the label of the data
    let guessData = ml.guessData(weightedData);
    this.setState({ guessData: guessData });
    //Below Timeout is just so we could see the Data for 5 Seconds prior to any training happening
    setTimeout(async () => {
      for (let x = 0; x < ITERATIONS; x++) {
        this.setState({ iteration: x + 1 });
        await this.startTraining(this.state.guessData);
      }
    }, 5000);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <svg
            className="container-item"
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
          >
            <rect
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              fill="green"
              fillOpacity="0.1"
            />
            {this.drawKnownData(this.state.labeledData)}
            <line
              x1="0"
              x2={CANVAS_SIZE}
              y1="0"
              y2={CANVAS_SIZE}
              stroke="green"
            />
          </svg>

          <svg
            className="container-item"
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
          >
            <rect
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              fill="yellow"
              fillOpacity="0.1"
            />
            {this.drawGuessData(this.state.guessData)}
            <line
              x1="0"
              x2={CANVAS_SIZE}
              y1="0"
              y2={CANVAS_SIZE}
              stroke="green"
            />
          </svg>
          <div>
            <p>
              The left SVG shows our trained data set. The right SVG shows our
              data set being trained.
            </p>
            <p>
              Perceptron Training Iteration: <b>{this.state.iteration}</b>
            </p>
            <p>
              Maximum Iterations capped at <b>{ITERATIONS}</b>. Learning Rate is{" "}
              <b>{LEARNING_RATE}</b>. Timeout between Iterations:{" "}
              <b>{TIMEOUT_BETWEEN_ITERATIONS}ms</b>
            </p>
            <p>
              Mean Squared Error: <b>{this.state.mse}</b>
            </p>
            <p>
              Refresh the page to generate new points and re-test the Perceptron
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
