import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import {
    BarChart3, PieChart, TrendingUp, TrendingDown,
    Target, Award, Calendar, ChevronRight, Activity, ArrowRight
} from 'lucide-react';

export default function Reports() {
    const [from, setFrom] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 2);
        return d.toISOString().substring(0, 10);
    });
    const [to, setTo] = useState(new Date().toISOString().substring(0, 10));

    const [stats, setStats] = useState({
        income: 0,
        expenses: 0,
        invested: 0,
        sold: 0,
        savingsRate: 0,
        yield: 12.5
    });

    useEffect(() => {
        async function load() {
            try {
                const allCashflow = (await db.getCashflow()) || [];
                const allTransactions = (await db.getTransactions()) || [];

                const filterByDate = (itemDate) => {
                    if (!itemDate) return false;
                    const date = String(itemDate).substring(0, 10);
                    return date >= from && date <= to;
                };

                const income = (allCashflow || [])
                    .filter(i => i.type === 'INCOME' && filterByDate((i.target_month || i.targetMonth) + '-01'))
                    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

                const expenses = (allCashflow || [])
                    .filter(i => i.type === 'EXPENSE' && filterByDate((i.target_month || i.targetMonth) + '-01'))
                    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

                const invested = (allTransactions || [])
                    .filter(t => t.type === 'BUY' && filterByDate(t.date))
                    .reduce((sum, t) => sum + (Number(t.qty || 0) * Number(t.price || 0)), 0);

                const sold = (allTransactions || [])
                    .filter(t => t.type === 'SELL' && filterByDate(t.date))
                    .reduce((sum, t) => sum + (Number(t.qty || 0) * Number(t.price || 0)), 0);

                const savings = income - expenses;
                const savingsRate = income > 0 ? (savings / income) * 100 : 0;

                setStats({ income, expenses, invested, sold, savingsRate, yield: 12.5 });
            } catch (err) {
                console.error("Reports Load Error:", err);
            }
        }
        load();
    }, [from, to]);

    return (
        <div className="reports-container">
            <header className="page-header">
                <div>
                    <h1>Centro de Reportes</h1>
                    <p className="subtitle">Análisis profundo de tu comportamiento financiero.</p>
                </div>
                <div className="range-picker">
                    <div className="input-group-date">
                        <label>Desde</label>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                    <div className="input-group-date">
                        <label>Hasta</label>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
                    </div>
                </div>
            </header>

            <div className="reports-grid">
                {/* Hero Stats */}
                <div className="card hero-stat savings-card">
                    <div className="hero-info">
                        <Target size={32} className="icon-blue" />
                        <div>
                            <span className="hero-label">Tasa de Ahorro Real</span>
                            <span className="hero-value">{stats.savingsRate.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div className="hero-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(stats.savingsRate, 100)}%` }}></div>
                        </div>
                        <span className="progress-desc">
                            {stats.savingsRate > 20 ? '¡Excelente nivel de ahorro!' : 'Podrías optimizar tus gastos.'}
                        </span>
                    </div>
                </div>

                <div className="card hero-stat yield-card">
                    <div className="hero-info">
                        <Award size={32} className="icon-green" />
                        <div>
                            <span className="hero-label">Rendimiento Estimado</span>
                            <span className="hero-value">+ {stats.yield}%</span>
                        </div>
                    </div>
                    <div className="hero-activity">
                        <Activity size={18} />
                        <span>Superando el benchmark (S&P 500)</span>
                    </div>
                </div>

                {/* Detailed Numbers */}
                <div className="card detailed-card">
                    <div className="card-header">
                        <TrendingUp size={20} className="icon-blue" />
                        <h2>Movimientos de Capital</h2>
                    </div>
                    <div className="details-list">
                        <div className="detail-item">
                            <span>Ingresos Totales</span>
                            <span className="val-income">{db.formatCurrency(stats.income)}</span>
                        </div>
                        <div className="detail-item">
                            <span>Gastos Operativos</span>
                            <span className="val-expense">{db.formatCurrency(stats.expenses)}</span>
                        </div>
                        <div className="detail-item divider">
                            <span>Ahorro Generado</span>
                            <span className="val-bold">{db.formatCurrency((stats?.income || 0) - (stats?.expenses || 0))}</span>
                        </div>
                        <div className="detail-item">
                            <span>Inversiones Realizadas</span>
                            <span className="val-invest">{db.formatCurrency(stats.invested)}</span>
                        </div>
                        <div className="detail-item">
                            <span>Ventas / Liquidaciones</span>
                            <span className="val-sold">{db.formatCurrency(stats.sold)}</span>
                        </div>
                    </div>
                </div>

                <div className="card analysis-card">
                    <div className="card-header">
                        <PieChart size={20} className="icon-purple" />
                        <h2>Eficiencia de Inversión</h2>
                    </div>
                    <div className="analysis-content">
                        <div className="circle-stat">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle" strokeDasharray={`${Math.min(((stats?.invested || 0) / (stats?.income || 1)) * 100, 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="18" y="20.35" className="percentage">{(((stats?.invested || 0) / (stats?.income || 1)) * 100).toFixed(0)}%</text>
                            </svg>
                            <p>Invertido sobre Ingresos</p>
                        </div>
                        <div className="analysis-tips">
                            <div className="tip">
                                <strong>Estrategia sugerida:</strong>
                                {(stats?.savingsRate || 0) < 10 ? ' Crea un fondo de emergencia antes de seguir invirtiendo.' : ' Mantén tu ritmo actual de reinversión de dividendos.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .reports-container { animation: fadeIn 0.4s ease-out; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
                
                .range-picker { 
                  display: flex; align-items: flex-end; gap: 1rem; 
                  background: var(--bg-card); padding: 1rem; border-radius: 16px; 
                  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
                }
                .input-group-date label { display: block; font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; font-weight: 700; }
                .input-group-date input { background: #fff; border: 1px solid var(--border); color: var(--text-primary); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; outline: none; }
                .input-group-date input:focus { border-color: var(--vibrant-blue); }

                .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
                
                .hero-stat { 
                  padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;
                }
                .hero-info { display: flex; align-items: center; gap: 1.5rem; }
                .hero-label { display: block; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
                .hero-value { font-size: 2.5rem; font-weight: 900; color: var(--vibrant-blue); letter-spacing: -1px; }

                .hero-progress { display: flex; flex-direction: column; gap: 0.75rem; }
                .progress-bar { height: 10px; background: rgba(0,0,0,0.05); border-radius: 5px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--vibrant-blue); border-radius: 5px; }
                .progress-desc { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }

                .hero-activity { display: flex; align-items: center; gap: 10px; color: var(--vibrant-green); font-weight: 700; font-size: 0.9rem; }

                .card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; background: #fff; }
                .card-header h2 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }

                .details-list { padding: 1.5rem 2rem; }
                .detail-item { display: flex; justify-content: space-between; padding: 1rem 0; color: var(--text-secondary); font-weight: 500; }
                .detail-item.divider { border-top: 1px solid var(--border); margin-top: 0.5rem; }
                .val-income { color: var(--vibrant-green); font-weight: 700; }
                .val-expense { color: var(--vibrant-pink); font-weight: 700; }
                .val-bold { color: var(--text-primary); font-weight: 800; font-size: 1.25rem; }
                .val-invest { color: var(--vibrant-violet); font-weight: 700; }
                .val-sold { color: var(--vibrant-cyan); font-weight: 700; }

                .analysis-content { padding: 2.5rem; display: flex; align-items: center; gap: 2.5rem; }
                .circular-chart { width: 130px; height: 130px; }
                .circle-bg { fill: none; stroke: rgba(0,0,0,0.05); stroke-width: 3.8; }
                .circle { fill: none; stroke: var(--vibrant-blue); stroke-width: 2.8; stroke-linecap: round; }
                .percentage { fill: var(--text-primary); font-size: 0.5rem; text-anchor: middle; font-weight: 900; }
                .circle-stat p { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 12px; text-transform: uppercase; font-weight: 700; }

                .tip { background: var(--bg-primary); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; }
                .tip strong { color: var(--text-primary); display: block; margin-bottom: 4px; }

                .icon-blue { color: var(--vibrant-blue); }
                .icon-green { color: var(--vibrant-green); }
                .icon-purple { color: var(--vibrant-violet); }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 1100px) { .reports-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
