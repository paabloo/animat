import Victor from 'victor';

export const GAME_FIELD_WIDTH = 600;

export const GAME_FIELD_HEIGHT = 600;

export const FRAMES_PER_SECOND = 60;

export const MILISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND;

export const DEFAULT_BALL_SPEED = 600;

export const DEFAULT_FRICTION = .99; // .9

export const DEFAULT_GRAVITY = 0; // 9.81

export const BALL_RADIUS = 10;

const settings = {
  framesPerSecond: FRAMES_PER_SECOND,
  milisecondsPerFrame: MILISECONDS_PER_FRAME,
  friction: DEFAULT_FRICTION,
  gravity: DEFAULT_GRAVITY * 100,
  gravityVector: new Victor(0, -DEFAULT_GRAVITY),
  gameField: {
    width: GAME_FIELD_WIDTH,
    height: GAME_FIELD_HEIGHT,
  },
  ball: {
    radius: BALL_RADIUS,
    speed: DEFAULT_BALL_SPEED,
  },
};

export default settings;
