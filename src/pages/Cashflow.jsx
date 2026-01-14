import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import {
    Plus, TrendingUp, Calendar, Trash2,
    ArrowRight, Landmark, ArrowDownCircle, ArrowUpCircle, CreditCard, Wallet, Banknote
} from 'lucide-react';

export default function Cashflow() {
    const [items, setItems] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));

    // Form States
    const [type, setType] = useState('EXPENSE');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ARS');
    const [exchangeRate, setExchangeRate] = useState(''); // New Exchange Rate State
    const [isInstallments, setIsInstallments] = useState(false);
    const [installments, setInstallments] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
    const [category, setCategory] = useState('');

    useEffect(() => {
        async function load() {
            const data = await db.getCashflowForMonth(month);
            setItems(data);
        }
        load();
    }, [month]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!description || !amount) return;

        const newItem = {
            type,
            description,
            amount: parseFloat(amount),
            currency,
            exchangeRate: currency === 'USD' ? parseFloat(exchangeRate) : null,
            category: category || 'General',
            isInstallments: type === 'EXPENSE' ? isInstallments : false,
            installments: type === 'EXPENSE' ? (isInstallments ? parseInt(installments) : 1) : 1,
            paymentMethod,
            targetMonth: month
        };

        const run = async () => {
            await db.addCashflowItem(newItem);
            const data = await db.getCashflowForMonth(month);
            setItems(data);
        };
        run();

        // Reset
        setDescription('');
        setAmount('');
        setCategory('');
        setIsInstallments(false);
        setInstallments(1);
    };

    const handleDelete = async (id) => {
        await db.deleteCashflowItem(id);
        const data = await db.getCashflowForMonth(month);
        setItems(data);
    };

    // Calculate Totals by Currency
    const totals = items.reduce((acc, item) => {
        const curr = item.currency || 'ARS';
        if (!acc[curr]) acc[curr] = { income: 0, expense: 0 };

        if (item.type === 'INCOME') acc[curr].income += item.amount;
        else acc[curr].expense += item.amount;

        return acc;
    }, { ARS: { income: 0, expense: 0 }, USD: { income: 0, expense: 0 } });

    const balanceARS = (totals.ARS?.income || 0) - (totals.ARS?.expense || 0);
    const balanceUSD = (totals.USD?.income || 0) - (totals.USD?.expense || 0);

    return (
        <div className="cashflow-container">
            <header className="cashflow-header">
                <div>
                    <h1>Planificador de Flujo</h1>
                    <p className="subtitle">Gestiona tus ingresos y gastos en Pesos y Dólares.</p>
                </div>
                <div className="month-picker">
                    <Calendar size={18} className="text-primary" />
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />
                </div>
            </header>

            <div className="cashflow-stats">
                <div className="stat-card income">
                    <div className="stat-icon"><ArrowUpCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Ingresos</span>
                        <div className="dual-value">
                            <span className="val-ars">{db.formatCurrency(totals.ARS?.income || 0)}</span>
                            <span className="val-usd">USD {(totals.USD?.income || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card expense">
                    <div className="stat-icon"><ArrowDownCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Gastos</span>
                        <div className="dual-value">
                            <span className="val-ars">{db.formatCurrency(totals.ARS?.expense || 0)}</span>
                            <span className="val-usd">USD {(totals.USD?.expense || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card balance">
                    <div className="stat-icon"><Landmark size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Saldo Libre</span>
                        <div className="dual-value">
                            <span className={`val-ars ${balanceARS >= 0 ? 'pos' : 'neg'}`}>{db.formatCurrency(balanceARS)}</span>
                            <span className={`val-usd ${balanceUSD >= 0 ? 'pos' : 'neg'}`}>USD {balanceUSD.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cashflow-main-grid">
                <div className="form-section">
                    <div className="card form-premium-card">
                        <div className="card-header-premium">
                            <h2>Nuevo Movimiento</h2>
                        </div>
                        <form onSubmit={handleAdd} className="premium-form">
                            <div className="auth-toggle">
                                <button
                                    type="button"
                                    className={type === 'INCOME' ? 'active income' : ''}
                                    onClick={() => setType('INCOME')}
                                >Ingreso</button>
                                <button
                                    type="button"
                                    className={type === 'EXPENSE' ? 'active expense' : ''}
                                    onClick={() => setType('EXPENSE')}
                                >Egreso</button>
                            </div>

                            <div className="input-group-premium">
                                <label>Descripción</label>
                                <input
                                    placeholder="Alquiler, Sueldo, Venta USD..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="row-premium">
                                <div className="input-group-premium" style={{ flex: 1 }}>
                                    <label>Monto</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group-premium" style={{ width: '100px' }}>
                                    <label>Moneda</label>
                                    <select value={currency} onChange={e => {
                                        setCurrency(e.target.value);
                                        if (e.target.value === 'USD') {
                                            // Auto-suggest TC based on selected month (assuming 1st of month)
                                            setExchangeRate(db.getExchangeRate(month + '-01'));
                                        }
                                    }}>
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                {currency === 'USD' && (
                                    <div className="input-group-premium" style={{ width: '120px' }}>
                                        <label>TC (ARS/USD)</label>
                                        <input
                                            type="number"
                                            value={exchangeRate}
                                            onChange={e => setExchangeRate(e.target.value)}
                                            placeholder="Ej: 1150"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="input-group-premium">
                                <label>Categoría</label>
                                <input
                                    placeholder="Ocio, Hogar, Comida..."
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                />
                            </div>

                            <div className="input-group-premium">
                                <label>Medio de Pago</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="DEBITO">Débito Automático</option>
                                    <option value="VISA">Tarjeta VISA</option>
                                    <option value="MASTER">Tarjeta Mastercard</option>
                                    <option value="AMEX">Tarjeta AMEX</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>

                            {type === 'EXPENSE' && (
                                <div className="expense-extras">
                                    <label className="checkbox-premium">
                                        <input
                                            type="checkbox"
                                            checked={isInstallments}
                                            onChange={e => setIsInstallments(e.target.checked)}
                                        />
                                        <span>Compra en cuotas</span>
                                    </label>

                                    {isInstallments && (
                                        <div className="row-premium">
                                            <div className="input-group-premium">
                                                <label>Cant. Cuotas</label>
                                                <input
                                                    type="number"
                                                    min="2"
                                                    value={installments}
                                                    onChange={e => setInstallments(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button type="submit" className={`submit-premium ${type.toLowerCase()}`}>
                                Registrar {type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                            </button>
                        </form>
                    </div>

                    {balanceARS > 0 && (
                        <div className="card invest-promo">
                            <div className="promo-content">
                                <TrendingUp size={32} className="text-primary" />
                                <div>
                                    <h3>Excedente en Pesos</h3>
                                    <p>Tenés {db.formatCurrency(balanceARS)} disponibles. ¿Invertimos?</p>
                                </div>
                            </div>
                            <button className="btn-go-invest" onClick={() => window.location.href = '/dashboard?invest=' + balanceARS}>
                                Invertir Remanente <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="list-section">
                    <div className="card glassy-card list-container">
                        <div className="card-header-premium">
                            <h2>Movimientos de {new Date(month + "-02").toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                        </div>
                        <div className="items-scroll">
                            {items.map(item => (
                                <div key={item.id} className="item-row-premium">
                                    <div className={`item-indicator ${item.type.toLowerCase()}`}>
                                        {item.paymentMethod.includes('VISA') || item.paymentMethod.includes('MASTER') ? <CreditCard size={16} /> : <Banknote size={16} />}
                                    </div>
                                    <div className="item-main">
                                        <span className="item-desc">
                                            {item.description}
                                            {item.isProjected && <span className="projected-tag">Proyectado</span>}
                                        </span>
                                        <span className="item-meta">{item.category} • {item.paymentMethod} • {item.currency || 'ARS'}</span>
                                    </div>
                                    <div className="item-value-col">
                                        <span className={`item-amt ${item.type.toLowerCase()}`}>
                                            {item.type === 'INCOME' ? '+' : '-'}
                                            {item.currency === 'USD' ? 'USD ' + item.amount.toFixed(2) : db.formatCurrency(item.amount)}
                                        </span>
                                        {item.isInstallments && (
                                            <span className="item-badge">Cuota {item.currentInstallment || 1}/{item.installments}</span>
                                        )}
                                    </div>
                                    {!item.isProjected && (
                                        <button onClick={() => handleDelete(item.id)} className="btn-action-del">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="empty-placeholder">
                                    <p>No hay movimientos este mes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cashflow-container { animation: fadeIn 0.5s ease-out; }
                .cashflow-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .cashflow-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
                
                .month-picker { 
                  display: flex; align-items: center; gap: 12px; 
                  background: #fff; padding: 10px 20px; 
                  border-radius: 14px; border: 1px solid var(--border);
                  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .month-picker input { background: transparent; border: none; color: var(--text-primary); font-weight: 700; outline: none; }

                .cashflow-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { 
                  background: var(--bg-card); padding: 1.5rem; border-radius: 20px; 
                  border: 1px solid var(--border); display: flex; align-items: center; gap: 1rem;
                  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .stat-info .label { display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; font-weight: 600; }
                
                .dual-value { display: flex; flex-direction: column; }
                .val-ars { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
                .val-usd { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
                .val-ars.pos, .val-usd.pos { color: var(--vibrant-green); }
                .val-ars.neg, .val-usd.neg { color: var(--accent-danger); }
                
                .stat-card.income .stat-icon { background: rgba(16, 185, 129, 0.1); color: var(--vibrant-green); }
                .stat-card.expense .stat-icon { background: rgba(239, 68, 68, 0.1); color: var(--vibrant-pink); }
                .stat-card.balance .stat-icon { background: rgba(59, 130, 246, 0.1); color: var(--vibrant-blue); }

                .cashflow-main-grid { display: grid; grid-template-columns: 420px 1fr; gap: 2rem; }
                
                .card { background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
                .card-header-premium { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.5); }
                .card-header-premium h2 { font-size: 1.1rem; color: var(--text-primary); font-weight: 700; }

                .premium-form { padding: 2rem; }
                .auth-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem; }
                .auth-toggle button { padding: 12px; border-radius: 12px; background: #fff; color: var(--text-secondary); font-weight: 700; border: 1px solid var(--border); transition: all 0.2s; }
                .auth-toggle button.active.income { background: rgba(16, 185, 129, 0.1); color: var(--vibrant-green); border-color: var(--vibrant-green); }
                .auth-toggle button.active.expense { background: rgba(239, 68, 68, 0.1); color: var(--vibrant-pink); border-color: var(--vibrant-pink); }

                .input-group-premium { margin-bottom: 1.25rem; }
                .input-group-premium label { display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; font-weight: 700; }
                .input-group-premium input, .input-group-premium select { 
                  width: 100%; padding: 12px; background: #fff; 
                  border: 1px solid var(--border); border-radius: 12px; color: var(--text-primary);
                  font-size: 0.95rem; outline: none; transition: all 0.2s;
                }
                .input-group-premium input:focus, .input-group-premium select:focus {
                  border-color: var(--vibrant-blue); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .row-premium { display: flex; gap: 1rem; }
                .checkbox-premium { display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-secondary); margin-bottom: 1rem; font-weight: 500; }

                .submit-premium { width: 100%; padding: 15px; border-radius: 14px; font-weight: 700; margin-top: 1rem; transition: all 0.2s; border: none; }
                .submit-premium.income { background: var(--vibrant-green); color: white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }
                .submit-premium.expense { background: var(--vibrant-pink); color: white; box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2); }
                .submit-premium:hover { transform: translateY(-2px); }

                .invest-promo { background: #fff; padding: 1.5rem; margin-top: 1.5rem; border: 1px solid var(--vibrant-blue); }
                .promo-content { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .promo-content h3 { color: var(--text-primary); font-size: 1.1rem; font-weight: 700; }
                .promo-content p { color: var(--text-secondary); font-size: 0.85rem; }
                .btn-go-invest { background: var(--vibrant-blue); color: white; padding: 10px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }

                .items-scroll { max-height: 550px; overflow-y: auto; padding: 1rem; }
                .item-row-premium { 
                  display: flex; align-items: center; gap: 1rem; padding: 1rem; 
                  background: #fff; border-radius: 16px; 
                  margin-bottom: 10px; border: 1px solid transparent;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                  transition: all 0.2s;
                }
                .item-row-premium:hover { border-color: var(--border); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
                
                .item-indicator { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .item-indicator.income { background: rgba(16, 185, 129, 0.1); color: var(--vibrant-green); }
                .item-indicator.expense { background: rgba(239, 68, 68, 0.1); color: var(--vibrant-pink); }
                
                .item-main { flex: 1; display: flex; flex-direction: column; }
                .item-desc { color: var(--text-primary); font-weight: 600; display: flex; align-items: center; gap: 8px; }
                .projected-tag { font-size: 0.6rem; background: var(--bg-primary); padding: 2px 6px; border-radius: 4px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; }
                .item-meta { font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; }
                
                .item-value-col { text-align: right; display: flex; flex-direction: column; }
                .item-amt { font-weight: 700; font-size: 1rem; }
                .item-amt.income { color: var(--vibrant-green); }
                .item-amt.expense { color: var(--vibrant-pink); }
                .item-badge { background: rgba(59, 130, 246, 0.1); color: var(--vibrant-blue); font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; width: fit-content; margin-left: auto; }

                .btn-action-del { color: var(--text-muted); padding: 8px; border-radius: 10px; transition: all 0.2s; }
                .btn-action-del:hover { color: var(--accent-danger); background: rgba(239, 68, 68, 0.1); }
                
                .empty-placeholder { text-align: center; color: var(--text-muted); padding: 2rem; }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
