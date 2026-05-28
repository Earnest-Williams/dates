export const postSimstagram = (state, dispatch, contentType, statRequirements, baseFollowers, energyCost) => {
  dispatch({
    type: 'POST_SIMSTAGRAM',
    payload: { contentType, statRequirements, baseFollowers, energyCost }
  });
};

export const addSimstagramBuff = (state, dispatch, buffName) => {
  dispatch({
    type: 'ADD_SIMSTAGRAM_BUFF',
    payload: { buffName }
  });
};
