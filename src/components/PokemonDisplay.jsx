// Arquivo de componente que apresenta o Pokemon baseado na cotação de USD para BRL

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDollarPokemon } from "../slices/dollarPokemonSlice";
import { toUpperCaseText } from "../utils/stringUtils";
import './PokemonDisplay.css'
import PendingState from "./PendingState"
import RejectState from "./RejectState"

function PokemonDisplay() {
  const dispatch = useDispatch();
  const { dollarPokemon, exchangeRate, status } = useSelector((state) => state.dollarPokemon);

  // Obtenção por useEffect
  useEffect(() => {
    dispatch(fetchDollarPokemon());
  }, [dispatch]);

  // Gerencia estados
  if (status === "pending") {
    <PendingState />
  }

  if (status === "rejected") {
    <RejectState />
  }

  return (
    <div className="my-4 text-center">
      {dollarPokemon && exchangeRate && (
        <>
          <h2 className="display">
            Pokémon Cotação do dólar em relação ao real: <span className="text-success">R${exchangeRate.toFixed(2)}</span>
          </h2>
          <img
            src={dollarPokemon.sprites.other["official-artwork"].front_default}
            alt={dollarPokemon.name}
            className="img"
          />
          <h3>{toUpperCaseText(dollarPokemon.name)}</h3>
        </>
      )}
    </div>
  );
}

export default PokemonDisplay;
