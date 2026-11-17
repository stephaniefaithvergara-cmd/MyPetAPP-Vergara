import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Dog, Heart, LoaderCircle, PawPrint, RefreshCw, Sparkles } from 'lucide-react';

type BreedMap = Record<string, string[]>;
const API_BASE = 'https://dog.ceo/api';

function titleCase(value: string) {
  return value.split(/[-_]/g).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export default function App() {
  const [breeds, setBreeds] = useState<BreedMap>({});
  const [selectedBreed, setSelectedBreed] = useState('shih-tzu');
  const [dogImage, setDogImage] = useState('');
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(true);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [error, setError] = useState('');
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadBreeds() {
      try {
        setError('');
        const response = await fetch(`${API_BASE}/breeds/list/all`, { signal: controller.signal });
        if (!response.ok) throw new Error('The breed list could not be loaded.');
        const data: { status: string; message: BreedMap } = await response.json();
        if (data.status !== 'success') throw new Error('The dog API returned an unexpected response.');
        setBreeds(data.message);
        const hasShihTzu = Boolean(data.message['shih-tzu']);
        const firstBreed = Object.keys(data.message).sort()[0];
        setSelectedBreed(hasShihTzu ? 'shih-tzu' : firstBreed ?? '');
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setIsLoadingBreeds(false);
      }
    }
    void loadBreeds();
    return () => controller.abort();
  }, []);

  const breedOptions = useMemo(() => Object.entries(breeds).flatMap(([breed, subBreeds]) =>
    subBreeds.length
      ? subBreeds.map((sub) => ({ value: `${breed}/${sub}`, label: `${breed}-${sub}` }))
      : [{ value: breed, label: breed }],
  ).sort((a, b) => a.label.localeCompare(b.label)), [breeds]);

  async function fetchDogImage() {
    if (!selectedBreed) return;
    setIsFetchingImage(true);
    setError('');
    try {
      const endpoint = `${API_BASE}/breed/${selectedBreed}/images/random`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Could not find an image for this breed. Please try another one.');
      const data: { status: string; message: string } = await response.json();
      if (data.status !== 'success' || !data.message) throw new Error('No dog image was returned. Please try again.');
      setDogImage(data.message);
      setImageCount((count) => count + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsFetchingImage(false);
    }
  }

  const displayBreed = selectedBreed ? titleCase(selectedBreed.replace('/', '-')) : 'Choose a breed';

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="My Pet App home"><span className="brand-mark"><PawPrint size={21} strokeWidth={2.6} /></span><span>my<span className="brand-accent">pet.</span></span></a>
        <div className="top-note"><span className="online-dot" /> DOG BREED EXPLORER</div>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> YOUR DAILY DOSE OF CUTE</div>
          <h1>Meet your<br /><span>new bestie.</span></h1>
          <p className="intro">A little wag, a lot of love. Pick a dog breed and discover a new furry face every time.</p>
          <div className="hero-pills"><span><Heart size={14} fill="currentColor" /> All paws welcome</span><span><Check size={14} /> Powered by Dog CEO API</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="sun-shape" /><div className="floating-heart heart-a">♥</div><div className="floating-heart heart-b">♥</div><div className="art-label">good dogs<br />only <span>✳</span></div><div className="paw-stamp"><PawPrint size={30} /></div></div>
      </section>

      <section className="explorer-card" aria-labelledby="explorer-title">
        <div className="card-heading"><div><div className="section-kicker">THE BREED FINDER</div><h2 id="explorer-title">Who's the lucky pup?</h2><p>Choose a breed, then let the magic happen.</p></div><div className="heading-icon"><Dog size={27} /></div></div>
        <div className="controls-row">
          <label className="select-wrap" htmlFor="breed-select"><span className="field-label">SELECT A DOG BREED</span><span className="select-control"><span className="select-paw"><PawPrint size={17} /></span><select id="breed-select" value={selectedBreed} onChange={(event) => { setSelectedBreed(event.target.value); setError(''); }} disabled={isLoadingBreeds || breedOptions.length === 0}><option value="" disabled>Choose a breed</option>{breedOptions.map((breed) => <option value={breed.value} key={breed.value}>{titleCase(breed.label)}</option>)}</select><ChevronDown className="select-chevron" size={18} /></span></label>
          <button className="fetch-button" onClick={() => void fetchDogImage()} disabled={!selectedBreed || isLoadingBreeds || isFetchingImage}><span>{isFetchingImage ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}</span>{isFetchingImage ? 'Finding a pup...' : 'Fetch a dog'}<ArrowRight size={17} /></button>
        </div>
        {isLoadingBreeds && <div className="inline-status"><LoaderCircle className="spin" size={16} /> Fetching the breed list...</div>}
        {error && <div className="error-message" role="alert">{error} <button onClick={() => { setError(''); if (!dogImage) void fetchDogImage(); }}>Try again</button></div>}

        <div className={`image-stage ${dogImage ? 'has-image' : ''}`}>
          {dogImage ? <><img className="dog-photo" src={dogImage} alt={`${displayBreed} dog`} key={dogImage} /><div className="photo-caption"><span className="caption-paw"><PawPrint size={15} /></span><span><small>YOUR FEATURED FRIEND</small><strong>{displayBreed}</strong></span><span className="photo-count">#{String(imageCount).padStart(2, '0')}</span></div><button className="refresh-button" onClick={() => void fetchDogImage()} disabled={isFetchingImage} aria-label="Fetch another dog image"><RefreshCw size={17} /></button></> : <div className="empty-state"><div className="empty-illustration"><div className="empty-sun" /><div className="empty-dog"><div className="ear ear-left" /><div className="ear ear-right" /><div className="dog-face"><i className="eye eye-left" /><i className="eye eye-right" /><i className="nose" /><i className="mouth" /></div></div><span className="sparkle sparkle-left">✦</span><span className="sparkle sparkle-right">✧</span></div><h3>Your next furry friend awaits</h3><p>{isLoadingBreeds ? 'Getting the good boys and girls ready...' : 'Pick a breed above and tap “Fetch a dog” to see a random photo.'}</p></div>}
        </div>
        <div className="card-footer"><span><span className="footer-dot" /> LIVE BREED COLLECTION</span><span>Made with <Heart size={12} fill="currentColor" /> for dog lovers</span></div>
      </section>

      <footer className="page-footer"><span>MY PET APP <span className="footer-star">✳</span> A SMALL PROJECT WITH BIG LOVE</span><a href="https://dog.ceo/dog-api/" target="_blank" rel="noreferrer">Explore the Dog CEO API <ArrowDown size={13} /></a></footer>
    </main>
  );
}
