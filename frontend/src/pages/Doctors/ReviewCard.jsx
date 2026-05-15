import avatar from "../../assets/images/avatar-icon.png";
import { formateDate } from "../../utils/formateDate";
import { AiFillStar } from "react-icons/ai";

const ReviewCard = (review) => {
  console.log(review.review.user.name);
  const rev = review.review
  // Supabase uses snake_case + joined table is 'users' (not 'user')
  const reviewer = rev.users || rev.user || {};
  const dateStr = rev.created_at || rev.updatedAt || "";
  const reviewText = rev.review_text || rev.reviewText || "";
  return (
    <div className="mb-[50px]">
      <div className="flex justify-between gap-10 mb-[30px]">
        <div className="flex gap-3">
          <figure className="w-10 h-10 rounded-full">
            <img className="w-full" src={avatar} alt="" />
          </figure>
          <div>
            <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
              {reviewer.name || "Anonymous"}
            </h5>
            <p className="text-[14px] leading-6 text-textColor">
              {dateStr.split("T")[0]}
            </p>
            <p className="text_para mt-3 font-medium text-[15px]">
              {reviewText}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5).keys()].map((_, index) => (
            <AiFillStar key={index} color={index < rev.rating ? "#0067FF" : "gray"} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
