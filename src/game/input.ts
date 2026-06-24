import { GameInput } from './types';

export function createInputHandler(canvas: HTMLCanvasElement) {
  const state: GameInput = { up: false, down: false, left: false, right: false, shoot: false, reload: false, mouseX: 0, mouseY: 0 };

  const keyMap: Record<string, keyof GameInput> = {
    KeyW: 'up', ArrowUp: 'up',
    KeyS: 'down', ArrowDown: 'down',
    KeyA: 'left', ArrowLeft: 'left',
    KeyD: 'right', ArrowRight: 'right',
    KeyR: 'reload',
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const key = keyMap[e.code];
    if (key) (state[key] as boolean) = true;
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const key = keyMap[e.code];
    if (key) (state[key] as boolean) = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    state.mouseX = e.clientX - rect.left;
    state.mouseY = e.clientY - rect.top;
  };

  const onMouseDown = () => { state.shoot = true; };
  const onMouseUp = () => { state.shoot = false; };

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    state.mouseX = touch.clientX - rect.left;
    state.mouseY = touch.clientY - rect.top;
    state.shoot = true;
  };

  const onTouchMove = (e: TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    state.mouseX = touch.clientX - rect.left;
    state.mouseY = touch.clientY - rect.top;
  };

  const onTouchEnd = () => { state.shoot = false; };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);

  const destroy = () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);
  };

  return { state, destroy };
}
