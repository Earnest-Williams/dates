import { useState } from 'react';
import { useGameStore } from '../state/store';
import { ASSETS } from '../data/investments';
import './InvestmentApp.css';

const InvestmentApp = ({ onClose }) => {
  const { gameState, buyAsset, sellAsset } = useGameStore();
  const { portfolio, assetPrices, priceHistories } = gameState;
  const { money, finance } = gameState.stats;

  // Local state to keep track of trade quantities
  const [quantities, setQuantities] = useState({
    omni: 1,
    gym: 5,
    lnup: 5,
    shib: 100,
    eths: 10
  });

  const handleQtyChange = (assetId, val) => {
    const qty = Math.max(1, parseInt(val) || 0);
    setQuantities(prev => ({
      ...prev,
      [assetId]: qty
    }));
  };

  const calculatePortfolioValue = () => {
    let holdingsValue = 0;
    Object.keys(portfolio).forEach(assetId => {
      const owned = portfolio[assetId]?.quantity || 0;
      const currentPrice = assetPrices[assetId] || 0;
      holdingsValue += owned * currentPrice;
    });
    return holdingsValue;
  };

  const getHoldingsProfitLoss = () => {
    let totalCost = 0;
    let currentValue = 0;
    Object.keys(portfolio).forEach(assetId => {
      const owned = portfolio[assetId]?.quantity || 0;
      const avgPrice = portfolio[assetId]?.avgPrice || 0;
      const currentPrice = assetPrices[assetId] || 0;
      totalCost += owned * avgPrice;
      currentValue += owned * currentPrice;
    });
    return currentValue - totalCost;
  };

  const renderSparkline = (prices) => {
    if (!prices || prices.length < 2) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const width = 110;
    const height = 30;
    const points = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isUp = prices[prices.length - 1] >= prices[prices.length - 2];
    const color = isUp ? '#4ade80' : '#f87171';

    return (
      <svg width={width} height={height} className="sparkline-svg">
        <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
      </svg>
    );
  };

  const getTrendAdvice = (assetId) => {
    const history = priceHistories[assetId] || [];
    if (history.length < 3) return "Stable";
    const cur = history[history.length - 1];
    const prev = history[history.length - 2];
    const prevPrev = history[history.length - 3];
    const changeSum = (cur - prev) + (prev - prevPrev);

    if (changeSum > 0.05 * cur) return "Bullish Trend 📈";
    if (changeSum < -0.05 * cur) return "Bearish Trend 📉";
    return "Stable ➖";
  };

  const holdingsValue = calculatePortfolioValue();
  const totalWealth = money + holdingsValue;
  const totalPnL = getHoldingsProfitLoss();

  return (
    <div className="invest-container glass-panel animate-fade-in">
      <header className="invest-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📈</span>
          <h3>Apex Invest</h3>
        </div>
        <button className="btn-mini" onClick={onClose}>Close</button>
      </header>

      {/* Portfolio Header Cards */}
      <section className="invest-portfolio-summary">
        <div className="summary-card">
          <span className="label">Available Funds</span>
          <span className="value" style={{ color: '#4ade80' }}>${money.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="label">Portfolio Value (Unrealized Profit)</span>
          <span className={`value ${totalPnL >= 0 ? 'positive' : ''}`} style={{ color: totalPnL < 0 ? '#f87171' : '' }}>
            ${holdingsValue.toFixed(2)} ({totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)})
          </span>
        </div>
      </section>

      {/* Asset Trading List */}
      <section className="invest-list">
        {Object.keys(ASSETS).map(assetId => {
          const asset = ASSETS[assetId];
          const price = assetPrices[assetId] || asset.startPrice;
          const history = priceHistories[assetId] || [price];
          
          const prevPrice = history.length > 1 ? history[history.length - 2] : price;
          const isPriceUp = price >= prevPrice;
          const diffPct = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;

          const qty = quantities[assetId] || 1;
          const tradeCost = price * qty;

          // Holdings calculations
          const owned = portfolio[assetId]?.quantity || 0;
          const avgPrice = portfolio[assetId]?.avgPrice || 0;
          const assetPnL = owned * (price - avgPrice);

          const canBuy = money >= tradeCost;
          const canSell = owned >= qty;

          const trendAdvice = finance >= 30 ? getTrendAdvice(assetId) : null;

          return (
            <div key={assetId} className="asset-row">
              {/* Asset Info */}
              <div className="asset-identity">
                <span className="ticker">
                  {asset.ticker}
                  <span className={`asset-type-badge ${asset.type}`}>{asset.type}</span>
                </span>
                <span className="name">{asset.name}</span>
              </div>

              {/* Price & Performance */}
              <div className="asset-performance">
                <span className="price">${price.toFixed(2)}</span>
                <span className={`trend ${isPriceUp ? 'up' : 'down'}`}>
                  {isPriceUp ? '▲' : '▼'} {Math.abs(diffPct).toFixed(1)}%
                </span>
              </div>

              {/* Sparkline chart */}
              <div className="asset-chart">
                {renderSparkline(history)}
              </div>

              {/* Player Holdings */}
              <div className="asset-holdings">
                {owned > 0 ? (
                  <>
                    <span className="holding-value">{owned} shares</span>
                    <span className="holding-label">Avg: ${avgPrice.toFixed(2)}</span>
                    <span className={`holding-pnl ${assetPnL >= 0 ? 'profit' : 'loss'}`}>
                      {assetPnL >= 0 ? '+$' : '-$'}{Math.abs(assetPnL).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No shares owned</span>
                )}
              </div>

              {/* Trade Action Deck */}
              <div className="asset-trade-actions">
                <input
                  type="number"
                  className="trade-input"
                  value={qty}
                  onChange={(e) => handleQtyChange(assetId, e.target.value)}
                  min="1"
                />
                <button
                  className="btn-trade buy"
                  onClick={() => buyAsset(assetId, qty)}
                  disabled={!canBuy}
                  title={`Cost: $${tradeCost.toFixed(2)}`}
                >
                  Buy
                </button>
                <button
                  className="btn-trade sell"
                  onClick={() => sellAsset(assetId, qty)}
                  disabled={!canSell}
                >
                  Sell
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer Info */}
      <footer className="invest-footer">
        <div>
          <span>Total Wealth (Cash + Investments): <strong>${totalWealth.toFixed(2)}</strong></span>
        </div>
        {finance >= 30 ? (
          <div className="invest-trend-tip">
            💡 Finance Level {finance}: Trend prediction indicators active!
          </div>
        ) : (
          <div>
            <span>Level Finance to 30+ to unlock market trend indicators.</span>
          </div>
        )}
      </footer>
    </div>
  );
};

export default InvestmentApp;
