export const advanceTime = (state, dispatch, ticks) => {
  dispatch({ type: 'ADVANCE_TIME', payload: { ticks } });
};

export const applyNeedsDecay = (state, dispatch, ticks) => {
  dispatch({ type: 'DECAY_NEEDS', payload: { ticks } });
};

export const processWeeklyBills = (state, dispatch) => {
  dispatch({ type: 'PROCESS_WEEKLY_BILLS', payload: { daysCrossed: [state.time.day] } });
};

export const processMonthlyBills = (state, dispatch) => {
  dispatch({ type: 'PROCESS_MONTHLY_BILLS', payload: { daysCrossed: [state.time.day] } });
};

export const checkCollapse = (state, dispatch) => {
  dispatch({ type: 'CHECK_COLLAPSE' });
};

export const checkEviction = (state, dispatch) => {
  dispatch({ type: 'CHECK_EVICTION' });
};


export const addLog = (state, dispatch, message) => {
  dispatch({ type: 'ADD_LOG', payload: { message } });
};
