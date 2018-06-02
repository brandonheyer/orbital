import * as d3 from 'd3';
import Vector from '../engine/Vector';
import BaseEntity from '../engine/BaseEntity';

const SCALE = d3.scaleLog();
SCALE.domain([1, 10000000]);

export default class PlanetEntity extends BaseEntity {
  constructor(options) {
    super(options);

    options = options || {};

    this.heading = new Vector(
      options.headingX || 0,
      options.headingY || 0
    );

    this.engine = options.engine;
    this.entities = this.engine.entities;
    this.mass = options.mass;
    this.density = options.density || .01;
    this.radius = Math.sqrt(this.mass / (this.density * Math.PI)) * 10;
    this.baseRadius = this.radius;
    this.tempVector = new Vector(0,0);
    this.forceVector = new Vector(0,0);
    this.collideVector = new Vector(0,0);
    this.deltaScaled = 0;
    this.rotationSpeed = (Math.random() / 2) + .2;
  }

  calculate(delta) {
    var other;
    var magnitude;
    var force;
    var angle;
    var magnitudeSq;

    if (this.dying) {
      return;
    }

    this.forceVector.x = 0;
    this.forceVector.y = 0;

    this.collideVector.x = 0;
    this.collideVector.y = 0;

    for (var i = 0; i < this.entities.length; i++) {
      if (!this.dying && !this.dead && this.entities[i] !== this) {
        if (!this.entities[i].dying && !this.entities[i].dead) {
          other = this.entities[i];
          this.tempVector = other.pos.minus(this.pos);

          magnitudeSq = this.tempVector.magnitudeSq();

          if ((magnitudeSq < 50000) && Math.sqrt(magnitudeSq) <= this.radius + other.radius) {
            if (this.mass >= other.mass) {
              const m1 = this.mass;
              const m2 = other.mass;
              const v1 = this.heading.magnitude();
              const v2 = other.heading.magnitude();

              this.heading.x = ((this.heading.x * m1) + (other.heading.x * m2)) / (m1 + m2);
              this.heading.y = ((this.heading.y * m1) + (other.heading.y * m2)) / (m1 + m2);

              this.mass += other.mass;
              this.renderDensity();

              other.dying = true;
              other.dyingFade = 1;
            }
          } else if (other.isSun || magnitudeSq < 50000000) {
            force = this.engine.GEE * this.mass * other.mass / magnitudeSq;

            angle = this.tempVector.angle();
            this.forceVector.x += Math.cos(angle) * force;
            this.forceVector.y += Math.sin(angle) * force;
          }
        }
      }
    }
  }

  renderDensity() {
    this.element.fill = d3.interpolateViridis(SCALE(this.density));
    this.radius = Math.sqrt(this.mass / (this.density * Math.PI)) * 10;
    this.element.scale = this.radius / this.baseRadius;
  }

  update(delta) {
    this.deltaScaled = delta / 1000;

    if (this.dead) {
      this.engine.removeEntity(this);
    } else if (this.dying) {
      this.dyingFade -= this.deltaScaled;

      if (this.dyingFade <= 0) {
        this.engine.removeEntity(this);
      } else {
        this.element.fill = 'rgba(100, 15, 0, ' + this.dyingFade + ')';
        this.element.radius += this.deltaScaled * 2;
      }
    } else {
      if (this.density < 10000000 / 4 && this.mass / this.density > 250) {
        this.density += this.density * .001 / this.deltaScaled;
      } else if (this.mass / this.density > 1000) {
        this.density += this.density * .0005 / this.deltaScaled;
      } else if (this.mass / this.density < 50) {
        this.density -= this.density * .00125 / this.deltaScaled;
      }

      this.renderDensity();

      this.heading.x += this.forceVector.x / this.mass * delta;
      this.heading.y += this.forceVector.y / this.mass * delta;

      this.pos.scalePlusEquals(delta, this.heading);
      this.element.translation.set(
        this.xScale(this.pos.x),
        this.yScale(this.pos.y)
      );

      this.element.rotation = this.element.rotation + (this.rotationSpeed / delta);
    }
  }

  render(canvas) {
    if (canvas) {
      this.canvas = canvas;
    }

    if (this.element) {
      this.element.vertices.forEach((v,i) => {
        v.set(
          this.scale(v._origX),
          this.scale(v._origY)
        );
      });
    } else {
      this.points = [];
      const totalPoints = 16;
      const radianPerPoint = (2 * Math.PI) / totalPoints;
      let rotation = 0;

      for (let i = 0; i < totalPoints; i++) {
        const distance = this.radius - (Math.random() * this.radius / 4);
        rotation += Math.random() * ((radianPerPoint / 2) - (radianPerPoint / 4)) + (radianPerPoint / 4);

        this.points.push(
          Math.cos(rotation) * distance,
          Math.sin(rotation) * distance
        );

        this.scaledPoints = this.points.map((v) => this.scale(v));

        rotation = (i + 1) * radianPerPoint;
      }

      this.element = canvas.makePath.apply(canvas, this.scaledPoints);
      this.element.vertices.forEach((v, i) =>  {
        v._origX = this.points[i * 2];
        v._origY = this.points[(i * 2) + 1];
      });

      this.element.translation.set(
        this.xScale(this.pos.x),
        this.yScale(this.pos.y)
      );

      this.element.curved = true;
      this.element.noStroke();
    }

    this.element.fill = d3.interpolatePlasma(SCALE(this.density));
  }

  destroy() {
    this.canvas.remove(this.element);
  }
}
