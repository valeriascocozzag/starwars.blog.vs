import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  const isFavorite = store.favorites.some(fav =>
    fav.uid === id && fav.type === "vehicles"
  );

  const imgUrl = actions.getUrlImgVehicle(id);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.swapi.tech/api/vehicles/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del vehículo');
        }

        const data = await response.json();
        setVehicle(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "vehicles");
    } else {
      if (vehicle) {
        actions.addFavorite({
          uid: id,
          type: "vehicles",
          name: vehicle.properties.name,
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

  if (!vehicle) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este vehículo.
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 mt-5" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="card border" style={{ borderRadius: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0", border: "2px solid #FFC107" }}>
          <h2 className="mb-0">{vehicle.properties.name}</h2>
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
              <img src={imgUrl} alt={vehicle.properties.name} className="img-fluid rounded" style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }} />
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Descripción del Vehículo</h4>
              <p>El {vehicle.properties.name} es un vehículo de clase {vehicle.properties.vehicle_class}, fabricado por {vehicle.properties.manufacturer} y modelo {vehicle.properties.model}. Su costo estimado es de {vehicle.properties.cost_in_credits} créditos galácticos.</p>
              <p>Este vehículo mide aproximadamente {vehicle.properties.length} metros de longitud, con una capacidad de carga de {vehicle.properties.cargo_capacity} kg y puede alcanzar una velocidad máxima de {vehicle.properties.max_atmosphering_speed} km/h.</p>
              <p>Está diseñado para transportar una tripulación de {vehicle.properties.crew} personas y puede llevar hasta {vehicle.properties.passengers} pasajeros adicionales. Además, cuenta con suministros suficientes para {vehicle.properties.consumables}.</p>
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
