import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointment = () => {
  const [appointments, setappointments] = useState([]);
  const [animals, setanimals] = useState([]);
  const [doctors, setdoctors] = useState([]);
  const [formData, setFormData] = useState({
    appointmentDate: null,
    animal: '',
    doctor: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    appointmentDate: null,
    animal: '',
    doctor: ''
  });
  const [selectedappointmentId, setSelectedappointmentId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });


  useEffect(() => {
    fetchappointments();
    fetchAnimals();
    fetchDoctors();
  }, []);

  const fetchappointments = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/appointments/all')
      .then(response => {
        setappointments(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchAnimals = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/animals/all')
      .then(response => {
        setanimals(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchDoctors = () => {
    axios.get('https://veterinary-management-system.onrender.com/v1/doctors/all')
      .then(response => {
        setdoctors(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`https://veterinary-management-system.onrender.com/v1/appointments/delete/${id}`)
        .then(response => {
          setappointments(appointments.filter(appointment => appointment.id !== id));
          noti("Appointment removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedappointmentId(id);
    const selectedappointment = appointments.find(appointment => appointment.id === id);
    if (selectedappointment) {
      setUpdateFormData({
        appointmentDate: selectedappointment.appointmentDate,
        animal: selectedappointment.animal,
        doctor: selectedappointment.doctor
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
    axios.post('https://veterinary-management-system.onrender.com/v1/appointments/save', formData)
      .then(response => {
        fetchappointments();
        setFormData({
          appointmentDate: null,
          animal: '',
          doctor: ''
        });
        noti("Appointment added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://veterinary-management-system.onrender.com/v1/appointments/update/${selectedappointmentId}`, updateFormData)
      .then(response => {
        fetchappointments();
        setUpdateFormData({  
          appointmentDate: null,
          animal: '',
          doctor: ''
        });
        noti("Appointment updated successfully!", "success");

        setShowUpdateForm(false);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  
  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const handleAnimalChange = (e) => {
    const selectedanimalId = e.target.value;
    const selectedanimal = animals.find(animal => animal.id === parseInt(selectedanimalId));
    if (selectedanimal) {
      setFormData(prevFormData => ({
        ...prevFormData,
        animal: {id: selectedanimalId}
      }));
    } else {
      noti("Animal not found", "error");      
    }
  };

  const handleDoctorChange = (e) => {
    const selectdoctorId = e.target.value;
    const selectdoctor = doctors.find(doctor => doctor.id === parseInt(selectdoctorId));
    if (selectdoctor) {
      setFormData(prevFormData => ({
        ...prevFormData,
        doctor: {id: selectdoctorId}
      }));
    } else {
      noti("Doctor not found", "error");      

    }
  };
  
  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Appointment Panel</h3>

        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Animal</th>
              <th>Doctor</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.appointmentDate}</td>
                <td>{item.animal ? item.animal.name : 'Unknown animal'}</td>
                <td>{item.doctor ? item.doctor.name : 'Unknown doctor'}</td>
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

              <select name='animal' value={updateFormData.animal.id} onChange={(e) => setUpdateFormData({...updateFormData, animal: {id: e.target.value}})}>
                <option value=''>Select animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name}</option>
                ))}
              </select>

              <select name='doctor' value={updateFormData.doctor.id} onChange={(e) => setUpdateFormData({...updateFormData, doctor: {id: e.target.value}})}>
                <option value=''>Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>

              <div className='flx'>
                <span>Appointment Date</span><input type="datetime-local" name='appointmentDate' value={updateFormData.appointmentDate} onChange={(e) => setUpdateFormData({...updateFormData, appointmentDate: e.target.value})} />
              </div> 

              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Appointment</h3>
          <form onSubmit={handleSubmit} className='saveForm'>

            <div className='flx'>
              <span>Appointment Date</span><input type="datetime-local" name='appointmentDate' value={formData.appointmentDate} onChange={handleChange} />
            </div>

            <select name='animal' onChange={handleAnimalChange} value={formData.animal.name}>
              <option value=''>Select animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name}</option>
              ))}
            </select>
            <select name='doctor' onChange={handleDoctorChange} value={formData.doctor.name}>
              <option value=''>Select doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>

            
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
