import { getControlBindings, isActionKey } from './controls';

export interface Input {
  up: boolean; down: boolean; left: boolean; right: boolean;
  shoot: boolean; reload: boolean; ability: boolean;
  mouseX: number; mouseY: number;
}

export function createInput(canvas: HTMLCanvasElement) {
  const state: Input = { up: false, down: false, left: false, right: false, shoot: false, reload: false, ability: false, mouseX: canvas.width / 2, mouseY: canvas.height / 2 - 120 };
  const bindings = getControlBindings();
  let touchJoystickId: number | null = null;
  let touchJoystickStart = { x: 0, y: 0 };

  const keyDown = (e: KeyboardEvent) => {
    if (isActionKey(bindings, 'up', e.code)) state.up = true;
    if (isActionKey(bindings, 'down', e.code)) state.down = true;
    if (isActionKey(bindings, 'left', e.code)) state.left = true;
    if (isActionKey(bindings, 'right', e.code)) state.right = true;
    if (isActionKey(bindings, 'reload', e.code)) state.reload = true;
    if (isActionKey(bindings, 'ability', e.code)) { state.ability = true; e.preventDefault(); }
    if (isActionKey(bindings, 'shoot', e.code)) { state.shoot = true; e.preventDefault(); }
  };
  const keyUp = (e: KeyboardEvent) => {
    if (isActionKey(bindings, 'up', e.code)) state.up = false;
    if (isActionKey(bindings, 'down', e.code)) state.down = false;
    if (isActionKey(bindings, 'left', e.code)) state.left = false;
    if (isActionKey(bindings, 'right', e.code)) state.right = false;
    if (isActionKey(bindings, 'reload', e.code)) state.reload = false;
    if (isActionKey(bindings, 'ability', e.code)) state.ability = false;
    if (isActionKey(bindings, 'shoot', e.code)) state.shoot = false;
  };
  const mouseMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); state.mouseX = e.clientX - r.left; state.mouseY = e.clientY - r.top; };
  const mouseDown = (e: MouseEvent) => {
    if (e.button === 0) { state.shoot = true; e.preventDefault(); }
    if (e.button === 2) { state.reload = true; e.preventDefault(); }
  };
  const mouseUp = (e: MouseEvent) => {
    if (e.button === 0) state.shoot = false;
    if (e.button === 2) state.reload = false;
  };
  const mouseLeave = () => { /* don't stop shoot on leave — too punishing */ };
  const contextMenu = (e: Event) => e.preventDefault();

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
  window.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mouseleave', mouseLeave);
  canvas.addEventListener('contextmenu', contextMenu);
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
      window.removeEventListener('mouseup', mouseUp);
      canvas.removeEventListener('mouseleave', mouseLeave);
      canvas.removeEventListener('contextmenu', contextMenu);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', touchEnd);
    },
  };
}
