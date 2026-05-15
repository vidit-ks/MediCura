import { createContext, useContext, useReducer, useEffect } from "react";
const initialState = {
  user:
    localStorage.getItem("user") != "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};
// const initialState = {
//     user: null,
//     role: null,
//     token: null,
// };
export const AuthContext = createContext(initialState);
const authReducer = (state, action) => {
  // console.log(action.payload.user);
  // console.log(action.payload.role);
  // console.log(action.payload.token);
  // console.log(action.type)
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };
    case "LOGIN_START":
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("role", state.role);
    localStorage.setItem("token", state.token);
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
