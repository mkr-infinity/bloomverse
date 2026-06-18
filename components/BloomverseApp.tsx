"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { FaGithub, FaInstagram, FaTelegram } from "react-icons/fa6";
import { FiGlobe, FiCoffee, FiHeart } from "react-icons/fi";
import { getFirebaseClient } from "@/firebase/client";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { getOrCreateDeviceId, storageKeys } from "@/lib/local-persistence";
import { hasAudioAssets, playBloomSound } from "@/systems/audio/audio-manager";
import type { AudioSettings, Landmark, SearchResult, TutorialState, WorldPosition } from "@/types/world";
import { WorldScene } from "@/world/WorldScene";
import { buildStaticSearchIndex, onboardingSteps, starterLandmarks, worldBirthDate } from "@/world/world-data";

const defaultAudioSettings: AudioSettings = { muted: false, volume: 0.65 };
const defaultTutorialState: TutorialState = { hasStarted: false, completed: false, currentStep: 0 };
const centralTarget: WorldPosition = { x: 0, y: 0, z: 0 };

type CitizenDraft = {
  name: string;
  avatar: string;
  about: string;
  dream: string;
  quote: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitterX: string;
  website: string;
};

type HoverHint = {
  title: string;
  body: string;
  x: number;
  y: number;
};

type HelpSection = {
  title: string;
  content: string;
};

const emptyCitizenDraft: CitizenDraft = {
  name: "",
  avatar: "seedling",
  about: "",
  dream: "",
  quote: "",
  github: "",
  linkedin: "",
  instagram: "",
  twitterX: "",
  website: ""
};

