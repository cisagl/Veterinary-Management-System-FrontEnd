import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import cities from '../../assets/cities.jsx';
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvailableDate from '../available-date/availableDate.jsx';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/doctors/all`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/doctors/delete/${id}`)
        .then(response => {
          setDoctors(doctors.filter(doctor => doctor.id !== id));
          noti("Doctor removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedDoctorId(id);
    const selectedDoctor = doctors.find(doctor => doctor.id === id);
    if (selectedDoctor) {
      setFormData({
        name: selectedDoctor.name,
        phone: selectedDoctor.phone,
        address: selectedDoctor.address,
        mail: selectedDoctor.mail,
        city: selectedDoctor.city
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
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/doctors/save`, formData)
      .then(response => {
        noti("Doctor added successfully!", "success");
        fetchDoctors();
        setFormData({
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null
        });
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/doctors/update/${selectedDoctorId}`, formData)
      .then(response => {
        fetchDoctors();
        setFormData({
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>City</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id} className='item-data'>
                <td>{doctor.name}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.mail}</td>
                <td>{doctor.address}</td>
                <td>{doctor.city}</td>
                <td><button className='remove' onClick={() => handleDelete(doctor.id)}><IoIosRemoveCircle /></button></td>
                <td><button className='update' onClick={() => handleUpdateClick(doctor.id)}><FaRegEdit /></button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <ToastContainer />

        {showUpdateForm && (
          <div className='item-update'>
            <div className="notification">
              <button className='item-update-button' type="button" onClick={handleUpdateClose}><IoIosCloseCircle /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className='updateForm'>
              <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Name' />
              <input type="text" name='phone' value={formData.phone} onChange={handleChange} placeholder="Phone" />
              <input type="text" name='address' value={formData.address} onChange={handleChange} placeholder="Address" />
              <input type="text" name='mail' value={formData.mail} onChange={handleChange} placeholder='Email' />
              <select name="city" onChange={handleChange} value={formData.city}>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
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
                <option key={city} value={city}>{city}</option>
              ))}
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
