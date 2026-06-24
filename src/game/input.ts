export interface Input {
  up: boolean; down: boolean; left: boolean; right: boolean;
  shoot: boolean; reload: boolean;
  mouseX: number; mouseY: number;
}

export function createInput(canvas: HTMLCanvasElement) {
  const state: Input = { up: false, down: false, left: false, right: false, shoot: false, reload: false, mouseX: 0, mouseY: 0 };

  const keyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') state.up = true;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') state.down = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') state.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') state.right = true;
    if (e.code === 'KeyR') state.reload = true;
  };
  const keyUp = (e: KeyboardEvent) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') state.up = false;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') state.down = false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') state.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') state.right = false;
    if (e.code === 'KeyR') state.reload = false;
  };
  const mouseMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); state.mouseX = e.clientX - r.left; state.mouseY = e.clientY - r.top; };
  const mouseDown = () => { state.shoot = true; };
  const mouseUp = () => { state.shoot = false; };

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);

  return {
    state,
    destroy: () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mouseup', mouseUp);
    },
  };
}
