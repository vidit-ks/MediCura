import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config';
import starIcon from '../../assets/images/Star.png';
import DoctorAbout from './DoctorAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctors, setDoctors] = useState({});
  const [tab, setTab] = useState('about');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch doctor');
        const data = await response.json();
        setDoctors(data.data || {});
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };
    fetchData();
  }, [id]);

  if (Object.keys(doctors).length === 0) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
          <p className="text-textColor mt-4 text-[16px]">Loading doctor profile...</p>
        </div>
      </section>
    );
  }

  const {
    average_rating, averageRating, bio, name,
    total_rating, totalRating, specialization,
    id: doctorDbId, _id, photo
  } = doctors;

  const displayRating      = average_rating ?? averageRating ?? 0;
  const displayTotalRating = total_rating ?? totalRating ?? 0;
  const doctorId           = doctorDbId || _id || id;

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">

          {/* ── Left: doctor info + tabs ── */}
          <div className="md:col-span-2">

            {/* Doctor header card */}
            <div className="flex items-start gap-5 bg-white shadow-sm border border-gray-100 rounded-xl p-5">
              {/* Fixed-size photo */}
              <figure className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
              </figure>

              <div className="flex-1">
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 text-[13px] font-semibold rounded-full">
                  {specialization}
                </span>
                <h3 className="text-headingColor text-[22px] leading-9 mt-2 font-bold">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <img src={starIcon} alt="star" className="w-4 h-4" />
                  <span className="text-[15px] font-semibold text-headingColor">
                    {parseFloat(displayRating.toFixed(1))}
                  </span>
                  <span className="text-[14px] text-textColor">
                    ({displayTotalRating} reviews)
                  </span>
                </div>
                {bio && (
                  <p className="text-textColor text-[14px] leading-6 mt-2 line-clamp-3">{bio}</p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-[30px] border-b border-solid border-[#0066ff24]">
              <button
                onClick={() => setTab('about')}
                className={`py-2 px-5 mr-5 text-[16px] leading-7 font-semibold transition-colors
                  ${tab === 'about'
                    ? 'border-b-2 border-solid border-primaryColor text-primaryColor'
                    : 'text-headingColor hover:text-primaryColor'
                  }`}
              >
                About
              </button>
              <button
                onClick={() => setTab('feedback')}
                className={`py-2 px-5 mr-5 text-[16px] leading-7 font-semibold transition-colors
                  ${tab === 'feedback'
                    ? 'border-b-2 border-solid border-primaryColor text-primaryColor'
                    : 'text-headingColor hover:text-primaryColor'
                  }`}
              >
                Feedback
              </button>
            </div>

            {/* Tab content */}
            <div className="mt-[40px]">
              {tab === 'about'    && <DoctorAbout doctors={doctors} key={doctorId} />}
              {tab === 'feedback' && <Feedback    doctors={doctors} key={doctorId} />}
            </div>
          </div>

          {/* ── Right: booking panel ── */}
          <div>
            <SidePanel doctors={doctors} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
