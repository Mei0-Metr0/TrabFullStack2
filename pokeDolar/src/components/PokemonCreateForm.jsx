import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPokemon } from '../slices/gallerySlice';

const PokemonCreateForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    type: 1,
    picture: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const pokemonTypes = [
    "normal", "fighting", "flying", "poison", "ground",
    "rock", "bug", "ghost", "steel", "fire", "water",
    "grass", "electric", "psychic", "ice", "dragon",
    "dark", "fairy"
  ];

  const validateName = (name) => {
    const validPattern = /^[a-zA-Z0-9-]*$/;
    
    if (!validPattern.test(name)) {
      const invalidChars = name.match(/[^a-zA-Z0-9-]/g);
      const uniqueInvalidChars = [...new Set(invalidChars)].join(" ");
      setNameError(`Invalid characters: ${uniqueInvalidChars}`);
      return false;
    }
    
    setNameError('');
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      validateName(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('Image size must be less than 1MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        picture: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!validateName(formData.name)) {
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('picture', formData.picture);
  
      const response = await fetch('/api/pokemon/create', {
        method: 'POST',
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Verifica se há erros de validação
        if (data.errors && data.errors.length > 0) {
          setError(data.errors[0].msg); // Exibe apenas o primeiro erro
        } else {
          setError(data.message || 'Erro desconhecido');
        }
        return;
      }
  
      dispatch(addPokemon(data));
      onClose();
      setFormData({ name: '', type: 1, picture: null });
      setPreviewUrl(null);
      window.location.reload();
    } catch (err) {
      setError('Erro ao enviar requisição');
    }
  };

  if (!isOpen) return null;

  // Check if form is valid (including name validation)
  const isFormValid = formData.name && formData.picture && !nameError;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Pokemon</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${nameError ? 'border-2 border-danger' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {nameError && (
                  <div className="text-danger mt-1 small">
                    {nameError}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {pokemonTypes.map((type, index) => (
                    <option key={type} value={index + 1}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!isFormValid}
                >
                  Create Pokemon
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCreateForm;