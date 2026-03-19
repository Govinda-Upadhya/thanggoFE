import React, { useEffect, useState } from "react";
import Header from "../../components/admin/header";
import Footer from "../../components/admin/footer";
import Futsalcomponent from "../../components/admin/futsalcomponent";
import axios from "axios";
import Addground from "../../components/admin/addground";
import Booking from "./adminBooking";
import Statistics from "../../components/admin/Statistics"; // Make sure this import is correct
import { base_url } from "../../types/ground";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Admin = () => {
  const [active, setActive] = useState("dashboard");
  const [grounds, setGrounds] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGround() {
      try {
        const res = await axios.get(`${base_url}/admin/seeGrounds`, {
          withCredentials: true,
        });
        if (res.status == 200) {
          setGrounds(res.data.grounds);
          console.log(res.data.grounds);
        } else {
          toast.error("No Grounds registered yet");
        }
      } catch (error) {
        toast.error("No Grounds registered yet");
      }
    }
    fetchGround();
  }, []);

  // Render the correct component based on active state
  const renderActiveComponent = () => {
    switch (active) {
      case "dashboard":
        return <Futsalcomponent grounds={grounds} />;
      case "booking":
        return <Booking />;
      case "addGround":
        return <Addground />;
      case "statistics":
        return <Statistics />;
      default:
        return <Futsalcomponent grounds={grounds} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans w-full">
      <Header setActive={setActive} active={active} />
      {renderActiveComponent()}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Footer />
    </div>
  );
};

export default Admin;
