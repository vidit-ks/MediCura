import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { BASE_URL } from "../../config";

const FeedbackForm = () => {
  const { id } = useParams();
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const handleSubmitReview = async e=>{
        e.preventDefault();

        try{
           const response = await fetch(`${BASE_URL}/doctors/${id}/reviews`, {
                method : 'POST',
                body : JSON.stringify({
                    rating : rating,
                    reviewText : reviewText
                }),
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            },
        )

        const data=await response.json()
        console.log(data)
        
        }catch(e){
            console.log(e)
        }
    }
  return (
    <form action="">
        <div>
            <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4'>How would you rate the overall experience?</h3>
            <div>
                {[...Array(5).keys()].map((_,index)=>{
                    index+=1
                    return <button key={index} type='button' className={`${index <=((rating && hover) || hover) ? 'text-yellow-300' : 'text-gray-400'} bg-transparent border-none outline-none text-[22px] cursor-pointer`} onClick={()=>setRating(index)}onMouseEnter={()=>setHover(index)} onMouseLeave={()=>setHover(rating)} onDoubleClick={()=>{setHover(0); setRating(0);}}><span><AiFillStar/></span></button>
                })}
            </div>
        </div>
        <div className='mt-[30px]'>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4'>Share your Feedback and suggestions.</h3>
        <textarea className='border border-solid border-[#0066ff34] focus:outline outline:primaryColor w-full px-4 py-3 rounded-md' rows="5" placeholder='Write your message' onChange={(e)=>setReviewText(e.target.value)}></textarea>
        </div>
        <button type='submit' onClick={handleSubmitReview} className='btn rounded-[50px]'>Submit Feedback</button>
    </form>
  )
}

export default FeedbackForm
