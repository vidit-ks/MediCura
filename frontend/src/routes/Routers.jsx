import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Doctors from '../pages/Doctors/Doctors'
import Prediction from '../pages/Prediction'
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import MyAccount from '../Dashboard/user-account/MyAccount'
import Dashboard from '../Dashboard/doctor-account/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import { VideoRoom } from '../Dashboard/user-account/VideoRoom'
 
import {Routes , Route} from 'react-router-dom'
import EHR from '../pages/EHR'


const Routers = () => {
  return <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/doctors' element={<Doctors/>}/>
    <Route path='/doctors/:id' element={<DoctorDetails/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Signup/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/services' element={<Services/>}/>
    <Route path='/room' element={<VideoRoom/>}/>
    <Route path='/ehr' element={<EHR/>}/>
    <Route path='/prediction' element={<Prediction/>}/>
    <Route path='/users/profile/me' element={<ProtectedRoute allowedRoles={['patient']} ><MyAccount/></ProtectedRoute>}/>
    <Route path='/doctors/profile/me' element={<ProtectedRoute allowedRoles={['doctor']}><Dashboard/></ProtectedRoute>}/>
  </Routes>
}

export default Routers