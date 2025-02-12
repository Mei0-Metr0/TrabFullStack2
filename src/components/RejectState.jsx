// Componente para o estado de rejeição por erro

const RejectState = () => {
  return (
    <div className="alert alert-danger text-center my-5" role="alert">
      {error || 'Erro ao carregar os dados. Tente novamente mais tarde.'}
    </div>
  );
}

export default RejectState;