const initialState = {
  user: {},
  loading: false,
  error: null,
  token: "",
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return {
        ...state,
        user: action.payload?.user || action.payload,
        token: action.payload?.token || state.token,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return { ...state, user: null, token: "", loading: false, error: null };
    case "LOGIN_START":
      return { ...state, loading: true };
    case "LOGIN_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "REGISTER_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    case "REGISTER_USER_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
