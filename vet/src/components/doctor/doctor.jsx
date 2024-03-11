import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle } from "react-icons/io";
import Table from '../table/table';
import cities from '../../assets/cities.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvailableDate from '../available-date/availableDate.jsx';

const Doctor = () => {
  const [doctors, setdoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null
  });
  const [selecteddoctorId, setSelecteddoctorId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });


  useEffect(() => {
    fetchdoctors();
  }, []);

  const fetchdoctors = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/doctors/all')
      .then(response => {
        setdoctors(response.data);
        noti("Doctor table listed successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`https://veterinary-management-system.onrender.com/v1/doctors/delete/${id}`)
        .then(response => {
          setdoctors(doctors.filter(doctor => doctor.id !== id));
          noti("Doctor removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelecteddoctorId(id);
    const selecteddoctor = doctors.find(doctor => doctor.id === id);
    if (selecteddoctor) {
      setFormData({
        nameUpdate: selecteddoctor.name,
        phoneUpdate: selecteddoctor.phone,
        addressUpdate: selecteddoctor.address,
        mailUpdate: selecteddoctor.mail,
        cityUpdate: selecteddoctor.city
      });
      setShowUpdateForm(true);
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://veterinary-management-system.onrender.com/v1/doctors/save', formData)
      .then(response => {
        fetchdoctors();
        setFormData({
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null
        });
        noti("Doctor added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://veterinary-management-system.onrender.com/v1/doctors/update/${selecteddoctorId}`, {
      name: formData.nameUpdate,
      phone: formData.phoneUpdate,
      address: formData.addressUpdate,
      mail: formData.mailUpdate,
      city: formData.cityUpdate
    })
    .then(response => {
      fetchdoctors();
      setFormData({
        ...formData,
        nameUpdate: null,
        phoneUpdate: null,
        addressUpdate: null,
        mailUpdate: null,
        cityUpdate: null
      });
      noti("Doctor updated successfully!", "success");
      setShowUpdateForm(false);
    })
    .catch(error => {
      noti(error.response.data.message, "error");      
    });
  };
  

  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Doctor Panel</h3>

        <Table 
          data={doctors} 
          onDelete={handleDelete} 
          onUpdateClick={handleUpdateClick} 
        />

        <ToastContainer />


        {showUpdateForm && (
          <div className='item-update'>
            <div className="notification">
              <button className='item-update-button' type="button" onClick={handleUpdateClose}><IoIosCloseCircle /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className='updateForm'>
              <input type="text" name='nameUpdate' value={formData.nameUpdate} onChange={handleChange} placeholder='Name' />
              <input type="text" name='phoneUpdate' value={formData.phoneUpdate} onChange={handleChange} placeholder="Phone" />
              <input type="text" name='addressUpdate' value={formData.addressUpdate} onChange={handleChange} placeholder="Address" />
              <input type="text" name='mailUpdate' value={formData.mailUpdate} onChange={handleChange} placeholder='Email' />
              <select name="cityUpdate" onChange={handleChange} value={formData.cityUpdate}>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>))}
              </select>
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
        <h3 className='item-title'>Add Doctor</h3>
          <form onSubmit={handleSubmit} className='saveForm'>
            <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Name' />
            <input type="text" name='phone' value={formData.phone} onChange={handleChange} placeholder="Phone" />
            <input type="text" name='mail' value={formData.mail} onChange={handleChange} placeholder='Email' />
            <input type="text" name='address' value={formData.address} onChange={handleChange} placeholder="Address" />
            <select name="city" onChange={handleChange} value={formData.city}>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>))}
            </select>
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
      <div className='availableDate'>
        <AvailableDate />
      </div>
    </div>
  );
};

export default Doctor;
