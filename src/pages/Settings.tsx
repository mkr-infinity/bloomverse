import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportAllData, importAllData, resetAllData } from '../utils/db';
import { CONTROL_ACTIONS, ControlAction, formatBinding, formatKey, getControlBindings, resetControlBindings, saveControlBindings, setPrimaryBinding } from '../game/controls';
import { getAudioSettings, saveAudioSettings } from '../game/audio';
import styles from './Settings.module.css';

export default function Settings() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [bindings, setBindings] = useState(getControlBindings);
  const [listeningFor, setListeningFor] = useState<ControlAction | null>(null);

  const [settings, setSettings] = useState(() => ({
    ...getAudioSettings(),
    particles: true,
    screenShake: true,
    showFPS: false,
    difficulty: 'normal' as 'easy' | 'normal' | 'hard',
  }));

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloomverse-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Save exported successfully.');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importAllData(text);
      setMsg('Save imported successfully. Restart to apply.');
    } catch {
      setMsg('Invalid save file.');
    }
  };

  const handleReset = async () => {
    if (confirm('This will delete ALL game data. Are you sure?')) {
      await resetAllData();
      setMsg('Game data reset.');
    }
  };

  const captureBinding = (action: ControlAction) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!listeningFor) return;
    e.preventDefault();
    const next = setPrimaryBinding(bindings, action, e.code);
    setBindings(next);
    saveControlBindings(next);
    setListeningFor(null);
    setMsg(`${CONTROL_ACTIONS.find((a) => a.action === action)?.label} set to ${formatKey(e.code)}.`);
  };

  const resetBindings = () => {
    const next = resetControlBindings();
    setBindings(next);
    setListeningFor(null);
    setMsg('Controls reset to default.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>SETTINGS</h1>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>AUDIO</h2>
          <div className={styles.option}>
            <label>SFX Volume</label>
            <input type="range" min="0" max="100" value={settings.sfxVolume}
              onChange={(e) => {
                const next = { ...settings, sfxVolume: +e.target.value };
                setSettings(next);
                saveAudioSettings({ sfxVolume: next.sfxVolume, musicVolume: next.musicVolume });
              }} />
            <span>{settings.sfxVolume}%</span>
          </div>
          <div className={styles.option}>
            <label>Music Volume</label>
            <input type="range" min="0" max="100" value={settings.musicVolume}
              onChange={(e) => {
                const next = { ...settings, musicVolume: +e.target.value };
                setSettings(next);
                saveAudioSettings({ sfxVolume: next.sfxVolume, musicVolume: next.musicVolume });
              }} />
            <span>{settings.musicVolume}%</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>GRAPHICS</h2>
          <div className={styles.option}>
            <label>Particles</label>
            <button className={`${styles.toggle} ${settings.particles ? styles.on : ''}`}
              onClick={() => setSettings({ ...settings, particles: !settings.particles })}>
              {settings.particles ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className={styles.option}>
            <label>Screen Shake</label>
            <button className={`${styles.toggle} ${settings.screenShake ? styles.on : ''}`}
              onClick={() => setSettings({ ...settings, screenShake: !settings.screenShake })}>
              {settings.screenShake ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className={styles.option}>
            <label>Show FPS</label>
            <button className={`${styles.toggle} ${settings.showFPS ? styles.on : ''}`}
              onClick={() => setSettings({ ...settings, showFPS: !settings.showFPS })}>
              {settings.showFPS ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>GAMEPLAY</h2>
          <div className={styles.option}>
            <label>Difficulty</label>
            <div className={styles.diffBtns}>
              {(['easy', 'normal', 'hard'] as const).map((d) => (
                <button key={d} className={`${styles.diffBtn} ${settings.difficulty === d ? styles.active : ''}`}
                  onClick={() => setSettings({ ...settings, difficulty: d })}>
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>DATA MANAGEMENT</h2>
          <div className={styles.dataButtons}>
            <button className={styles.dataBtn} onClick={handleExport}>EXPORT SAVE</button>
            <button className={styles.dataBtn} onClick={() => fileRef.current?.click()}>IMPORT SAVE</button>
            <button className={`${styles.dataBtn} ${styles.dangerBtn}`} onClick={handleReset}>RESET ALL DATA</button>
          </div>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          {msg && <p className={styles.msg}>{msg}</p>}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>CONTROLS</h2>
          <p className={styles.controlHelp}>Click a binding, then press the desktop key you want. Mouse aim and left-click shooting always remain enabled.</p>
          <div className={styles.controls}>
            {CONTROL_ACTIONS.map(({ action, label, hint }) => (
              <div className={styles.control} key={action}>
                <div>
                  <span>{label}</span>
                  <small>{hint}</small>
                </div>
                <button
                  className={`${styles.keyBind} ${listeningFor === action ? styles.listening : ''}`}
                  onClick={() => setListeningFor(action)}
                  onKeyDown={captureBinding(action)}
                >
                  {listeningFor === action ? 'PRESS KEY...' : formatBinding(bindings[action])}
                </button>
              </div>
            ))}
          </div>
          <button className={styles.resetControls} onClick={resetBindings}>RESET DEFAULT CONTROLS</button>
        </section>
      </div>
    </div>
  );
}
