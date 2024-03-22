import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Animal = () => {
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    color: '',
    customer: ''
  });
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    color: '',
    customer: ''
  });
  const [customers, setCustomers] = useState([]);
  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchAnimals();
    fetchCustomers();
  }, []);

  const fetchAnimals = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animals/all`)
      .then(response => {
        setAnimals(response.data);
        setFilteredAnimals(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const fetchCustomers = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/all`)
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const searchByName = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      noti("Please enter a name to search!", "error");
      setFilteredAnimals(animals);
      return;
    }
    const filtered = animals.filter(animal =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnimals(filtered);
    if (filtered.length === 0) {
      noti("No results found!", "warning");
    } else {
      noti("Search results updated successfully!", "success");
    }
  };

  const handleDelete = (id) => {

    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/animals/delete/${id}`)
        .then(response => {
          setAnimals(animals.filter(animal => animal.id !== id));
          setFilteredAnimals(filteredAnimals.filter(animal => animal.id !== id));
          noti("Animal removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedAnimalId(id);
    const selectedAnimal = animals.find(animal => animal.id === id);
    if (selectedAnimal) {
      setUpdateFormData({
        name: selectedAnimal.name,
        species: selectedAnimal.species,
        breed: selectedAnimal.breed,
        gender: selectedAnimal.gender,
        dateOfBirth: selectedAnimal.dateOfBirth,
        color: selectedAnimal.color,
        customer: {id: selectedAnimal.customer}
      });
      setShowUpdateForm(true);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'customer') {
      setFormData({
        ...formData,
        customer: { id: e.target.value }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/animals/save`, formData)
      .then(response => {
        fetchAnimals();
        setFormData({
          name: '',
          species: '',
          breed: '',
          gender: '',
          dateOfBirth: '',
          color: '',
          customer: ''
        });
        noti("Animal added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/animals/update/${selectedAnimalId}`, updateFormData)
      .then(response => {
        noti("Animal updated successfully!", "success");
        fetchAnimals();
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
        <h3 className='item-title'>Animal Panel</h3>

        <form onSubmit={searchByName} className='searchForm'>
          <input 
            type="text" 
            placeholder='Search by name' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button type='submit'>Search</button>
        </form>

        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Gender</th>
              <th>Birth date</th>
              <th>Color</th>
              <th>Customer</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(item => (
                <tr key={item.id} className='item-data'>
                  <td>{item.name}</td>
                  <td>{item.species}</td>
                  <td>{item.breed}</td>
                  <td>{item.gender}</td>
                  <td>{item.dateOfBirth}</td>
                  <td>{item.color}</td>
                  <td>{item.customer.name}</td>
                  <td><button className='remove' onClick={() => handleDelete(item.id)}><IoIosRemoveCircle /></button></td>
                  <td><button className='update' onClick={() => handleUpdateClick(item.id)}><FaRegEdit /></button></td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {showUpdateForm && (
          <div className='item-update'>
            <div className="notification">
              <button className='item-update-button' type="button" onClick={handleUpdateClose}><IoIosCloseCircle /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className='updateForm'>
              <input type="text" name='name' value={updateFormData.name} onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})} placeholder='Name' />
              <input type="text" name='species' value={updateFormData.species} onChange={(e) => setUpdateFormData({...updateFormData, species: e.target.value})} placeholder="Species" />
              <input type="text" name='breed' value={updateFormData.breed} onChange={(e) => setUpdateFormData({...updateFormData, breed: e.target.value})} placeholder='Breed' />

              <select name='gender' value={updateFormData.gender} onChange={(e) => setUpdateFormData({...updateFormData, gender: e.target.value})} placeholder='Gender'>
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              <div className='flx'>
              <span>Birth Day</span><input type="date" name="dateOfBirth" value={updateFormData.dateOfBirth} onChange={(e) => setUpdateFormData({...updateFormData, dateOfBirth: e.target.value})}/>
              </div>
              <input type="text" name='color' value={updateFormData.color} onChange={(e) => setUpdateFormData({...updateFormData, color: e.target.value})} placeholder="Color" />

              <select name='customer' value={updateFormData.customer.name} onChange={(e) => setUpdateFormData({...updateFormData, customer: {id:e.target.value}})}>
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>

              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Animal</h3>
          <form onSubmit={handleSubmit} className='saveForm'>
            <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Name' />
            <input type="text" name='species' value={formData.species} onChange={handleChange} placeholder="Species" />
            <input type="text" name='breed' value={formData.breed} onChange={handleChange} placeholder='Breed' />
            <select name='gender' value={formData.gender} onChange={handleChange} placeholder='Gender'>
              <option value="">Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>

            <div className='flx'>
            <span>Birth Day</span><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}/>
            </div>
            
            <input type="text" name='color' value={formData.color} onChange={handleChange} placeholder="Color" />
            <select name='customer' value={formData.customer.id} onChange={handleChange}>
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
            </select>
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Animal;
