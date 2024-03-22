import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {
  const [reports, setreports] = useState([]);
  const [appointments, setappointments] = useState([]);
  const [formData, setFormData] = useState({
    title: null,
    diagnosis: null,
    price: null,
    appointment: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    title: null,
    diagnosis: null,
    price: null,
    appointment: ''  
  });
  const [selectedreportId, setSelectedreportId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchreports();
    fetchappointments();
  }, []);

  const fetchreports = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/reports/all`)
      .then(response => {
        setreports(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchappointments = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointments/all`)
      .then(response => {
        setappointments(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/reports/delete/${id}`)
        .then(response => {
          setreports(reports.filter(report => report.id !== id));
          noti("Report removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedreportId(id);
    const selectedreport = reports.find(report => report.id === id);
    if (selectedreport) {
      setUpdateFormData({
        title: selectedreport.title,
        diagnosis: selectedreport.diagnosis,
        price: selectedreport.price,
        appointment: selectedreport.appointment
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
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/reports/save`, formData)
      .then(response => {
        fetchreports();
        setFormData({
          title: null,
          diagnosis: null,
          price: null,
          appointment: ''
        });
        noti("Report added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/reports/update/${selectedreportId}`, updateFormData)
      .then(response => {
        fetchreports();
        setUpdateFormData({  
          title: null,
          diagnosis: null,
          price: null,
          appointment: ''
        });
        noti("Report updated successfully!", "success");

        setShowUpdateForm(false);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  
  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const handleappointmentChange = (e) => {
    const selectedappointmentId = e.target.value;
    const selectedappointment = appointments.find(appointment => appointment.id === parseInt(selectedappointmentId));
    if (selectedappointment) {
      setFormData(prevFormData => ({
        ...prevFormData,
        appointment: {id: selectedappointmentId}
      }));
    } else {
      noti("Error setting appointment data", "error");
    }
  };
  
  
  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Report Panel</h3>

        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
              <th>Diagnosis</th>
              <th>Price</th>
              <th>Appointment</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.diagnosis}</td>
                <td>{item.price}</td>
                <td>{item.appointment ? item.appointment.appointmentDate : 'Unknown appointment'}</td>
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
              <input type="text" name="title" value={formData.title} onChange={(e) => setUpdateFormData({...updateFormData, title: e.target.value})} placeholder='Title' />
              <input type="text" name="diagnosis" value={formData.diagnosis} onChange={(e) => setUpdateFormData({...updateFormData, diagnosis: e.target.value})} placeholder='Diagnosis' />
              <input type="text" name="price" value={formData.price} onChange={(e) => setUpdateFormData({...updateFormData, price: e.target.value})} placeholder='Price' />

              <select name='appointment' value={updateFormData.appointment.appointmentDate} 
              onChange={(e) => setUpdateFormData({...updateFormData, appointment: {id: e.target.value}})}>
                <option value=''>Select appointment</option>
                {appointments.map(appointment => (
                  <option key={appointment.id} value={appointment.id}>{appointment.appointmentDate}</option>
                ))}
              </select>
              
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Report</h3>
          <form onSubmit={handleSubmit} className='saveForm'>

            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Title' />
            <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder='Diagnosis' />
            <input type="text" name='price' value={formData.price} onChange={handleChange} placeholder='Price'/>

            <select name='appointment' onChange={handleappointmentChange} value={formData.appointment.appointmentDate}>
              <option value=''>Select appointment</option>
              {appointments.map(appointment => (
                <option key={appointment.id} value={appointment.id}>{appointment.appointmentDate}</option>
              ))}
            </select>
            
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
