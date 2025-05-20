import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store';

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const favoritesCount = store && store.favorites ? store.favorites.length : 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleRemoveFavorite = (e, uid, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (actions && typeof actions.removeFavorite === 'function') {
      actions.removeFavorite(uid, type);
      console.log('Función removeFavorite ejecutada');
    } else {
      console.error('La función removeFavorite no está disponible:', actions);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <div className="container">
        <div className="navbar-brand">
          <img 
            src="src/assets/img/star-wars-logo-3654.webp" 
            alt="Star Wars" 
            height="90" 
          />
        </div>
        <div className="dropdown" ref={dropdownRef}>
          <button className="btn btn-primary dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <i className="fas fa-star me-1"></i> Favoritos
            {favoritesCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {favoritesCount}
                <span className="visually-hidden">favoritos</span>
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '280px' }}>
              <h6 className="dropdown-header">Mis Favoritos</h6>
              {favoritesCount > 0 ? (
                store.favorites.map((favorite) => (
                  <div key={`${favorite.type}-${favorite.uid}`} className="dropdown-item d-flex justify-content-between">
                    {favorite.name}
                    <button onClick={(e) => handleRemoveFavorite(e, favorite.uid, favorite.type)} className="btn btn-sm btn-outline-danger">X</button>
                  </div>
                ))
              ) : (
                <div className="dropdown-item text-center py-3">
                  <i className="fas fa-heart-broken me-1"></i>
                  No tienes favoritos
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
