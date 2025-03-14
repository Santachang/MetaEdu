import React, { useState, useEffect } from 'react';

const CRUDOperations = () => {
  const [selectedEntity, setSelectedEntity] = useState('colegio');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [resultsFound, setResultsFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState(''); // 'add', 'edit', or ''
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    id_departamento: '',
    id_municipio: '',
    id_colegio: ''
  });

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 640;

  const handleEntityChange = (event) => {
    setSelectedEntity(event.target.value);
    setData([]);
    setResultsFound(false);
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      showErrorModal('Por favor, ingrese un término de búsqueda');
      return;
    }

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'GET',
          body: {
            table: selectedEntity,
            query: searchTerm,
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        showErrorModal(result.error);
        setResultsFound(false);
      } else if (!result || result.length === 0) {
        showErrorModal('No se encontraron resultados para su búsqueda');
        setResultsFound(false);
      } else {
        setSearchResults(result);
        setResultsFound(true);
        setData([]);
      }
    } catch (error) {
      console.error('Error searching data:', error);
      showErrorModal('Error al buscar datos: ' + error.message);
      setResultsFound(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const renderRelatedItems = (items, type) => {
    if (!items || !items[0]) {
      return <p style={{ color: '#666', fontStyle: 'italic' }}>No hay {type} asociados</p>;
    }

    return (
      <div style={{ 
        display: 'grid', 
        gap: '0.75rem',
        marginTop: '0.5rem',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))'
      }}>
        {items.map((item) => (
          <div key={item.id_municipio || item.id_colegio || item.id_sede} style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ fontWeight: '500' }}>
              {item.nombre_municipio || item.nombre_colegio || item.nombre_sede}
            </div>
            <div style={{ color: '#666', fontSize: '0.875rem' }}>
              {item.codigo_municipio || item.codigo_colegio || item.codigo_sede}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderModalContent = () => {
    if (!selectedItem) return null;

    const modalStyles = {
      container: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: isMobile ? '1.5rem' : '2rem',
        width: isMobile ? '100%' : '90%',
        maxWidth: '600px',
        maxHeight: isMobile ? '100%' : '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      },
      header: {
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #eee'
      },
      title: {
        fontSize: isMobile ? '1.5rem' : '1.75rem',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '0.5rem'
      },
      subtitle: {
        color: '#666',
        fontSize: '0.875rem'
      },
      section: {
        marginBottom: '2rem'
      },
      sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '1.5rem'
      },
      infoCard: {
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #eee'
      },
      label: {
        color: '#666',
        fontSize: '0.875rem',
        marginBottom: '0.25rem'
      },
      value: {
        fontSize: '1rem',
        color: '#2c3e50',
        fontWeight: '500'
      },
      closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: '#666',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#f8f9fa'
        }
      }
    };

    const renderInfoCard = (label, value) => (
      <div style={modalStyles.infoCard}>
        <div style={modalStyles.label}>{label}</div>
        <div style={modalStyles.value}>{value || '---'}</div>
      </div>
    );

    switch (selectedEntity) {
      case 'departamento':
        return (
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Departamento</h3>
              <p style={modalStyles.subtitle}>Información detallada del departamento</p>
            </div>
            
            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>📋</span>
                <span>Información General</span>
              </h4>
              <div style={modalStyles.grid}>
                {renderInfoCard('ID', selectedItem.id_departamento)}
                {renderInfoCard('Nombre', selectedItem.nombre_departamento)}
                {renderInfoCard('Código', selectedItem.codigo_departamento)}
              </div>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>🏢</span>
                <span>Municipios</span>
              </h4>
              <div style={{ 
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))'
              }}>
                {selectedItem.municipios && selectedItem.municipios.length > 0 ? 
                  selectedItem.municipios.map(municipio => (
                    <div key={municipio.id_municipio} style={modalStyles.infoCard}>
                      <div style={modalStyles.value}>{municipio.nombre_municipio}</div>
                      <div style={modalStyles.label}>{municipio.codigo_municipio}</div>
                    </div>
                  )) : 
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No hay municipios asociados</p>
                }
              </div>
            </div>
          </div>
        );

      case 'municipio':
        return (
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Municipio</h3>
              <p style={modalStyles.subtitle}>Información detallada del municipio</p>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>📋</span>
                <span>Información General</span>
              </h4>
              <div style={modalStyles.grid}>
                {renderInfoCard('ID', selectedItem.id_municipio)}
                {renderInfoCard('Nombre', selectedItem.nombre_municipio)}
                {renderInfoCard('Código', selectedItem.codigo_municipio)}
                {renderInfoCard('Departamento', selectedItem.nombre_departamento)}
                {renderInfoCard('Código Departamento', selectedItem.codigo_departamento)}
              </div>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>🏫</span>
                <span>Colegios</span>
              </h4>
              <div style={{ 
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))'
              }}>
                {selectedItem.colegios && selectedItem.colegios.length > 0 ? 
                  selectedItem.colegios.map(colegio => (
                    <div key={colegio.id_colegio} style={modalStyles.infoCard}>
                      <div style={modalStyles.value}>{colegio.nombre_colegio}</div>
                      <div style={modalStyles.label}>{colegio.codigo_colegio}</div>
                    </div>
                  )) : 
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No hay colegios asociados</p>
                }
              </div>
            </div>
          </div>
        );

      case 'colegio':
        return (
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Colegio</h3>
              <p style={modalStyles.subtitle}>Información detallada del colegio</p>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>📋</span>
                <span>Información General</span>
              </h4>
              <div style={modalStyles.grid}>
                {renderInfoCard('ID', selectedItem.id_colegio)}
                {renderInfoCard('Nombre', selectedItem.nombre_colegio)}
                {renderInfoCard('Código', selectedItem.codigo_colegio)}
                {renderInfoCard('Municipio', selectedItem.nombre_municipio)}
                {renderInfoCard('Código Municipio', selectedItem.codigo_municipio)}
                {renderInfoCard('Departamento', selectedItem.nombre_departamento)}
                {renderInfoCard('Código Departamento', selectedItem.codigo_departamento)}
              </div>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>🏛️</span>
                <span>Sedes</span>
              </h4>
              <div style={{ 
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))'
              }}>
                {selectedItem.sedes && selectedItem.sedes.length > 0 ? 
                  selectedItem.sedes.map(sede => (
                    <div key={sede.id_sede} style={modalStyles.infoCard}>
                      <div style={modalStyles.value}>{sede.nombre_sede}</div>
                      <div style={modalStyles.label}>{sede.codigo_sede}</div>
                    </div>
                  )) : 
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No hay sedes asociadas</p>
                }
              </div>
            </div>
          </div>
        );

      case 'sede':
        return (
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Sede</h3>
              <p style={modalStyles.subtitle}>Información detallada de la sede</p>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>📋</span>
                <span>Información General</span>
              </h4>
              <div style={modalStyles.grid}>
                {renderInfoCard('ID', selectedItem.id_sede)}
                {renderInfoCard('Nombre', selectedItem.nombre_sede)}
                {renderInfoCard('Código', selectedItem.codigo_sede)}
              </div>
            </div>

            <div style={modalStyles.section}>
              <h4 style={modalStyles.sectionTitle}>
                <span>🏫</span>
                <span>Información del Colegio</span>
              </h4>
              <div style={modalStyles.grid}>
                {renderInfoCard('Nombre del Colegio', selectedItem.nombre_colegio)}
                {renderInfoCard('Código del Colegio', selectedItem.codigo_colegio)}
                {renderInfoCard('Municipio', selectedItem.nombre_municipio)}
                {renderInfoCard('Código Municipio', selectedItem.codigo_municipio)}
                {renderInfoCard('Departamento', selectedItem.nombre_departamento)}
                {renderInfoCard('Código Departamento', selectedItem.codigo_departamento)}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleAdd = () => {
    setFormData({
      nombre: '',
      codigo: '',
      id_departamento: '',
      id_municipio: '',
      id_colegio: ''
    });
    setFormMode('add');
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item[`nombre_${selectedEntity}`] || '',
      codigo: item[`codigo_${selectedEntity}`] || '',
      id_departamento: item.id_departamento || '',
      id_municipio: item.id_municipio || '',
      id_colegio: item.id_colegio || ''
    });
    setFormMode('edit');
    setShowForm(true);
    setSelectedItem(item);
  };

  const handleDelete = async (item) => {
    if (!confirm('¿Está seguro de que desea eliminar este elemento?')) {
      return;
    }

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'DELETE',
          body: {
            table: selectedEntity,
            id: item[`id_${selectedEntity}`]
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        showErrorModal(result.error);
      } else {
        // Remover el item eliminado de la lista
        setData(data.filter(i => i[`id_${selectedEntity}`] !== item[`id_${selectedEntity}`]));
        showErrorModal('Elemento eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showErrorModal('Error al eliminar el elemento');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: formMode === 'add' ? 'POST' : 'PUT',
          body: {
            table: selectedEntity,
            data: formData,
            id: formMode === 'edit' ? selectedItem[`id_${selectedEntity}`] : undefined
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        showErrorModal(result.error);
      } else {
        showErrorModal(formMode === 'add' ? 'Elemento añadido exitosamente' : 'Elemento actualizado exitosamente');
        setShowForm(false);
        // Actualizar la lista si estamos en modo edición
        if (formMode === 'edit') {
          setData(data.map(item => 
            item[`id_${selectedEntity}`] === selectedItem[`id_${selectedEntity}`] 
              ? { ...item, ...result }
              : item
          ));
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorModal('Error al procesar la solicitud');
    }
  };

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: isMobile ? 'flex-start' : 'center',
        zIndex: 1000,
        overflowY: 'auto',
        padding: isMobile ? '1rem' : '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: isMobile ? '1rem' : '2rem',
          borderRadius: '8px',
          width: isMobile ? '100%' : '90%',
          maxWidth: '500px',
          maxHeight: isMobile ? '100%' : '90vh',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {formMode === 'add' ? 'Añadir' : 'Editar'} {selectedEntity}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Código</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            {selectedEntity !== 'departamento' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>ID Departamento</label>
                <input
                  type="text"
                  value={formData.id_departamento}
                  onChange={(e) => setFormData({ ...formData, id_departamento: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>
            )}
            {(selectedEntity === 'colegio' || selectedEntity === 'sede') && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>ID Municipio</label>
                <input
                  type="text"
                  value={formData.id_municipio}
                  onChange={(e) => setFormData({ ...formData, id_municipio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>
            )}
            {selectedEntity === 'sede' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>ID Colegio</label>
                <input
                  type="text"
                  value={formData.id_colegio}
                  onChange={(e) => setFormData({ ...formData, id_colegio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                {formMode === 'add' ? 'Añadir' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: isMobile ? '0.5rem' : '1rem',
      width: '100%',
      margin: 0
    }}>
      {showError && (
        <div style={{
          position: 'fixed',
          top: '4.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '1rem',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: '90%',
          textAlign: 'center',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {errorMessage}
        </div>
      )}

      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '10px',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch'
      }}>
        <select 
          value={selectedEntity} 
          onChange={handleEntityChange}
          style={{
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: isMobile ? '100%' : '200px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="departamento">Departamento</option>
          <option value="municipio">Municipio</option>
          <option value="colegio">Colegio</option>
          <option value="sede">Sede</option>
        </select>

        <div style={{
          display: 'flex',
          gap: '10px',
          width: isMobile ? '100%' : 'auto',
          flex: isMobile ? 'none' : 1,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o código"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              flex: 1,
              minWidth: isMobile ? '100%' : 'auto'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '10px',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <button onClick={handleSearch} style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flex: isMobile ? 1 : 'none'
            }}>
              <span>🔍</span>
              <span>Buscar</span>
            </button>
            <button onClick={handleAdd} style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flex: isMobile ? 1 : 'none'
            }}>
              <span>➕</span>
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>

      {resultsFound && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => {
              setData(searchResults);
              setResultsFound(false);
            }}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ver resultados
          </button>
        </div>
      )}

      {data.length > 0 && (
        <div style={{ 
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'
        }}>
          {data.map((item) => (
            <div
              key={item.id_departamento || item.id_municipio || item.id_colegio || item.id_sede}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>
                    {item.nombre_departamento || item.nombre_municipio || item.nombre_colegio || item.nombre_sede}
                  </span>
                  <span style={{ color: '#666', fontSize: '0.875rem' }}>
                    {item.codigo_departamento || item.codigo_municipio || item.codigo_colegio || item.codigo_sede}
                  </span>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                justifyContent: isMobile ? 'stretch' : 'flex-start',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: isMobile ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>✏️</span>
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: isMobile ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🗑️</span>
                  <span>Eliminar</span>
                </button>
                <button
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: isMobile ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>👁️</span>
                  <span>Ver</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: isMobile ? '1rem' : '2rem',
          backdropFilter: 'blur(4px)'
        }}>
          {renderModalContent()}
          <button
            onClick={() => setShowModal(false)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'white',
              border: 'none',
              fontSize: '1.25rem',
              color: '#666',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            ×
          </button>
        </div>
      )}

      {renderForm()}
    </div>
  );
};

export default CRUDOperations;