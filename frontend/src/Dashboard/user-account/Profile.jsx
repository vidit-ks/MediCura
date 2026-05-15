import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Profile = (userData) => {
  const { state, dispatch } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null,
    gender: '',
    bloodType: '', 
  });
  const navigate = useNavigate();
  useEffect(()=>{
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      photo: userData.photo || null,
      gender: userData.gender || '',
      bloodType: userData.blood_type || userData.bloodType || '',
    })
  },[userData])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const data = await uploadImageToCloudinary(file);
      const url = data.secure_url || data.url;
      setSelectedFile(url);
      setFormData({ ...formData, photo: url });
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Photo upload failed. Check Cloudinary config.');
    }
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };
  const handlebloodTypeChange = (e) => {
    setFormData({ ...formData, bloodType: e.target.value });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userId = userData.userData?.id || userData.userData?._id;
      const payload = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        blood_type: formData.bloodType,
        photo: formData.photo,
      };
      if (formData.password) payload.password = formData.password;

      const response = await axios.put(`${BASE_URL}/users/${userId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status !== 200) throw new Error(response.data?.message || 'Update failed');

      // ✅ Update AuthContext + localStorage so header avatar refreshes immediately
      const updatedUser = response.data?.data || { ...state.user, ...payload };
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: updatedUser,
          role: state.role,
          token: state.token
        }
      });

      setLoading(false);
      toast.success('Profile updated successfully!');
      navigate('/users/profile/me');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
      setLoading(false);
    }
  };
  return (
    <div className='mt-10'>
        <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-5">
                <input
                  className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  type="text"
                  placeholder="Blood Type"
                  name = "bloodType"
                  value={formData.bloodType}
                  onChange={handlebloodTypeChange}
                  required
                />
              </div>
              
              <div className="mb-5 flex items-center justify-between">
                
                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                    id="genderSelect"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <div className="mb-5 flex items-center gap-3">
                {formData.photo && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img src={formData.photo} className="rounded-full w-[57px] h-[57px]" alt="" />
                  </figure>
                )}
                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".jpg, .png"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    {selectedFile && selectedFile.name } Upload Photo
                  </label>
                </div>
              </div>
              <div className="mt-7">
                <button disabled={loading && true} type="submit" className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                  {loading ? <HashLoader size={25} color='#ffffff'/> : 'Update'}
                </button>
              </div>
            </form>
    </div>
  )
}

export default Profile