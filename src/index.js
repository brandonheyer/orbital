import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Point from './engine/Point';
import SunEntity from './game-engine/SunEntity';
import UniverseEngine from './game-engine/UniverseEngine';

import UI from './components/UI';

import "./index.css";

const height = 800;
const width = 1400;

const engine = new UniverseEngine(
  '.canvas',
  width, height,
  (width * 8000) / height, 8000,
  {
    trackFPS: true,
    displayFPS: $('.fps')
  }
);

function addSun(engine) {
  const entity = new SunEntity({
    mass: 2500000000,
    startingPosition: new Point(engine.xScale.domain()[1] / 2, engine.yScale.domain()[1] / 2),
    density: 10000000,
    engine: engine
  });

  engine.addEntity(entity);
}

addSun(engine);

engine.start();
// ========================================

ReactDOM.render(
  React.createElement(UI, { engine: engine }),
  document.getElementById('root')
);
