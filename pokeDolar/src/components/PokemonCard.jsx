function PokemonCard({ name, imageUrl, number, isCustom }) {
  if (!name || !imageUrl) return null;

  return (
    <div className="col-6 col-md-2 mb-4">
      <div className="card">
        <img 
          src={imageUrl} 
          className="card-img-top" 
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-pokemon.png'; // Add a placeholder image
          }}
        />
        <div className="card-body text-center">
          <h5 className="card-title">
            #{number} {name}
            {isCustom && (
              <span className="badge bg-success ms-1" style={{ fontSize: '0.7em' }}>
                Custom
              </span>
            )}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;