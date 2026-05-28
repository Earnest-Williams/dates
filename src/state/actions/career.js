export const startProject = (state, dispatch, projectId) => {
  dispatch({
    type: 'START_PROJECT',
    payload: { projectId }
  });
};

export const workOnProject = (state, dispatch, energyCost) => {
  dispatch({ type: 'WORK_ON_PROJECT', payload: { energyCost } });
  return true;
};

export const resolveWorkEvent = (state, dispatch, optionIndex) => {
  dispatch({ type: 'RESOLVE_WORK_EVENT', payload: { optionIndex } });
  return true;
};
