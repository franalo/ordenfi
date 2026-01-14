import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import {
    History, ArrowUpRight, ArrowDownRight,
    Trash2, Briefcase
} from 'lucide-react';

export default function Portfolio() {
    const [transactions, setTransactions] = useState([]);
    const [holdings, setHoldings] = useState({});
    const [liquidity, setLiquidity] = useState({ ARS: 0, USD: 0 });
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const txs = (await db.getTransactions()) || [];
            setTransactions([...txs].reverse());

            const marketPrices = (await db.getPrices()) || {};
            setPrices(marketPrices);

            const agg = txs.reduce((acc, tx) => {
                if (!tx || !tx.ticker) return acc;
                const q = tx.type === 'BUY' ? Number(tx.qty || 0) : -Number(tx.qty || 0);
                const current = acc[tx.ticker] || { qty: 0, invested: 0 };
                acc[tx.ticker] = {
                    qty: current.qty + q,
                    invested: current.invested + (tx.type === 'BUY' ? Number(tx.qty || 0) * Number(tx.price || 0) : -Number(tx.qty || 0) * Number(tx.price || 0))
                };
                return acc;
            }, {});

            const globalLiq = (await db.getGlobalLiquidity()) || { ARS: 0, USD: 0 };
            setLiquidity(globalLiq);
            setHoldings(agg);
        } catch (err) {
            console.error("Portfolio Load Error:", err);
            setTransactions([]);
            setHoldings({});
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar transacción de forma permanente? El capital se reintegrará a tu liquidez.')) {
            const success = await db.deleteTransaction(id);
            if (success) {
                loadData();
            }
        }
    };

    const totalAssetsValue = Object.entries(holdings).reduce((sum, [ticker, data]) => {
        return sum + (data.qty * (prices[ticker] || 0));
    }, 0);

    if (loading) return <div className="loading-screen">Analizando activos y rendimientos...</div>;

    return (
        <div className="portfolio-content">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ color: 'var(--vibrant-violet)' }}>Portafolio Integrado</h1>
                    <p className="subtitle">Visión consolidada de activos y movimientos históricos.</p>
                </div>
                <div className="summary-card card" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', minWidth: '400px', borderTop: '4px solid var(--vibrant-violet)' }}>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>VALOR TOTAL ACTIVOS</span>
                        <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: 900, color: 'var(--vibrant-violet)' }}>{db.formatCurrency(totalAssetsValue)}</span>
                    </div>
                    <div style={{ width: '2px', background: 'var(--border)' }}></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '5px' }}><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>EFECTIVO ARS:</span> <strong style={{ fontSize: '0.9rem' }}>{db.formatCurrency(liquidity.ARS)}</strong></div>
                        <div><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>EFECTIVO USD:</span> <strong style={{ fontSize: '0.9rem' }}>USD {liquidity.USD.toFixed(2)}</strong></div>
                    </div>
                </div>
            </header>

            <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', marginTop: '2rem' }}>
                <div className="card holdings-section">
                    <div className="card-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                        <Briefcase size={20} style={{ color: 'var(--vibrant-blue)' }} />
                        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Tenencias en Cartera</h2>
                    </div>
                    <div className="table-container" style={{ padding: '0 1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVO</th>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>CANTIDAD</th>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>VALUACIÓN</th>
                                    <th style={{ textAlign: 'right', padding: '1.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>RENDIMIENTO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(holdings).filter(([_, data]) => data.qty > 0.0001).map(([ticker, data]) => {
                                    const currentVal = data.qty * (prices[ticker] || 0);
                                    const pnl = currentVal - data.invested;
                                    const pnlPct = (pnl / Math.abs(data.invested || 1)) * 100;
                                    return (
                                        <tr key={ticker} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1.25rem 0', fontWeight: 800 }}>{ticker}</td>
                                            <td style={{ padding: '1.25rem 0' }}>{data.qty.toFixed(4)}</td>
                                            <td style={{ padding: '1.25rem 0', fontWeight: 700 }}>{db.formatCurrency(currentVal)}</td>
                                            <td style={{ padding: '1.25rem 0', textAlign: 'right', fontWeight: 900, color: pnl >= 0 ? 'var(--vibrant-green)' : 'var(--vibrant-pink)' }}>
                                                {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {Object.keys(holdings).length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Sin activos registrados.</div>}
                    </div>
                </div>

                <div className="card history-section">
                    <div className="card-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                        <History size={20} style={{ color: 'var(--vibrant-violet)' }} />
                        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Cronograma de Operaciones</h2>
                    </div>
                    <div className="history-list" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
                        {transactions.map((tx) => (
                            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: tx.type === 'BUY' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '8px' }}>
                                    {tx.type === 'BUY' ? <ArrowUpRight size={16} color="#166534" /> : <ArrowDownRight size={16} color="#991b1b" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: 'block', fontWeight: 800, fontSize: '1rem' }}>{tx.ticker}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ textAlign: 'right', marginRight: '30px' }}>
                                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{tx.qty.toFixed(4)} u.</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{db.formatCurrency(tx.price, tx.currency)}</span>
                                </div>
                                <button onClick={() => handleDelete(tx.id)} style={{ position: 'absolute', right: '10px', color: 'var(--text-muted)', padding: '5px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {transactions.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Sin movimientos.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
