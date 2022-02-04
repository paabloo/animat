import Victor from 'victor';

export const FRAMES_PER_SECOND = 60;

export const MILISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND;

export const DEFAULT_BALL_SPEED = 310;

export const DEFAULT_FRICTION = 0;

export const DEFAULT_GRAVITY = 0;

export const BALL_RADIUS = 10;

const settings = {
  framesPerSecond: FRAMES_PER_SECOND,
  milisecondsPerFrame: MILISECONDS_PER_FRAME,
  friction: DEFAULT_FRICTION,
  gravityVector: new Victor(0, -DEFAULT_GRAVITY),
  ball: {
    radius: BALL_RADIUS,
    speed: DEFAULT_BALL_SPEED,
  },
};

export default settings;
