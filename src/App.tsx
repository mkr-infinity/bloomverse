import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition';

const MainMenu = lazy(() => import('./pages/MainMenu'));
const CharacterSelect = lazy(() => import('./pages/CharacterSelect'));
const LevelMap = lazy(() => import('./pages/LevelMap'));
const Game = lazy(() => import('./pages/Game'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const Support = lazy(() => import('./pages/Support'));
const Archive = lazy(() => import('./pages/Archive'));
const Armory = lazy(() => import('./pages/Armory'));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageTransition />}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/character" element={<CharacterSelect />} />
          <Route path="/levels" element={<LevelMap />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/armory" element={<Armory />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
