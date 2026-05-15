import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';
import DoctorCard from '../../components/Doctors/DoctorCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/doctors/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)
      const data = await response.json();
      setDoctors(data.data || []);
      console.log(data); // Log the data to the console
    };
    fetchData();
  }, []);
  return <>
    <section className='bg-[#fff9ea]'>
      <div className="container text-center">
        <h2 className='heading'>Find a Doctor</h2>
        <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between'>
          <input type="search" className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor' placeholder='Search Doctor'/>
          <button className='btn mt-0 rounded-[0px] rounded-r-md'>Search</button>
        </div>
      </div>
    </section>
    <section>
      <div className="container">
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-4'>
        {doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor}/>)}
      </div>
      </div>
    </section>
    {/* <section>
    <div className='container'>
    <div className='xl:w-[470px] mx-auto'>
        <h2 className='heading text-center'>What our patients say</h2>
        <p className='text_para text-center '>World class care for everyone. Our health system offers unmatched, expert health care.</p>
      </div>
      <Testimonial/>
    </div>
  </section> */}
  </>
}

export default Doctors
