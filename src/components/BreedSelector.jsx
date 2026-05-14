export default function BreedSelector({ breeds, selectedBreed, onSelectBreed }) {
  return (
    <aside className="breed-selector">
      <h2>Breeds</h2>
      <ul>
        {breeds.map((breed) => (
          <li key={breed}>
            <button
              className={selectedBreed === breed ? 'active' : ''}
              onClick={() => onSelectBreed(breed)}
            >
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
