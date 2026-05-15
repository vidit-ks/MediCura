import { BASE_URL } from "../../config";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VideoRoom } from './VideoRoom';

const MyBookings = (userData) => {

    function extractDayAndTime(inputString) {
        try {
            const index = inputString.indexOf(' ');
            const day = inputString.slice(0, index);
            const timeRange = inputString.slice(index + 1);
    
            return { day, timeRange };
        } catch (error) {
            return { day: null, timeRange: null };
        }
    }
    const [appointments,setappointments] = useState([])
    //console.log(userData.userData._id)
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`${BASE_URL}/users/appointments/my-appointments`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${localStorage.getItem('token')}`
            },
          });
          //console.log(response)
          const data = await response.json();
          setappointments(data.data || [])
          //console.log(appointments); // Log the data to the console
        };
        fetchData();
      }, []);
      const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const handleJoin = () => {
    navigate("/room");
    setJoined(true);
  };
return(<>
{appointments.map((appointment,index)=>{
    // Supabase returns snake_case: appointment_date, and joined table as 'doctors'
    const { day, timeRange } = extractDayAndTime(appointment.appointment_date || appointment.appointmentDate || "");
    const doctor = appointment.doctors || appointment.doctor || {};
    return(
    <div key={appointment.id || index} className='w-[700px] md:w-[500px] p-4 shadow-lg rounded-lg mt-6'>
        <div>
        <h3 className="heading text-xl text-headingColor mb-2">{doctor.name}</h3>
        <span className="text-para bg-[#CCF0F3] text-irisBlueColor rounded-full px-2 my-2">{doctor.specialization}</span>
        </div>
        <div className="flex flex-row justify-between pr-4 content-center text-textColor pl-2">
            <div className="flex flex-col">
                <p>{day}</p>
                <p>{timeRange}</p>
            </div>
            <div>
                <p className="text-sky-400">{appointment.status}</p>
            </div>
        </div>
        {!joined && <button className='btn rounded-[50px] mt-2 py-1' onClick={handleJoin}>Join</button>}
      {joined && <VideoRoom join={joined}/>}
    </div>
    );
})}
    
    </>
)
}

export default MyBookings
