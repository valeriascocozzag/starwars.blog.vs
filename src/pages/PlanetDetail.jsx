import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const PlanetDetail = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  const isFavorite = store.favorites.some(fav =>
    fav.uid === id && fav.type === "planets"
  );

  const imgUrl = actions.getUrlImgPlanets(id);

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.swapi.tech/api/planets/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del planeta');
        }

        const data = await response.json();
        setPlanet(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlanet();
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "planets");
    } else {
      if (planet) {
        actions.addFavorite({
          uid: id,
          type: "planets",
          name: planet.properties.name,
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

  if (!planet) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este planeta.
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 mt-5" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="card border" style={{ borderRadius: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0", border: "2px solidrgb(7, 205, 255)" }}>
          <h2 className="mb-0">{planet.properties.name}</h2>
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
              <img src={imgUrl} alt={planet.properties.name} className="img-fluid rounded" style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }} />
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Descripción del Planeta</h4>
              <p>{planet.properties.name} es un planeta caracterizado por su clima {planet.properties.climate} y terreno {planet.properties.terrain}. Su diámetro es de aproximadamente {planet.properties.diameter} km, y posee una gravedad de {planet.properties.gravity}.</p>
              <p>El planeta tiene un período de rotación de {planet.properties.rotation_period} horas y un período orbital de {planet.properties.orbital_period} días. El agua superficial cubre alrededor del {planet.properties.surface_water}% de su superficie.</p>
              <p>En cuanto a la vida en el planeta, cuenta con una población de {planet.properties.population} habitantes.</p>
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
