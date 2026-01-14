import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Save, Plus, Trash2, ArrowLeft, Shield, PieChart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('MODERATE');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getStrategies();
        if (data) setStrategies(data);
      } catch (err) {
        console.error("Admin Load Error:", err);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    try {
      await db.saveStrategies(strategies);
      setMessage('Estrategias guardadas con éxito');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const addAsset = () => {
    if (!strategies || !strategies[activeStrategy]) return;
    const updated = { ...strategies };
    updated[activeStrategy].push({ ticker: '', name: '', percentage: 0 });
    setStrategies(updated);
  };

  const removeAsset = (index) => {
    if (!strategies || !strategies[activeStrategy]) return;
    const updated = { ...strategies };
    updated[activeStrategy].splice(index, 1);
    setStrategies(updated);
  };

  const updateAsset = (index, field, value) => {
    if (!strategies || !strategies[activeStrategy] || !strategies[activeStrategy][index]) return;
    const updated = { ...strategies };
    updated[activeStrategy][index][field] = field === 'percentage' ? parseFloat(value || 0) : value;
    setStrategies(updated);
  };

  if (!strategies) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vibrant-blue)' }}>
      Cargando configuración...
    </div>
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <ArrowLeft size={18} /> Volver
          </button>
          <h1>Configuración de Estrategias</h1>
        </div>
        <button onClick={handleSave} className="save-btn">
          <Save size={18} /> Guardar Cambios
        </button>
      </header>

      {message && <div className="success-banner">{message}</div>}

      <div className="admin-grid">
        <aside className="strategy-sidebar">
          <div className="sidebar-group">
            <h3>Modelos Sugeridos</h3>
            <button className={activeStrategy === 'CONSERVATIVE' ? 'active' : ''} onClick={() => setActiveStrategy('CONSERVATIVE')}>
              <Shield size={18} /> Conservadora
            </button>
            <button className={activeStrategy === 'MODERATE' ? 'active' : ''} onClick={() => setActiveStrategy('MODERATE')}>
              <PieChart size={18} /> Moderada
            </button>
            <button className={activeStrategy === 'AGGRESSIVE' ? 'active' : ''} onClick={() => setActiveStrategy('AGGRESSIVE')}>
              <Zap size={18} /> Agresiva
            </button>
          </div>
        </aside>

        <main className="editor-area card">
          <div className="editor-header">
            <h2>Composición: {activeStrategy}</h2>
            <button onClick={addAsset} className="add-btn"><Plus size={18} /> Añadir Activo</button>
          </div>

          <div className="table-wrapper">
            <table className="editor-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Descripción</th>
                  <th style={{ width: '120px' }}>Porcentaje</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {strategies?.[activeStrategy]?.map((asset, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        value={asset.ticker}
                        onChange={(e) => updateAsset(idx, 'ticker', e.target.value)}
                        placeholder="Ticker"
                      />
                    </td>
                    <td>
                      <input
                        value={asset.name}
                        onChange={(e) => updateAsset(idx, 'name', e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </td>
                    <td>
                      <div className="input-with-label">
                        <input
                          type="number"
                          value={asset.percentage}
                          onChange={(e) => updateAsset(idx, 'percentage', e.target.value)}
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => removeAsset(idx)} className="delete-btn"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-check">
            <span>Total asignado: <strong>{strategies?.[activeStrategy]?.reduce((acc, a) => acc + (a.percentage || 0), 0)}%</strong></span>
            {strategies?.[activeStrategy]?.reduce((acc, a) => acc + (a.percentage || 0), 0) !== 100 &&
              <span className="warning"> El total debe sumar exactamente 100%</span>}
          </div>
        </main>
      </div>

      <style>{`
        .admin-container { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .admin-header {
          display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem;
        }
        .admin-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin-top: 8px; }
        
        .back-btn { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
        .back-btn:hover { color: var(--vibrant-blue); }

        .save-btn {
          background: var(--vibrant-blue); color: white; padding: 12px 24px; border-radius: 12px;
          display: flex; align-items: center; gap: 10px; font-weight: 700; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }
        .save-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }

        .success-banner {
          background: rgba(5, 150, 105, 0.1); color: var(--vibrant-green); padding: 1rem 1.5rem; border-radius: 12px;
          margin-bottom: 2rem; text-align: center; font-weight: 700; border: 1px solid var(--vibrant-green);
        }

        .admin-grid { display: grid; grid-template-columns: 260px 1fr; gap: 2.5rem; }

        .sidebar-group { display: flex; flex-direction: column; gap: 8px; }
        .sidebar-group h3 { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; padding-left: 12px; }
        
        .strategy-sidebar button {
          text-align: left; padding: 14px 16px; border-radius: 12px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 12px; font-weight: 600; transition: all 0.2s;
        }
        .strategy-sidebar button:hover { background: rgba(255,255,255,0.5); }
        .strategy-sidebar button.active {
          background: #fff; color: var(--vibrant-blue); border: 1px solid var(--border); box-shadow: var(--shadow-sm);
        }

        .editor-area { padding: 0; }
        .editor-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .editor-header h2 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .add-btn { color: var(--vibrant-blue); display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.9rem; }
        .add-btn:hover { text-decoration: underline; }

        .table-wrapper { padding: 1.5rem 2rem; }
        .editor-table { width: 100%; border-collapse: collapse; }
        .editor-table th { text-align: left; padding: 12px; color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid var(--border); }
        .editor-table td { padding: 12px; border-bottom: 1px dotted var(--border); }

        .editor-table input {
          background: #fff; border: 1px solid var(--border); color: var(--text-primary);
          padding: 10px; border-radius: 8px; width: 100%; font-size: 0.95rem; font-weight: 500;
        }
        .editor-table input:focus { border-color: var(--vibrant-blue); outline: none; }

        .input-with-label { display: flex; align-items: center; gap: 8px; }
        .input-with-label span { font-weight: 700; color: var(--text-muted); }

        .delete-btn { color: var(--text-muted); transition: color 0.2s; padding: 8px; }
        .delete-btn:hover { color: var(--vibrant-pink); background: rgba(219, 39, 119, 0.05); border-radius: 8px; }
        
        .total-check {
          padding: 1.5rem 2rem; background: var(--bg-card); border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.95rem; color: var(--text-secondary);
        }
        .total-check strong { color: var(--text-primary); }
        .warning { color: var(--vibrant-pink); font-weight: 700; background: rgba(219, 39, 119, 0.05); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }

        @media (max-width: 900px) { .admin-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
