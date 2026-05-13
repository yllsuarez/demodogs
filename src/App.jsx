import { useState, useEffect } from 'react';
import BreedSelector from './components/BreedSelector';
import BreedGallery from './components/BreedGallery';
import './App.css';

const API_BASE = 'https://dog.ceo/api';
const DEFAULT_BREED = 'shepherd';
const IMAGES_PER_BREED = 12;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.message;
}

function App() {
  const [allBreeds, setAllBreeds] = useState({});
  const [selectedBreed, setSelectedBreed] = useState(DEFAULT_BREED);
  const [selectedSubBreed, setSelectedSubBreed] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load full breed list on mount
  useEffect(() => {
    fetchJSON(`${API_BASE}/breeds/list/all`)
      .then((breeds) => {
        setAllBreeds(breeds);
        setLoadingBreeds(false);
      })
      .catch(() => {
        setError('Failed to load breed list.');
        setLoadingBreeds(false);
      });
  }, []);

  // Load images whenever breed or sub-breed changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingImages(true);
      setError(null);
      try {
        const path = selectedSubBreed
          ? `${API_BASE}/breed/${selectedBreed}/${selectedSubBreed}/images/random/${IMAGES_PER_BREED}`
          : `${API_BASE}/breed/${selectedBreed}/images/random/${IMAGES_PER_BREED}`;
        const imgs = await fetchJSON(path);
        if (!cancelled) setImages(Array.isArray(imgs) ? imgs : [imgs]);
      } catch {
        if (!cancelled) {
          setError('Failed to load images.');
          setImages([]);
        }
      } finally {
        if (!cancelled) setLoadingImages(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [selectedBreed, selectedSubBreed, refreshKey]);

  const handleSelectBreed = (breed) => {
    setSelectedBreed(breed);
    setSelectedSubBreed(null);
  };

  const subBreeds = allBreeds[selectedBreed] ?? [];

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🐕</span>
        <h1>DemoDogs</h1>
        <p>Discover dog breeds from around the world</p>
      </header>

      <div className="app-body">
        {loadingBreeds ? (
          <div className="loading full-page">
            <span className="spinner" />
            Loading breeds…
          </div>
        ) : (
          <>
            <BreedSelector
              breeds={Object.keys(allBreeds).sort()}
              selectedBreed={selectedBreed}
              onSelectBreed={handleSelectBreed}
            />

            <main className="main-content">
              {subBreeds.length > 0 && (
                <div className="sub-breed-tabs">
                  <button
                    className={selectedSubBreed === null ? 'active' : ''}
                    onClick={() => setSelectedSubBreed(null)}
                  >
                    All
                  </button>
                  {subBreeds.map((sb) => (
                    <button
                      key={sb}
                      className={selectedSubBreed === sb ? 'active' : ''}
                      onClick={() => setSelectedSubBreed(sb)}
                    >
                      {sb.charAt(0).toUpperCase() + sb.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {error && <p className="error">{error}</p>}

              <BreedGallery
                images={images}
                breed={selectedBreed}
                subBreed={selectedSubBreed}
                loading={loadingImages}
              />

              {!loadingImages && (
                <button
                  className="refresh-btn"
                  onClick={() => setRefreshKey((k) => k + 1)}
                >
                  🔄 Shuffle Images
                </button>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
