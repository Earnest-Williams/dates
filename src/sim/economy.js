export const calculateStorageFee = (storageSize) => {
  const extraItems = storageSize - 3;
  return extraItems > 0 ? extraItems * 10 : 0;
};

export const calculateWorkSalary = (corporate) => {
  return Math.floor(60 + (corporate * 1.5));
};

export const getGroceriesCost = (hasGasRange, hasSmartFridge) => {
  let cost = hasGasRange ? 10 : 5;
  if (hasSmartFridge) cost = cost * 0.5;
  return cost;
};
