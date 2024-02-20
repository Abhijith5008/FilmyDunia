// actions/moviesActions.js
export const FETCH_MOVIES_REQUEST = 'FETCH_MOVIES_REQUEST';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

export const fetchMoviesRequest = () => ({
  type: FETCH_MOVIES_REQUEST,
});

export const fetchMoviesSuccess = (movies) => ({
  type: FETCH_MOVIES_SUCCESS,
  payload: movies,
});

export const fetchMoviesFailure = (error) => ({
  type: FETCH_MOVIES_FAILURE,
  payload: error,
});

export const fetchMovies = () => {
  return async (dispatch) => {
    dispatch(fetchMoviesRequest());
    try {
      // Fetch movies from API
      const response = await fetch('API_ENDPOINT');
      const data = await response.json();
      dispatch(fetchMoviesSuccess(data));
    } catch (error) {
      dispatch(fetchMoviesFailure(error.message));
    }
  };
};
