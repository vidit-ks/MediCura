import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
const ProtectedRoute = ({children, allowedRoles}) => {
  const {state} = useContext(AuthContext);
  const {role,token} = state;
  const isAllowed = allowedRoles.includes(role)
  const accessibleRoute = token && isAllowed ? children :  <Navigate to='/login' replace={false}/>
  return accessibleRoute;
}

export default ProtectedRoute
