// Componente para exibir cada Pokemon em um cartão separado na galeria

function PokemonCard({ name, imageUrl, number }) {
  if (!name || !imageUrl) return null;

  return (
    <div className="col-6 col-md-2 mb-4">
      <div className="card">
        <img src={imageUrl} className="card-img-top" alt={name} />
        <div className="card-body text-center">
          <h5 className="card-title">#{number} {name}</h5>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;