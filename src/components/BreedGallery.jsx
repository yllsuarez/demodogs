export default function BreedGallery({ images, breed, subBreed, loading }) {
  const title = subBreed
    ? `${subBreed.charAt(0).toUpperCase() + subBreed.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)}`
    : breed.charAt(0).toUpperCase() + breed.slice(1);

  return (
    <section className="breed-gallery">
      <h2>{title}</h2>
      {loading ? (
        <div className="loading">
          <span className="spinner" />
          Loading…
        </div>
      ) : images.length === 0 ? (
        <p className="empty">No images found.</p>
      ) : (
        <div className="image-grid">
          {images.map((url) => (
            <div key={url} className="image-card">
              <img src={url} alt={`${title} dog`} loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
