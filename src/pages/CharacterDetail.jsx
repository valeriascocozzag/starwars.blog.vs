import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  const isFavorite = store.favorites.some(fav =>
    fav.uid === id && fav.type === "characters"
  );

  const imgUrl = actions.getUrlImgCharacter(id);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.swapi.tech/api/people/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del personaje');
        }

        const data = await response.json();
        setCharacter(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "characters");
    } else {
      if (character) {
        actions.addFavorite({
          uid: id,
          type: "characters",
          name: character.properties.name,
        });
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3" role="alert">
        {error}
      </div>
    );
  }

  if (!character) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este personaje.
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 mt-5" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="card border" style={{ borderRadius: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0", border: "2px solid #FFC107" }}>
          <h2 className="mb-0">{character.properties.name}</h2>
          <button
            type="button"
            className="btn"
            onClick={handleToggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            style={{ backgroundColor: isFavorite ? "#FFC107" : "transparent", borderColor: "#FFC107", width: "46px", height: "38px" }}
          >
            <i className={`fas fa-star ${isFavorite ? 'text-dark' : 'text-warning'}`}></i>
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <img src={imgUrl} alt={character.properties.name} className="img-fluid rounded" style={{ maxHeight: "400px", objectFit: "cover" }} />
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Descripción del Personaje</h4>
              <p>{character.properties.name} es un personaje de género {character.properties.gender}, nacido en el año {character.properties.birth_year}. Su altura es de {character.properties.height} cm y su peso de {character.properties.mass} kg.</p>
              <p>Posee ojos de color {character.properties.eye_color}, cabello de color {character.properties.hair_color} y piel de tono {character.properties.skin_color}.</p>
              <p>Su planeta natal es desconocido, aunque puedes explorar más sobre su posible planeta de origen visitando el siguiente enlace:</p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/`);
                }}
                className="text-primary"
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
