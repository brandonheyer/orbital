import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _debounce from 'lodash.debounce';

import Point from './engine/Point';
import SunEntity from './game-engine/SunEntity';
import PortalEntity from './game-engine/PortalEntity';
import UniverseEngine from './game-engine/UniverseEngine';

import UI from './components/UI';

import "./index.css";

const height = window.innerHeight;
const width = window.innerWidth;

const engine = new UniverseEngine(
  '.canvas',
  width, height,
  (width * 8000) / height, 8000,
  {
    trackFPS: true,
    displayFPS: $('.fps')
  }
);

$(window).on('resize', _debounce(() => {
  engine.xScale.range([0, window.innerWidth]);
  engine.scale.range([0, window.innerWidth]);
  engine.yScale.range([0, window.innerHeight]);
  engine.canvas.width = window.innerWidth;
  engine.canvas.height = window.innerHeight;
}, 100));

function addSun(engine) {
  const entity = new SunEntity({
    mass: 2500000000,
    startingPosition: new Point(engine.xScale.domain()[1] / 2, engine.yScale.domain()[1] / 2),
    density: 10000000,
    engine: engine
  });

  engine.addEntity(entity);
}

const portalStart = new PortalEntity({
  size: 250,
  startingPosition: new Point(engine.xScale.domain()[1] / 2, engine.yScale.domain()[1] / 4),
  engine: engine,
  rotation: Math.PI
});

const portalEnd = new PortalEntity({
  size: 250,
  startingPosition: new Point(engine.xScale.domain()[1] / 2, 3 * engine.yScale.domain()[1] / 4),
  engine: engine,
  sister: portalStart,
  rotation: Math.PI
});

const portalStart2 = new PortalEntity({
  size: 250,
  startingPosition: new Point(engine.xScale.domain()[1] / 4, engine.yScale.domain()[1] / 2),
  engine: engine,
  rotation: 27 * Math.PI / 18
});

const portalEnd2 = new PortalEntity({
  size: 250,
  startingPosition: new Point(3 * engine.xScale.domain()[1] / 4, engine.yScale.domain()[1] / 2),
  engine: engine,
  sister: portalStart,
  rotation: Math.PI / 2
});

portalStart.sister = portalEnd;
portalEnd.sister = portalStart;

portalStart2.sister = portalEnd2;
portalEnd2.sister = portalStart2;

engine.addEntity(portalStart);
engine.addEntity(portalEnd);
engine.addEntity(portalStart2);
engine.addEntity(portalEnd2);

addSun(engine);

engine.start();
// ========================================

ReactDOM.render(
  React.createElement(UI, { engine: engine }),
  document.getElementById('root')
);
