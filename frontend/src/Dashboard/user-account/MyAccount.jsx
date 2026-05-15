import { BASE_URL } from "../../config";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyBookings from "./MyBookings";
import Profile from "./Profile";

const MyAccount = () => {
  const { dispatch, state } = useContext(AuthContext);
  const [tab, setTab] = useState("bookings");
  const { user, role, token } = state;

  const [userdata, setUser] = useState({});

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user._id;
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUser(data.data || {});
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  if (!user) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto">
          <p className="text-center text-red-500 py-10">
            No Token. Authorization denied. Please login first.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="pb-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor overflow-hidden">
                <img
                  src={user?.photo || userdata.photo || "https://via.placeholder.com/100"}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </figure>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                {userdata.name || user.name}
              </h3>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                {userdata.email || user.email}
              </p>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                Blood Type:{" "}
                <span className="ml-2 text-headingColor text-[22px] leading-8">
                  {userdata.blood_type || userdata.bloodType || "N/A"}
                </span>
              </p>
            </div>
            <div className="mt-[50px] md:mt-[100px]">
              <button
                onClick={handleLogout}
                className="md:w-full w-[40%] bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
              >
                Logout
              </button>
              <button className="md:w-full w-[40%] bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                Delete Account
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 md:px-[30px]">
            <div>
              <button
                onClick={() => setTab("bookings")}
                className={`${tab === "bookings" && "bg-primaryColor text-white font-normal"} p-2 mr-5 px-5 py-2 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`${tab === "settings" && "bg-primaryColor text-white font-normal"} p-2 py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
              >
                Profile Settings
              </button>
            </div>
            {tab === "bookings" && <MyBookings userData={user} />}
            {tab === "settings" && <Profile {...userdata} userData={user} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
