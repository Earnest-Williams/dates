export const clampAssetPrice = (assetId, price) => {
  // Simple bounds depending on asset
  if (assetId === 'crypto') return Math.max(10, Math.min(price, 100000));
  if (assetId === 'stocks') return Math.max(50, Math.min(price, 5000));
  if (assetId === 'bonds') return Math.max(90, Math.min(price, 150));
  return Math.max(1, price);
};

export const calculateTransactionFriction = (assetId, quantity, price, side) => {
  const baseCost = quantity * price;
  // 1% fee on buy, 1% fee on sell to prevent same-tick exploit
  const feeRate = 0.01;
  const fee = baseCost * feeRate;
  
  if (side === 'buy') {
    return baseCost + fee;
  } else {
    return baseCost - fee; // You get less when you sell
  }
};

export const applyMarketNews = (assetPrices, newsEvent, rng = Math.random) => {
  // We can just simulate some noise
  const newPrices = { ...assetPrices };
  for (const assetId in newPrices) {
    const volatility = assetId === 'crypto' ? 0.2 : (assetId === 'stocks' ? 0.05 : 0.01);
    const change = 1 + ((rng() - 0.5) * volatility);
    newPrices[assetId] = clampAssetPrice(assetId, newPrices[assetId] * change);
  }
  return newPrices;
};

export const advanceMarketDay = (assetPrices, priceHistories, rng = Math.random) => {
  return applyMarketNews(assetPrices, null, rng);
};
