import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/db';
import {
    TrendingUp, PieChart, ArrowUpRight, ArrowDownRight,
    Activity, RefreshCw, ShoppingCart, Calculator, Zap, Shield, Info
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const [stats, setStats] = useState({ totalBalance: 0, liquidity: { ARS: 0, USD: 0 } });
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [strategies, setStrategies] = useState(null);
    const [activeStrategyType, setActiveStrategyType] = useState('MODERATE');
    const [prices, setPrices] = useState({});
    const [realRates, setRealRates] = useState(null);

    // Form State
    const [opType, setOpType] = useState('BUY');
    const [ticker, setTicker] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [opCurrency, setOpCurrency] = useState('ARS');
    const [montoInversion, setMontoInversion] = useState('');

    const loadDashboardData = useCallback(async () => {
        const marketPrices = await db.getPrices();
        const txs = await db.getTransactions();
        const globalLiq = await db.getGlobalLiquidity();

        setPrices(marketPrices);

        const agg = txs.reduce((acc, tx) => {
            const q = tx.type === 'BUY' ? Number(tx.qty) : -Number(tx.qty);
            acc[tx.ticker] = (acc[tx.ticker] || 0) + q;
            return acc;
        }, {});

        const holdingsList = Object.entries(agg)
            .filter(([_, q]) => q > 0.0001)
            .map(([t, q]) => ({
                ticker: t,
                qty: q,
                price: marketPrices[t] || 0,
                value: q * (marketPrices[t] || 0)
            }))
            .sort((a, b) => b.value - a.value);

        setHoldings(holdingsList);
        setStats({
            totalBalance: holdingsList.reduce((sum, h) => sum + h.value, 0),
            liquidity: globalLiq
        });
    }, []);

    useEffect(() => {
        async function init() {
            setLoading(true);
            await loadDashboardData();
            const strats = await db.getStrategies();
            setStrategies(strats);
            const rates = await db.fetchRealRates();
            if (rates) setRealRates(rates);
            const invest = searchParams.get('invest');
            if (invest) setMontoInversion(invest);
            setLoading(false);
        }
        init();
    }, [searchParams, loadDashboardData]);

    const handleTransaction = async (e) => {
        e.preventDefault();
        if (!ticker || !qty || !price) return;

        await db.addTransaction({
            type: opType,
            ticker: ticker.toUpperCase(),
            qty: parseFloat(qty),
            price: parseFloat(price),
            currency: opCurrency
        });

        setTicker(''); setQty(''); setPrice('');
        loadDashboardData();
    };

    const buyRecommended = async () => {
        const amount = parseFloat(montoInversion);
        if (!amount || amount <= 0) return alert("Ingresa un monto válido.");
        if (amount > stats.liquidity.ARS) return alert("Liquidez insuficiente en ARS.");

        if (!confirm(`¿Ejecutar inversión de ${db.formatCurrency(amount)}?`)) return;

        const strat = strategies[activeStrategyType];
        for (const asset of strat) {
            const shareAmount = amount * (asset.percentage / 100);
            const assetPrice = prices[asset.ticker] || 100;
            await db.addTransaction({
                type: 'BUY',
                ticker: asset.ticker,
                qty: shareAmount / assetPrice,
                price: assetPrice,
                currency: 'ARS'
            });
        }

        setMontoInversion('');
        loadDashboardData();
        alert("Portafolio ejecutado con éxito.");
    };

    if (loading) return <div className="loading-screen">OrdenFi: Sincronizando mercados...</div>;

    return (
        <div className="dashboard-content">
            <header className="page-header">
                <div>
                    <h1 style={{ color: 'var(--vibrant-violet)' }}>Panel Premium</h1>
                    <p className="subtitle">Gestión algorítmica y análisis de capital.</p>
                </div>
                <div className="header-stats" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="stat-pill card" style={{ padding: '1rem', borderTop: '4px solid var(--vibrant-blue)' }}>
                        <span className="label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>PATRIMONIO TOTAL</span>
                        <span className="value" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--vibrant-blue)' }}>{db.formatCurrency(stats.totalBalance)}</span>
                    </div>
                    <div className="stat-pill card" style={{ padding: '1rem', borderTop: '4px solid var(--vibrant-green)' }}>
                        <span className="label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>LIQUIDEZ ARS</span>
                        <span className="value" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--vibrant-green)' }}>{db.formatCurrency(stats.liquidity.ARS)}</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
                <div className="main-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card operations-card">
                        <div className="card-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                            <Activity size={20} style={{ color: 'var(--vibrant-blue)' }} />
                            <h2 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Registrar Operación</h2>
                        </div>

                        <form className="operation-form" style={{ padding: '1.5rem' }} onSubmit={handleTransaction}>
                            <div className="type-toggle" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                                <button type="button" onClick={() => setOpType('BUY')} style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, border: opType === 'BUY' ? '2px solid var(--vibrant-green)' : '2px solid var(--border)', color: opType === 'BUY' ? 'var(--vibrant-green)' : 'var(--text-muted)' }}>COMPRA</button>
                                <button type="button" onClick={() => setOpType('SELL')} style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, border: opType === 'SELL' ? '2px solid var(--vibrant-pink)' : '2px solid var(--border)', color: opType === 'SELL' ? 'var(--vibrant-pink)' : 'var(--text-muted)' }}>VENTA</button>
                            </div>

                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Activo</label>
                                    {opType === 'SELL' ? (
                                        <select value={ticker} onChange={e => setTicker(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }}>
                                            <option value="">Seleccionar...</option>
                                            {holdings.map(h => <option key={h.ticker} value={h.ticker}>{h.ticker}</option>)}
                                        </select>
                                    ) : (
                                        <input placeholder="AAPL, SPY..." value={ticker} onChange={e => setTicker(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }} />
                                    )}
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Cantidad</label>
                                    <input type="number" step="any" value={qty} onChange={e => setQty(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Precio</label>
                                    <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Moneda</label>
                                    <select value={opCurrency} onChange={e => setOpCurrency(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }}>
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '12px', color: 'white', background: opType === 'BUY' ? 'var(--vibrant-green)' : 'var(--vibrant-pink)', fontWeight: 800, fontSize: '1rem' }}>
                                CONFIRMAR {opType === 'BUY' ? 'COMPRA' : 'VENTA'}
                            </button>
                        </form>
                    </div>

                    <div className="card holdings-card">
                        <div className="card-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                            <PieChart size={20} style={{ color: 'var(--vibrant-violet)' }} />
                            <h2 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Distribución de Activos</h2>
                        </div>
                        <div className="holdings-list" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {holdings.length > 0 ? holdings.map((h) => (
                                <div key={h.ticker} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{h.ticker}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{h.qty.toFixed(4)} unidades</span>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, color: 'var(--vibrant-blue)' }}>{db.formatCurrency(h.value)}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${h.price} / u.</span>
                                    </div>
                                </div>
                            )) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay posiciones abiertas.</div>}
                        </div>
                    </div>
                </div>

                <div className="side-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card strategy-card" style={{ background: 'var(--vibrant-violet)', color: 'white', border: 'none' }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Zap size={20} />
                                <h2 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>ESTRATEGIA ORDENFI</h2>
                            </div>

                            <div className="strat-tabs" style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                {['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'].map(type => (
                                    <button key={type} onClick={() => setActiveStrategyType(type)} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, color: activeStrategyType === type ? 'var(--vibrant-violet)' : 'white', background: activeStrategyType === type ? 'white' : 'transparent' }}>
                                        {type.slice(0, 4)}
                                    </button>
                                ))}
                            </div>

                            <div className="calc" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Monto a Invertir (ARS)</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0 12px' }}>
                                    <Calculator size={16} />
                                    <input type="number" value={montoInversion} onChange={e => setMontoInversion(e.target.value)} style={{ background: 'transparent', border: 'none', padding: '12px', color: 'white', fontWeight: 700, width: '100%' }} />
                                </div>
                            </div>

                            <div className="allocations" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                                {strategies && strategies[activeStrategyType].map(asset => {
                                    const amt = (parseFloat(montoInversion) || 0) * (asset.percentage / 100);
                                    return (
                                        <div key={asset.ticker} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: 700 }}>{asset.ticker} ({asset.percentage}%)</span>
                                            <span style={{ fontWeight: 800 }}>{db.formatCurrency(amt)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={buyRecommended} disabled={!montoInversion} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'white', color: 'var(--vibrant-violet)', fontWeight: 900, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                EJECUTAR PORTAFOLIO
                            </button>
                        </div>
                    </div>

                    <div className="card prices-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>TIPOS DE CAMBIO</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>MEP</span><strong style={{ fontSize: '1.2rem', color: 'var(--vibrant-green)' }}>${db.getLatestRate('bolsa')}</strong></div>
                            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BLUE</span><strong style={{ fontSize: '1.2rem', color: 'var(--vibrant-green)' }}>${db.getLatestRate('blue')}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
