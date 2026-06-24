export interface Input {
  up: boolean; down: boolean; left: boolean; right: boolean;
  shoot: boolean; reload: boolean;
  mouseX: number; mouseY: number;
}

export function createInput(canvas: HTMLCanvasElement) {
  const state: Input = { up: false, down: false, left: false, right: false, shoot: false, reload: false, mouseX: 0, mouseY: 0 };
  let touchJoystickId: number | null = null;
  let touchJoystickStart = { x: 0, y: 0 };

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

  // Touch: left half = move joystick, right half = shoot (aim at touch point)
  const touchStart = (e: TouchEvent) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (tx < canvas.width / 2) {
        touchJoystickId = t.identifier;
        touchJoystickStart = { x: tx, y: ty };
      } else {
        state.shoot = true;
        state.mouseX = tx;
        state.mouseY = ty;
      }
    }
  };

  const touchMove = (e: TouchEvent) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (t.identifier === touchJoystickId) {
        const dx = tx - touchJoystickStart.x;
        const dy = ty - touchJoystickStart.y;
        const deadzone = 10;
        state.left = dx < -deadzone;
        state.right = dx > deadzone;
        state.up = dy < -deadzone;
        state.down = dy > deadzone;
      } else {
        state.mouseX = tx;
        state.mouseY = ty;
      }
    }
  };

  const touchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchJoystickId) {
        touchJoystickId = null;
        state.up = false; state.down = false; state.left = false; state.right = false;
      } else {
        state.shoot = false;
      }
    }
  };

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('touchstart', touchStart, { passive: false });
  canvas.addEventListener('touchmove', touchMove, { passive: false });
  canvas.addEventListener('touchend', touchEnd);

  return {
    state,
    destroy: () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mouseup', mouseUp);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', touchEnd);
    },
  };
}
