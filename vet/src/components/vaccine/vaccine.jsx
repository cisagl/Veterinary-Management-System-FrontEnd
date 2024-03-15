import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vaccine = () => {
  const [vaccines, setVaccines] = useState([]);
  const [animals, setanimals] = useState([]);
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    code: null,
    protectionStartDate: null,
    protectionFinishDate: null,
    animal: '',
    reportId: null
  });
  const [updateFormData, setUpdateFormData] = useState({
    name: null,
    code: null,
    protectionStartDate: null,
    protectionFinishDate: null,
    animal: '',
    reportId: null
  });
  const [selectedvaccineId, setSelectedvaccineId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchVaccines();
    fetchAnimals();
    fetchReports();
  }, []);

  const fetchVaccines = () => {
    axios.get('http://localhost:8080/v1/vaccines/all')
      .then(response => {
        setVaccines(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchReports = () => {
    axios.get('http://localhost:8080/v1/reports/all')
      .then(response => {
        setReports(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchAnimals = () => {
    axios.get('http://localhost:8080/v1/animals/all')
      .then(response => {
        setanimals(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`http://localhost:8080/v1/vaccines/delete/${id}`)
        .then(response => {
          setVaccines(vaccines.filter(vaccine => vaccine.id !== id));
          noti("Vaccine removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedvaccineId(id);
    const selectedvaccine = vaccines.find(vaccine => vaccine.id === id);
    if (selectedvaccine) {
      setUpdateFormData({
        name: selectedvaccine.name,
        code: selectedvaccine.code,
        protectionStartDate: selectedvaccine.protectionStartDate,
        protectionFinishDate: selectedvaccine.protectionFinishDate,
        animal: selectedvaccine.animal,
        reportId: selectedvaccine.reportId
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
    axios.post('http://localhost:8080/v1/vaccines/save', formData)
      .then(response => {
        fetchVaccines();
        setFormData({
          name: null,
          code: null,
          protectionStartDate: null,
          protectionFinishDate: null,
          animal: '',
          reportId: null
        });
        noti("Vaccine added successfully!", "success");

      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };
  

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/${selectedvaccineId}`, updateFormData)
      .then(response => {
        fetchVaccines();
        setUpdateFormData({  
          name: null,
          code: null,
          protectionStartDate: null,
          protectionFinishDate: null,
          animal: '',
          reportId: null
        });
        noti("Vaccine updated successfully!", "success");

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
  
  
  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Vaccine Panel</h3>

        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Animal</th>
              <th>Protection Start Date</th>
              <th>Protection Finish Date</th>
              <th>Report</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.animal ? item.animal.name : 'Unknown animal'}</td>
                <td>{item.protectionStartDate}</td>
                <td>{item.protectionFinishDate}</td>
                <td>{item.report ? item.report.title : "Update for report"}</td>
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

              <input type="text" name="name" value={updateFormData.name} onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})} placeholder='Name' />
              <input type="text" name="code" value={updateFormData.code} onChange={(e) => setUpdateFormData({...updateFormData, code: e.target.value})} placeholder='Code' />

              <select name='animal' value={updateFormData.animal.id} 
              onChange={(e) => setUpdateFormData({...updateFormData, animal: {id: e.target.value}})}>
                <option value=''>Select animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name}</option>
                ))}
              </select>

              <select name="report" value={updateFormData.report} 
              onChange={(e) => setUpdateFormData({...updateFormData, reportId: e.target.value})}>
                <option value=''>Select report</option>
                {reports.map(report => (
                  <option key={report.id} value={report.id}>{report.title}</option>
                ))}
            </select>


              <div className='flx'>
              <span>Protection Start Date</span><input type="date" name='protectionStartDate' value={updateFormData.protectionStartDate} onChange={(e) => setUpdateFormData({...updateFormData, protectionStartDate: e.target.value})} />
              </div>
              <div className='flx'>
              <span>Protection Finish Date</span><input type="date" name='protectionFinishDate' value={updateFormData.protectionFinishDate} onChange={(e) => setUpdateFormData({...updateFormData, protectionFinishDate: e.target.value})} />
              </div>

              
              
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Vaccine</h3>
          <form onSubmit={handleSubmit} className='saveForm'>

            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Name' />
            <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder='Code' />

            <div className='flx'>
            <span>Protection Start Date</span><input type="date" name='protectionStartDate' value={formData.protectionStartDate} onChange={handleChange} />
            </div>
            <div className='flx'>
            <span>Protection Finish Date</span><input type="date" name='protectionFinishDate' value={formData.protectionFinishDate} onChange={handleChange} />
            </div>

            <select name='animal' onChange={handleAnimalChange} value={formData.animal.name}>
              <option value=''>Select animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name}</option>
              ))}
            </select>

            
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Vaccine;
