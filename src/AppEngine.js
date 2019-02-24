import React from 'react';
import $ from 'jquery';
import _debounce from 'lodash.debounce';

import SunEntity from './game-engine/SunEntity';
import UniverseEngine from './game-engine/UniverseEngine';
import Point from './engine/Point';

const AppEngine = function(width, height) {
  AppEngine.instance = AppEngine.initialize(width, height);

  return AppEngine.instance;
}

AppEngine.addSun = function() {
  const engine = AppEngine.instance;
  const entity = new SunEntity({
    mass: 2500000000,
    startingPosition: new Point(engine.xScale.domain()[1] / 2, engine.yScale.domain()[1] / 2),
    density: 10000000,
    engine
  });

  engine.addEntity(entity);
};

AppEngine.initialize = function(width, height) {
  const e = new UniverseEngine(
    '.canvas',
    width, height,
    (width * 8000) / height, 8000,
    {
      trackFPS: true,
      displayFPS: $('.fps')
    }
  );

  $(window).on('resize', _debounce(() => {
    e.xScale.range([0, window.innerWidth]);
    e.scale.range([0, window.innerWidth]);
    e.yScale.range([0, window.innerHeight]);
    e.canvas.width = window.innerWidth;
    e.canvas.height = window.innerHeight;
  }, 100));

  return e;
}

export default AppEngine;

export const EngineContext = React.createContext(
  AppEngine
);
