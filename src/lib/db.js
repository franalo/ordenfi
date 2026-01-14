import { supabase } from './supabase';

// Helper for checking if Supabase is configured
const isSupabaseReady = () =>
    supabase !== null &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL.includes('supabase.co');

const DB_KEYS = {
    TRANSACTIONS: 'ordenfi_transactions',
    STRATEGIES: 'ordenfi_strategies',
    ASSETS: 'ordenfi_assets',
    CASHFLOW: 'ordenfi_cashflow'
};

const DEFAULT_STRATEGIES = {
    CONSERVATIVE: [
        { ticker: 'GD30', name: 'Bono Soberano 2030', percentage: 70 },
        { ticker: 'YMCQO', name: 'ON YPF 2026', percentage: 30 }
    ],
    MODERATE: [
        { ticker: 'SPY', name: 'S&P 500 ETF', percentage: 60 },
        { ticker: 'AAPL', name: 'Apple Inc.', percentage: 20 },
        { ticker: 'GD30', name: 'Bono Soberano 2030', percentage: 20 }
    ],
    AGGRESSIVE: [
        { ticker: 'NVDA', name: 'Nvidia Corp', percentage: 40 },
        { ticker: 'TSLA', name: 'Tesla Inc', percentage: 30 },
        { ticker: 'ETH', name: 'Ethereum', percentage: 30 }
    ]
};

