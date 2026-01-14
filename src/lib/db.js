import { supabase } from './supabase';

// Helper for checking if Supabase is configured
const isSupabaseReady = () =>
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'TU_URL_DE_SUPABASE';

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
            const { data, error } = await supabase.from('strategies').select('*');
            if (!error && data.length > 0) {
                // Return mapping
                return data.reduce((acc, s) => ({ ...acc, [s.name]: s.assets }), {});
            }
        }
        const local = localStorage.getItem(DB_KEYS.STRATEGIES);
        return local ? JSON.parse(local) : DEFAULT_STRATEGIES;
    },

    // --- TRANSACTIONS ---
    getTransactions: async () => {
        if (isSupabaseReady()) {
            const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
            if (!error) return data;
        }
        const txs = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
        return txs.reverse(); // Standardized descending
    },

    addTransaction: async (tx) => {
        if (isSupabaseReady()) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('transactions').insert([{
                    ...tx,
                    user_id: user.id
                }]).select();
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
            if (!error) allItems = data;
        } else {
            allItems = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        }

        const results = [];
        allItems.forEach(item => {
            if (item.type === 'INCOME') {
                if (item.target_month === targetMonth || item.targetMonth === targetMonth) results.push(item);
            } else {
                const tMonth = item.target_month || item.targetMonth;
                if (!item.is_installments && !item.isInstallments) {
                    if (tMonth === targetMonth) results.push(item);
                } else {
                    const instCount = item.installments || 1;
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
                // Map frontend keys to DB snake_case
                const dbItem = {
                    user_id: user.id,
                    description: item.description,
                    amount: item.amount,
                    currency: item.currency,
                    exchange_rate: item.exchangeRate,
                    type: item.type,
                    category: item.category,
                    payment_method: item.paymentMethod,
                    is_installments: item.isInstallments,
                    installments: item.installments,
                    target_month: item.targetMonth
                };
                await supabase.from('cashflow').insert([dbItem]);
                return;
            }
        }
        const items = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        items.push({ ...item, id: Date.now().toString() });
        localStorage.setItem(DB_KEYS.CASHFLOW, JSON.stringify(items));
    },

    deleteCashflowItem: async (id) => {
        if (isSupabaseReady()) {
            await supabase.from('cashflow').delete().eq('id', id);
            return;
        }
        const items = JSON.parse(localStorage.getItem(DB_KEYS.CASHFLOW) || '[]');
        localStorage.setItem(DB_KEYS.CASHFLOW, JSON.stringify(items.filter(i => String(i.id) !== String(id))));
    },

    getGlobalLiquidity: async () => {
        const txs = await db.getTransactions();
        // Since we need all cashflow items for liquidity, we fetch them
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
            if (item.type === 'INCOME') liquidity[curr] += Number(item.amount);
            else if (item.type === 'EXPENSE') liquidity[curr] -= Number(item.amount);
        });
        txs.forEach(tx => {
            const curr = tx.currency || 'ARS';
            const cost = Number(tx.qty) * Number(tx.price);
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