export function BloomverseApp() {
  const [cameraTarget, setCameraTarget] = useState<WorldPosition>(centralTarget);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpHiddenUntilRefresh, setHelpHiddenUntilRefresh] = useState(false);
  const [hoverHint, setHoverHint] = useState<HoverHint | null>(null);
  const [introOpen, setIntroOpen] = useState(true);
  const [citizenPanelOpen, setCitizenPanelOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [audioSettings, setAudioSettings] = useLocalStorageState(storageKeys.audioSettings, defaultAudioSettings);
  const [tutorialState, setTutorialState] = useLocalStorageState(storageKeys.tutorialState, defaultTutorialState);
  const [searchHistory, setSearchHistory] = useLocalStorageState<string[]>(storageKeys.searchHistory, []);
  const [citizenDraft, setCitizenDraft] = useLocalStorageState<CitizenDraft>(storageKeys.citizenDraft, emptyCitizenDraft);

  const firebase = getFirebaseClient();
  const activeStep = onboardingSteps[tutorialState.currentStep] ?? onboardingSteps[0];
  const onboardingActive = tutorialState.hasStarted && !tutorialState.completed;

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  useEffect(() => {
    function handleMouseMove(event: globalThis.MouseEvent) {
      setHoverHint((hint) => hint ? { ...hint, x: event.clientX, y: event.clientY } : null);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function moveCameraTo(position: WorldPosition) {
    setCameraTarget(position);
  }

  function selectLandmark(landmark: Landmark) {
    setSelectedLandmark(landmark);
    moveCameraTo(landmark.position);
    playBloomSound("uiSelect", audioSettings);
  }

  function startOnboarding() {
    setTutorialState({ hasStarted: true, completed: false, currentStep: tutorialState.completed ? 0 : tutorialState.currentStep });
    moveCameraTo(activeStep.position);
  }

  function updateTutorialStep(nextStep: number) {
    const boundedStep = Math.max(0, Math.min(onboardingSteps.length - 1, nextStep));
    setTutorialState({ hasStarted: true, completed: false, currentStep: boundedStep });
    moveCameraTo(onboardingSteps[boundedStep].position);
  }

  function finishOnboarding() {
    setTutorialState({ hasStarted: true, completed: true, currentStep: onboardingSteps.length - 1 });
  }

  function toggleMute() {
    setAudioSettings({ ...audioSettings, muted: !audioSettings.muted });
  }

  return (
    <main className="bloom-shell">
      <WorldScene
        cameraTarget={cameraTarget}
        onSelectLandmark={selectLandmark}
        onHoverLandmark={(landmark) => {
          if (landmark) {
            setHoverHint({ title: landmark.name, body: landmark.description, x: 0, y: 0 });
          } else {
            setHoverHint(null);
          }
        }}
      />
      <div className="world-vignette" />
      <WorldStats firebaseConfigured={firebase.configured} />

      <button
        className="guide-button"
        type="button"
        onClick={startOnboarding}
        aria-label="Start Bloomverse guide"
      >
        <Compass size={19} />
        Start Guide
      </button>

      <SearchSystem
        onResult={(result) => {
          moveCameraTo(result.position);
          setSearchHistory([result.label, ...searchHistory.filter((item) => item !== result.label)].slice(0, 6));
        }}
        searchHistory={searchHistory}
      />

      <button
        className="audio-button"
        type="button"
        onClick={toggleMute}
        aria-label="Toggle audio mute"
      >
        {audioSettings.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span>{hasAudioAssets() ? `${Math.round(audioSettings.volume * 100)}%` : "Audio plan"}</span>
      </button>

      {!helpHiddenUntilRefresh && (
        <button
          className="hide-help-button"
          type="button"
          onClick={() => setHelpHiddenUntilRefresh(true)}
        >
          Hide Help
        </button>
      )}

      {!helpHiddenUntilRefresh && (
        <button
          className="help-orb"
          type="button"
          onClick={() => {
            setHelpOpen(true);
            playBloomSound("uiOpen", audioSettings);
          }}
          aria-label="Open Bloomverse help"
        >
          ?
        </button>
      )}

      <button
        className="become-citizen-button"
        type="button"
        onClick={() => setCitizenPanelOpen(true)}
      >
        Become a Citizen
      </button>

      <AnimatePresence>
        {introOpen && <IntroOverlay onClose={() => setIntroOpen(false)} onBecomeCitizen={() => setCitizenPanelOpen(true)} />}
        {helpOpen && (
          <HelpPanel
            onClose={() => setHelpOpen(false)}
            onHideHelpButton={() => {
              setHelpHiddenUntilRefresh(true);
              setHelpOpen(false);
            }}
            firebaseConfigured={firebase.configured}
          />
        )}
        {selectedLandmark && <LandmarkProfile landmark={selectedLandmark} onClose={() => setSelectedLandmark(null)} />}
        {onboardingActive && (
          <OnboardingOverlay
            step={activeStep}
            stepIndex={tutorialState.currentStep}
            totalSteps={onboardingSteps.length}
            onPrevious={() => updateTutorialStep(tutorialState.currentStep - 1)}
            onNext={() => updateTutorialStep(tutorialState.currentStep + 1)}
            onSkip={finishOnboarding}
            onFinish={finishOnboarding}
          />
        )}
        {citizenPanelOpen && (
          <CitizenPanel
            draft={citizenDraft}
            setDraft={setCitizenDraft}
            onClose={() => setCitizenPanelOpen(false)}
            deviceId={deviceId}
            firebaseConfigured={firebase.configured}
          />
        )}
      </AnimatePresence>
      <HoverTooltip hint={hoverHint} />
    </main>
  );
}

function formatAge(days: number): string {
  if (days < 1) return "Just born";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

function WorldStats({
  firebaseConfigured
}: {
  firebaseConfigured: boolean;
}) {
  const birthTime = new Date(worldBirthDate).getTime();
  const ageDays = Math.max(0, Math.floor((Date.now() - birthTime) / 86_400_000));

  return (
    <section className="world-stats" aria-label="Bloomverse world age and stats">
      <p>World Age</p>
      <strong>{formatAge(ageDays)}</strong>
      <span>Citizens: {firebaseConfigured ? "Loading..." : "Live after Firebase"}</span>
      <span>Dreams: live after Firebase config</span>
      <span>Landmarks: {starterLandmarks.length} starter</span>
      <span>Time Capsules: live after Firebase config</span>
      <span>Discoveries: local journal ready</span>
      {!firebaseConfigured && <em>Firebase env not connected</em>}
    </section>
  );
}

function SearchSystem({
  onResult,
  searchHistory
}: {
  onResult: (result: SearchResult) => void;
  searchHistory: string[];
}) {
  const [query, setQuery] = useState("");
  const searchIndex = buildStaticSearchIndex();
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? searchIndex.filter((result) => `${result.label} ${result.type} ${result.description}`.toLowerCase().includes(normalizedQuery)).slice(0, 6)
    : [];

  return (
    <section className="search-artifact" aria-label="Bloomverse search">
      <label htmlFor="bloom-search">Search the living world</label>
      <input
        id="bloom-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Citizens, dreams, landmarks, districts..."
      />
      <div className="search-results">
        {results.map((result) => (
          <button key={`${result.type}-${result.id}`} type="button" onClick={() => onResult(result)}>
            <strong>{result.label}</strong>
            <span>{result.type}</span>
          </button>
        ))}
        {!results.length && normalizedQuery && <p>No local result yet. Firebase-backed citizens, events, and timeline entries appear after setup.</p>}
        {!normalizedQuery && searchHistory.length > 0 && <p>Recent: {searchHistory.join(" • ")}</p>}
      </div>
    </section>
  );
}

function IntroOverlay({ onClose, onBecomeCitizen }: { onClose: () => void; onBecomeCitizen: () => void }) {
  return (
    <motion.section className="intro-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="intro-scroll" initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, opacity: 0 }}>
        <span className="eyebrow">Welcome to Bloomverse</span>
        <h1>Build Your Legacy</h1>
        <p>Explore the world, create a citizen, and leave a dream behind.</p>
        <div className="intro-actions">
          <button type="button" onClick={onClose}>Explore First</button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBecomeCitizen();
            }}
          >
            Become a Citizen
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

function HelpPanel({
  onClose,
  onHideHelpButton,
  firebaseConfigured
}: {
  onClose: () => void;
  onHideHelpButton: () => void;
  firebaseConfigured: boolean;
}) {
  const sections: HelpSection[] = [
    {
      title: "What Is Bloomverse?",
      content: "Bloomverse is a living digital civilization. Every citizen contributes to the world, every contribution becomes part of history, and the world evolves permanently as citizens create dreams, discoveries, homes, and events."
    },
    {
      title: "Becoming A Citizen",
      content: "Create a profile, choose an avatar, write a dream, add a favorite quote, and join the civilization. Your profile becomes part of the world and your dream can become a visible world object."
    },
    {
      title: "Districts",
      content: "Nature grows around the Ancient Tree. Creator holds studios and art. Startup contains builder workshops. Gaming hosts challenges. Dream turns wishes into objects. Legacy protects history. Mystery hides secrets. Future watches the sky and unfinished possibilities."
    },
    {
      title: "Dreams",
      content: "Dreams become physical objects in the world: rockets, studios, game companies, dream houses, sports cars, travel goals, and future wishes. The Dream Fountain gathers them before they rise into the Dream Sky."
    },
    {
      title: "Reputation",
      content: "Reputation grows from favorites, achievements, discoveries, community event wins, landmark creation, and long-term legacy. Higher reputation unlocks recognition, status, and legendary placement."
    },
    {
      title: "Achievements",
      content: "Badges mark founder status, milestones, legendary status, exploration rewards, dream creation, community wins, and world-shaping actions."
    },
    {
      title: "Discoveries",
      content: "Mysteries, secrets, hidden locations, rare events, ruins, gardens, and lost messages are recorded in the Exploration Journal so the civilization remembers what citizens uncover."
    },
    {
      title: "Community Events",
      content: "Citizens vote on world expansion, global structures, seasonal goals, and weekly events. Winning choices become part of the shared map."
    },
    {
      title: "Time Capsules",
      content: "Citizens can leave messages for future visitors. Capsules unlock after chosen dates and become historical records inside the Legacy District."
    },
    {
      title: "Hall Of Legends",
      content: "The Hall remembers the most loved citizens, famous landmarks, community heroes, major contributors, and legendary explorers."
    },
    {
      title: "World History",
      content: "The timeline records historical events, founder stories, citizen joins, major discoveries, community decisions, and era-defining milestones."
    },
    {
      title: "FAQ",
      content: "Can I change my dream? Planned. Can I move my home? Planned through future district systems. How do I gain reputation? Create, explore, receive favorites, join events, and discover secrets. How do discoveries work? Hidden places become journal entries when found."
    }
  ];

  return (
    <motion.aside className="panel-shell help-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="panel-close" type="button" onClick={onClose}>Close</button>
      <button className="hide-help-inline" type="button" onClick={onHideHelpButton}>Hide ?</button>
      <span className="eyebrow">Adventure Journal</span>
      <h2>Bloomverse Encyclopedia</h2>
      <p className="help-intro">A civilization handbook for explorers, citizens, dreamers, and future legends.</p>
      <div className="help-grid">
        {sections.map((section) => (
          <article key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </article>
        ))}
      </div>
      {!firebaseConfigured && <p className="help-note">Shared-world data activates after Firebase environment values are connected.</p>}
      <CreatorCard />
    </motion.aside>
  );
}

function CreatorCard() {
  return (
    <article className="dev-info-card">
      <div className="dev-info-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="MKR Infinity" className="dev-info-avatar" />
        <div>
          <span className="eyebrow">Developer & Creator</span>
          <h3>Mohammad Kaif Raja</h3>
          <p className="dev-info-role">Open Source Builder / System Optimizer / Vibe Coder</p>
        </div>
      </div>
      <p className="dev-info-bio">Passionate about systems, not code. From flashing OS to customizing Linux, I have tested countless distros. Tech is my playground, curiosity my guide.</p>
      <div className="dev-info-stats">
        <div className="dev-info-stat">
          <strong>1</strong>
          <span>World</span>
        </div>
        <div className="dev-info-stat">
          <strong>8</strong>
          <span>Districts</span>
        </div>
        <div className="dev-info-stat">
          <strong>12+</strong>
          <span>Landmarks</span>
        </div>
        <div className="dev-info-stat">
          <strong>&infin;</strong>
          <span>Dreams</span>
        </div>
      </div>
      <div className="dev-info-links">
        <a href="https://github.com/mkr-infinity" target="_blank" rel="noreferrer" className="dev-info-link">
          <FaGithub /> <span>GitHub</span>
        </a>
        <a href="https://instagram.com/mkr_infinity" target="_blank" rel="noreferrer" className="dev-info-link">
          <FaInstagram /> <span>Instagram</span>
        </a>
        <a href="https://t.me/mkr_infinity" target="_blank" rel="noreferrer" className="dev-info-link">
          <FaTelegram /> <span>Telegram</span>
        </a>
        <a href="https://mkr-infinity.github.io" target="_blank" rel="noreferrer" className="dev-info-link">
          <FiGlobe /> <span>Portfolio</span>
        </a>
        <a href="https://buymeacoffee.com/mkr_infinity" target="_blank" rel="noreferrer" className="dev-info-link">
          <FiCoffee /> <span>Buy Me a Coffee</span>
        </a>
      </div>
      <div className="dev-info-actions">
        <a className="support-button" href="https://github.com/mkr-infinity" target="_blank" rel="noreferrer">
          Visit GitHub
        </a>
        <a className="support-button" href="https://supportmkr.netlify.app" target="_blank" rel="noreferrer">
          <FiHeart size={14} /> Support Creator
        </a>
      </div>
    </article>
  );
}

function HoverTooltip({ hint }: { hint: HoverHint | null }) {
  if (!hint) return null;

  return (
    <motion.aside
      className="hover-tooltip"
      style={{ left: hint.x, top: hint.y }}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8 }}
    >
      <strong>{hint.title}</strong>
      <span>{hint.body}</span>
    </motion.aside>
  );
}

function LandmarkProfile({ landmark, onClose }: { landmark: Landmark; onClose: () => void }) {
  return (
    <motion.aside className="panel-shell profile-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="panel-close" type="button" onClick={onClose}>Close</button>
      <span className="eyebrow">Starter Landmark</span>
      <h2>{landmark.name}</h2>
      <p>{landmark.description}</p>
      <dl>
        <div><dt>District</dt><dd>{landmark.district}</dd></div>
        <div><dt>Legacy</dt><dd>World-owned starter structure</dd></div>
        <div><dt>Reputation</dt><dd>Permanent landmark</dd></div>
      </dl>
    </motion.aside>
  );
}

function OnboardingOverlay({
  step,
  stepIndex,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
  onFinish
}: {
  step: (typeof onboardingSteps)[number];
  stepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
}) {
  const isLast = stepIndex === totalSteps - 1;

  return (
    <motion.section className="onboarding-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div
        className="spotlight-hole"
        style={{ left: step.spotlight.x, top: step.spotlight.y, width: step.spotlight.size, height: step.spotlight.size }}
      />
      <motion.article className="tutorial-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="eyebrow">Step {stepIndex + 1} / {totalSteps}</span>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <strong>{step.targetLabel}</strong>
        <div className="tutorial-actions">
          <button type="button" onClick={onPrevious} disabled={stepIndex === 0}>Previous</button>
          <button type="button" onClick={onSkip}>Skip</button>
          {isLast ? <button type="button" onClick={onFinish}>Finish</button> : <button type="button" onClick={onNext}>Next</button>}
        </div>
      </motion.article>
    </motion.section>
  );
}

function CitizenPanel({
  draft,
  setDraft,
  onClose,
  deviceId,
  firebaseConfigured
}: {
  draft: CitizenDraft;
  setDraft: (draft: CitizenDraft) => void;
  onClose: () => void;
  deviceId: string;
  firebaseConfigured: boolean;
}) {
  const fields: Array<[keyof CitizenDraft, string, string]> = [
    ["name", "Name", "Your citizen name"],
    ["avatar", "Avatar", "seedling, moth, fox, stonekeeper..."],
    ["about", "About Me", "What should the world know about you?"],
    ["dream", "Dream", "The dream that should become a landmark"],
    ["quote", "Quote", "A sentence your legacy book remembers"],
    ["github", "GitHub", "https://github.com/..."],
    ["linkedin", "LinkedIn", "https://linkedin.com/in/..."],
    ["instagram", "Instagram", "https://instagram.com/..."],
    ["twitterX", "Twitter/X", "https://x.com/..."],
    ["website", "Website", "https://..." ]
  ];

  return (
    <motion.aside className="panel-shell citizen-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="panel-close" type="button" onClick={onClose}>Close</button>
      <span className="eyebrow">Citizen Creation</span>
      <h2>Become a Citizen</h2>
      <p>No login required. Your draft survives refreshes on this device.</p>
      <form>
        {fields.map(([key, label, placeholder]) => (
          <label key={key}>
            {label}
            {key === "about" || key === "dream" ? (
              <textarea value={draft[key]} placeholder={placeholder} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
            ) : (
              <input value={draft[key]} placeholder={placeholder} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
            )}
          </label>
        ))}
      </form>
      <div className="creation-note">
        <strong>Device ID</strong>
        <span>{deviceId || "Generating local identity..."}</span>
      </div>
      <button className="primary-action" type="button" disabled={!firebaseConfigured}>
        {firebaseConfigured ? "Create Citizen" : "Connect Firebase To Create Citizen"}
      </button>
    </motion.aside>
  );
}
// add JSDoc to WorldScene component
// add JSDoc to BloomverseApp component
// add JSDoc to HelpPanel component
// add JSDoc to CitizenPanel component
// add JSDoc to LandmarkProfile component
// add JSDoc to OnboardingOverlay component
// add JSDoc to WorldStats component
// add JSDoc to SearchSystem component
// add props interface documentation
// add return type documentation
// add JSDoc to WorldScene component
// add JSDoc to BloomverseApp component
// add JSDoc to HelpPanel component
// add JSDoc to CitizenPanel component
// add JSDoc to LandmarkProfile component
// add JSDoc to OnboardingOverlay component
// add JSDoc to WorldStats component
// add JSDoc to SearchSystem component
// add props interface documentation
// add return type documentation
// add JSDoc to WorldScene component
// add JSDoc to BloomverseApp component
// add JSDoc to HelpPanel component
// add JSDoc to CitizenPanel component
// add JSDoc to LandmarkProfile component
// add JSDoc to OnboardingOverlay component
// add JSDoc to WorldStats component
// add JSDoc to SearchSystem component
// add props interface documentation
// add return type documentation
// add JSDoc to WorldScene component
// add JSDoc to BloomverseApp component
// add JSDoc to HelpPanel component
// add JSDoc to CitizenPanel component
// add JSDoc to LandmarkProfile component
// add JSDoc to OnboardingOverlay component
// add JSDoc to WorldStats component
// add JSDoc to SearchSystem component
// add props interface documentation
// add return type documentation
