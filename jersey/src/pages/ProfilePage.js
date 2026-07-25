
import { useEffect, useState } from 'react';
import '../components/styles/MyAccount.css';
import { FaShoppingBag, FaMoneyCheckAlt, FaMapMarkerAlt, FaWifi, FaPhone, FaEnvelope, FaMapMarker, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const[address,setAddress]=useState();
  const navigate=useNavigate();

  const API= process.env.REACT_APP_API_URL;


  useEffect(() => {
  const fetchProfileData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

      const [userRes, addressRes] = await Promise.all([
        axios.get(`${API}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/api/address/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUser(userRes.data);
      setAddress(addressRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfileData();
}, []);


  return (
    <div className="my-account-container">
      <div className="account-left">
        <h2>My account</h2>
        <div className="account-options">
          <div className="option-box"  onClick={() => navigate('/profile/orders')} >
            <FaShoppingBag size={30} className="icon" />
            <div>
              <h5>Your Orders</h5>
              <p>Follow, view or pay your orders</p>
            </div>
          </div>
          <div className="option-box"  onClick={() => navigate('/profile/invoice')}>
            <FaMoneyCheckAlt size={30} className="icon" />
            <div>
              <h5>Your Invoices</h5>
              <p>Follow, download or pay your invoices</p>
            </div>
          </div>
          <div className="option-box"  onClick={() => navigate('/profile/address')}>
            <FaMapMarkerAlt size={30} className="icon" />
            <div>
              <h5>Addresses</h5>
              <p>Add, remove or modify your addresses</p>
            </div>
          </div>
          <div className="option-box"  onClick={() => navigate('/profile/security')}>
            <FaWifi size={30} className="icon" />
            <div>
              <h5>Connection & Security</h5>
              <p>Configure your connection parameters</p>
            </div>
          </div>
        </div>
      </div>
      <div className="account-right">
         {user ? (
          <>
        <div className="profile-badge">{user.name?.charAt(0).toUpperCase()}</div> 
        <h5 style={{margin:0}}>{user.name}</h5>
        
        <p className="muted">JerseyVerse</p>
        
        <div className="profile-info">
          <p><FaMapMarker />
         {address.street},<br></br>  {address.city},{address.zip}, <br></br>{address.state}, {address.country}
          </p>
          <p><FaPhone />  {user.phone || '+91 ---- ----'}</p>
          <p><FaEnvelope /> {user.email}</p>
          <p className="edit-link" onClick={()=> navigate('/profile/edit')}><FaEdit /> Edit information</p>
        </div>
        </>
         ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
