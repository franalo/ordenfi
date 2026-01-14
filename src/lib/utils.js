export const mockLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password) {
                resolve({ name: 'Fernando', email, token: 'mock-token-123' });
            } else {
                reject(new Error('Credenciales inválidas'));
            }
        }, 1000);
    });
};

export const STRATEGIES = {
    CONSERVATIVE: 'Conservador',
    MODERATE: 'Moderado',
    AGGRESSIVE: 'Agresivo',
};

export const calculateAllocation = (amount, strategy) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return null;

    switch (strategy) {
        case STRATEGIES.CONSERVATIVE:
            return [
                { asset: 'Obligaciones Negociables (ONs)', percentage: 60, amount: numericAmount * 0.60, color: '#10b981' },
                { asset: 'Bonos Soberanos / T-Bills', percentage: 30, amount: numericAmount * 0.30, color: '#3b82f6' },
                { asset: 'CEDEARs (S&P 500)', percentage: 10, amount: numericAmount * 0.10, color: '#f59e0b' },
            ];
        case STRATEGIES.MODERATE:
            return [
                { asset: 'CEDEARs (SPY/QQQ)', percentage: 50, amount: numericAmount * 0.50, color: '#3b82f6' },
                { asset: 'Obligaciones Negociables', percentage: 30, amount: numericAmount * 0.30, color: '#10b981' },
                { asset: 'Liquidez / Money Market', percentage: 20, amount: numericAmount * 0.20, color: '#64748b' },
            ];
        case STRATEGIES.AGGRESSIVE:
            return [
                { asset: 'CEDEARs (Tech/Growth)', percentage: 70, amount: numericAmount * 0.70, color: '#ef4444' },
                { asset: 'Criptomonedas / Riesgo', percentage: 15, amount: numericAmount * 0.15, color: '#8b5cf6' },
                { asset: 'CEDEARs (Emergentes)', percentage: 15, amount: numericAmount * 0.15, color: '#f59e0b' },
            ];
        default:
            return [];
    }
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(value);
};
