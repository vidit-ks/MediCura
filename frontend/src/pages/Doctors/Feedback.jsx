import { useState } from 'react'

import FeedbackForm from './FeedbackForm'
import ReviewCard from './ReviewCard'

const Feedback = (doctors) => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
    const {reviews, total_rating, totalRating} = doctors.doctors
    const displayTotal = total_rating ?? totalRating ?? 0;
    console.log(reviews)
    //console.log(doctors.doctors.reviews)
  return (
    <div>
        {/* <div className='mb-[50px]'> */}
            <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>All reviews ({displayTotal})</h4>
        {/* <div/> */}
        {(reviews || []).map((review) => <ReviewCard key={review.id || review._id} review={review}/>)}
        {!showFeedbackForm && <div className='text-center'><button onClick={()=>setShowFeedbackForm(true)} className="btn rounded-[50px]">Give Feedback</button></div>}
        {showFeedbackForm && <FeedbackForm/>}
    </div>
  )
}

export default Feedback