export const db = {
    // --- STRATEGIES ---
    getStrategies: async () => {
        if (isSupabaseReady()) {
            try {
                const { data, error } = await supabase.from('strategies').select('*');
                if (!error && data && data.length > 0) {
                    return data.reduce((acc, s) => ({ ...acc, [s.name]: s.assets }), {});
                }
            } catch (e) {
                console.error("Strategies fetch error:", e);
            }
        }
        const local = localStorage.getItem(DB_KEYS.STRATEGIES);
        return local ? JSON.parse(local) : DEFAULT_STRATEGIES;
    },

    // --- TRANSACTIONS ---
    // --- TRANSACTIONS ---
    getTransactions: async () => {
        if (isSupabaseReady()) {
            const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
            if (!error && data) return data;
            console.error("Supabase error:", error);
        }
        const txs = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
        return txs || [];
    },

    addTransaction: async (tx) => {
        if (isSupabaseReady()) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const dbItem = {
                    user_id: user.id,
                    type: tx.type,
                    ticker: tx.ticker.toUpperCase(),
                    qty: Number(tx.qty),
                    price: Number(tx.price),
                    currency: tx.currency || 'ARS',
                    date: tx.date || new Date().toISOString()
                };
                const { data, error } = await supabase.from('transactions').insert([dbItem]).select();
                if (error) console.error("Error saving tx:", error);
                if (!error) return data[0];
            }
        }
        // Fallback Local
        const txs = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
        const newTx = { ...tx, id: Date.now().toString(), date: tx.date || new Date().toISOString() };
        txs.push(newTx);
        localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(txs));
        return newTx;
    },

    deleteTransaction: async (id) => {
        if (isSupabaseReady()) {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            return !error;
        }
        const txs = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
        const filtered = txs.filter(t => String(t.id) !== String(id));
        localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(filtered));
        return true;
    },

    // --- CASHFLOW ---
    getCashflowForMonth: async (targetMonth) => {
        let allItems = [];
        if (isSupabaseReady()) {
            const { data, error } = await supabase.from('cashflow').select('*');
            if (error) console.error("Error fetching cashflow:", error);
            if (!error) allItems = data;
        } else {
            allItems = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        }

        const results = [];
        allItems.forEach(item => {
            const type = item.type;
            const tMonth = item.target_month || item.targetMonth;
            const isInst = item.is_installments || item.isInstallments;
            const instCount = item.installments || 1;

            if (type === 'INCOME') {
                if (tMonth === targetMonth) results.push(item);
            } else {
                if (!isInst) {
                    if (tMonth === targetMonth) results.push(item);
                } else {
                    const start = new Date(tMonth + "-01");
                    const target = new Date(targetMonth + "-01");
                    const diffMonths = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
                    if (diffMonths >= 0 && diffMonths < instCount) {
                        results.push({
                            ...item,
                            currentInstallment: diffMonths + 1,
                            isProjected: diffMonths > 0
                        });
                    }
                }
            }
        });
        return results;
    },

    addCashflowItem: async (item) => {
        if (isSupabaseReady()) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const dbItem = {
                    user_id: user.id,
                    description: item.description,
                    amount: Number(item.amount),
                    currency: item.currency,
                    exchange_rate: item.exchangeRate ? Number(item.exchangeRate) : null,
                    type: item.type,
                    category: item.category,
                    payment_method: item.paymentMethod,
                    is_installments: item.isInstallments,
                    installments: Number(item.installments || 1),
                    target_month: item.targetMonth
                };
                const { error } = await supabase.from('cashflow').insert([dbItem]);
                if (error) console.error("Error saving cashflow:", error);
                return;
            }
        }
        const items = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        items.push({ ...item, id: Date.now().toString() });
        localStorage.setItem(DB_KEYS.CASHFLOW, JSON.stringify(items));
    },

    deleteCashflowItem: async (id) => {
        if (isSupabaseReady()) {
            const { error } = await supabase.from('cashflow').delete().eq('id', id);
            if (error) console.error("Error deleting cashflow:", error);
            return;
        }
        const items = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        localStorage.setItem(DB_KEYS.CASHFLOW, JSON.stringify(items.filter(i => String(i.id) !== String(id))));
    },

    // --- RATES (With Historical Supabase Tracking) ---
    fetchRealRates: async () => {
        const today = new Date().toISOString().split('T')[0];

        // 1. Check if we already have today's rate in Supabase
        if (isSupabaseReady()) {
            const { data } = await supabase
                .from('exchange_rates')
                .select('*')
                .eq('date', today)
                .single();

            if (data) return data.rates;
        }

        // 2. Load 365 days of history if table is empty (Self-healing)
        if (isSupabaseReady()) {
            const { count, error: countErr } = await supabase
                .from('exchange_rates')
                .select('*', { count: 'exact', head: true });

            if (!countErr && (count === 0 || count === null)) {
                console.log("📦 Inyectando historial de 365 días en lotes...");
                const totalDays = 365;
                const chunkSize = 50;

                for (let i = 0; i < totalDays; i += chunkSize) {
                    const chunk = [];
                    for (let j = i + 1; j <= i + chunkSize && j <= totalDays; j++) {
                        const d = new Date();
                        d.setDate(d.getDate() - j);
                        const dStr = d.toISOString().split('T')[0];
                        chunk.push({
                            date: dStr,
                            rates: [
                                { casa: "blue", compra: 1000 + (Math.random() * 50), venta: 1050 + (Math.random() * 50) },
                                { casa: "oficial", compra: 800 + (Math.random() * 20), venta: 850 + (Math.random() * 20) }
                            ]
                        });
                    }
                    await supabase.from('exchange_rates').insert(chunk);
                }
                console.log("✅ Historial completado.");
            }
        }

        // 3. Simple Fallback (No more external API calls as requested)
        return [
            { casa: "blue", compra: 1050, venta: 1100 },
            { casa: "oficial", compra: 850, venta: 900 },
            { casa: "bolsa", compra: 1000, venta: 1040 }
        ];
    },

    getLatestRate: (type = 'blue') => {
        // Mocked latest rates to keep it fast
        const rates = {
            'blue': 1100,
            'bolsa': 1040,
            'oficial': 900
        };
        return rates[type] || 0;
    },

    getGlobalLiquidity: async () => {
        const txs = await db.getTransactions();
        let cashflow = [];
        if (isSupabaseReady()) {
            const { data } = await supabase.from('cashflow').select('*');
            cashflow = data || [];
        } else {
            cashflow = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        }

        let liquidity = { ARS: 0, USD: 0 };
        cashflow.forEach(item => {
            const curr = item.currency || 'ARS';
            const amt = Number(item.amount || 0);
            if (item.type === 'INCOME') liquidity[curr] += amt;
            else if (item.type === 'EXPENSE') liquidity[curr] -= amt;
        });

        txs.forEach(tx => {
            const curr = tx.currency || 'ARS';
            const cost = Number(tx.qty || 0) * Number(tx.price || 0);
            if (tx.type === 'BUY') liquidity[curr] -= cost;
            else if (tx.type === 'SELL') liquidity[curr] += cost;
        });
        return liquidity;
    },

    // --- UTILS ---
    formatCurrency: (value, currency = 'ARS') => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency,
        }).format(value);
    },

    getPrices: async () => {
        // Fast mock data, no external calls
        return {
            'SPY': 15800, 'AAPL': 12400, 'GD30': 45.20, 'YMCQO': 1.05,
            'NVDA': 22500, 'TSLA': 18900, 'ETH': 2450000, 'YPFD': 28500
        };
    },

    getExchangeRate: (dateStr) => {
        const date = new Date(dateStr);
        const refDate = new Date('2024-01-01');
        const daysDiff = (date - refDate) / (1000 * 60 * 60 * 24);
        let estimatedTC = 950 + (daysDiff * 1.5);
        estimatedTC = estimatedTC + (Math.sin(daysDiff * 0.1) * 20);
        return Math.max(1, Math.round(estimatedTC));
    },

    // Auth
    login: async (email, password) => {
        if (isSupabaseReady()) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        }
        const users = JSON.parse(localStorage.getItem('ordenfi_users') || '[]');
        return users.find(u => u.email === email && u.password === password) || null;
    },

    register: async (name, email, password) => {
        if (isSupabaseReady()) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });
            if (error) throw error;
            return data.user;
        }
        const users = JSON.parse(localStorage.getItem('ordenfi_users') || '[]');
        if (users.find(u => u.email === email)) return null;
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('ordenfi_users', JSON.stringify(users));
        return newUser;
    },

    logout: async () => {
        if (isSupabaseReady()) await supabase.auth.signOut();
    }
};
