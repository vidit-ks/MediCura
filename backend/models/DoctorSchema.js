import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: {
    type: String,
  },

  // Fields for doctors only
  specialization: { type: String },
  // qualifications: {
  //   type: Array,
  // },

  qualifications : [{
    time : {type :String},
    degree : {type : String},
    institute : {type:String}
  }],

  experiences: [{
    place: {
      type: String,
    },
    post: {
      type: String,
    },
    duration: {
      type: String, // You may want to change the type to Date or Number depending on your requirements
    }
  }],

  bio: { type: String, maxLength: 100 },
  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});


DoctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

export default mongoose.model("Doctor", DoctorSchema);