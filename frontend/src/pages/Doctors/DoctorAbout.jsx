const DoctorAbout = ({ doctors }) => {
  const {
    name,
    about,
    qualifications,
    doctor_qualifications,
    experiences,
    doctor_experiences,
  } = doctors;

  // Support both MongoDB (old) and Supabase (new) field names
  const quals = qualifications || doctor_qualifications || [];
  const exps  = experiences    || doctor_experiences    || [];

  // Helper: format year range from Supabase date strings OR old "time" string
  const yearRange = (item) => {
    if (item.time)          return item.time;
    if (item.starting_date) return `${item.starting_date.slice(0, 4)} – ${item.ending_date?.slice(0, 4) || 'Present'}`;
    return '';
  };

  return (
    <div>
      {/* About section */}
      <div>
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          About
          <span className="text-irisBlueColor font-bold text-[24px] leading-9">{name}</span>
        </h3>
        <p className="text_para mt-3">{about || 'No bio provided.'}</p>
      </div>

      {/* Education */}
      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">Education</h3>
        <ul className="pt-4 md:p-5">
          {quals.length === 0 && (
            <li className="text-textColor text-[14px]">No qualifications listed.</li>
          )}
          {quals.map((q, index) => (
            <li
              key={q.id || q._id || index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:gap-5 mb-[30px]"
            >
              <div>
                <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                  {yearRange(q)}
                </span>
                {/* Supabase: degree field | MongoDB: degree field (same name) */}
                <p className="text-[16px] leading-6 font-medium text-textColor">
                  {q.degree || '—'}
                </p>
              </div>
              {/* Supabase: university | MongoDB: institute */}
              <p className="text-[14px] leading-5 font-medium text-textColor sm:text-right">
                {q.university || q.institute || '—'}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">Experience</h3>
        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          {exps.length === 0 && (
            <li className="text-textColor text-[14px]">No experience listed.</li>
          )}
          {exps.map((e, index) => (
            <li
              key={e.id || e._id || index}
              className="p-4 rounded-lg bg-[#fff9ea] border border-yellow-100"
            >
              {/* Supabase: starting_date/ending_date | MongoDB: duration */}
              <span className="text-yellow-500 text-[14px] leading-6 font-semibold">
                {yearRange(e)}
              </span>
              {/* Supabase: position | MongoDB: post */}
              <p className="text-[16px] leading-6 font-medium text-textColor mt-1">
                {e.position || e.post || '—'}
              </p>
              {/* Supabase: hospital | MongoDB: place */}
              <p className="text-[14px] leading-5 font-medium text-textColor mt-1">
                {e.hospital || e.place || '—'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;