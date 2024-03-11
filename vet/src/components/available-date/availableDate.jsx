import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvailableDate = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    availableDate: null
  });
  const [updateFormData, setUpdateFormData] = useState({
    doctor: '',
    availableDate: null
  });
  const [selectedAvailableDateId, setSelectedAvailableDateId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });


  useEffect(() => {
    fetchAvailableDates();
    fetchDoctors();
  }, []);

  const fetchAvailableDates = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/available-dates/all')
      .then(response => {
        setAvailableDates(response.data);
        noti("Available Date table listed successfully!", "success");

      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchDoctors = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/doctors/all')
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
      axios.delete(`https://veterinary-management-system.onrender.com/v1/available-dates/delete/${id}`)
        .then(response => {
          setAvailableDates(availableDates.filter(availableDate => availableDate.id !== id));
          noti("Available Date removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedAvailableDateId(id);
    const selectedAvailableDate = availableDates.find(availableDate => availableDate.id === id);
    if (selectedAvailableDate) {
      setUpdateFormData({
        doctor: selectedAvailableDate.doctor,
        availableDate: selectedAvailableDate.availableDate
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
    axios.post('https://veterinary-management-system.onrender.com/v1/available-dates/save', formData)
      .then(response => {
        fetchAvailableDates();
        setFormData({
          doctor: '',
          availableDate: null
        });
        noti("Available Date added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://veterinary-management-system.onrender.com/v1/available-dates/update/${selectedAvailableDateId}`, updateFormData)
      .then(response => {
        fetchAvailableDates();
        setUpdateFormData({  
          doctor: '',
          availableDate: null
        });
        noti("Available Date updated successfully!", "success");
        setShowUpdateForm(false);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  
  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const selectedDoctor = doctors.find(doctor => doctor.id === parseInt(selectedDoctorId));
    if (selectedDoctor) {
      setFormData(prevFormData => ({
        ...prevFormData,
        doctor: {id: selectedDoctorId}
      }));
    } else {
      noti("Doctor not found", "error");      
    }
  };

  
  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Available Date Panel</h3>

        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Available Date</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {availableDates.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.doctor ? item.doctor.name : 'Unknown Doctor'}</td>
                <td>{item.availableDate}</td>
                <td><button className='remove' onClick={() => handleDelete(item.id)}><IoIosRemoveCircle /></button></td>
                <td><button className='update' onClick={() => handleUpdateClick(item.id)}><FaRegEdit /></button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {showUpdateForm && (
          <div className='item-update'>
            <div className="notification">
              <button className='item-update-button' type="button" onClick={handleUpdateClose}><IoIosCloseCircle /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className='updateForm'>


              <select name='doctor' value={updateFormData.doctor.id} onChange={(e) => setUpdateFormData({...updateFormData, doctor: {id: e.target.value}})}>
                <option value=''>Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>

              <div className='flx'>
              <span>Available Date</span><input type="date" name='availableDate' value={updateFormData.availableDate} onChange={(e) => setUpdateFormData({...updateFormData, availableDate: e.target.value})} placeholder="Available Date" />
              </div>
              
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Available Date</h3>
          <form onSubmit={handleSubmit} className='saveForm'>

            <select name='doctor' onChange={handleDoctorChange} value={formData.doctor.name}>
              <option value=''>Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
            <div className='flx'>
            <span>Available Date</span><input type="date" name='availableDate' value={formData.availableDate} onChange={handleChange} placeholder="Available Date" />
            </div>
            
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvailableDate;
