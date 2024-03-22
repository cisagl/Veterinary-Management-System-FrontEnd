import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle} from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import '../../table.css'
import cities from '../../assets/cities.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/all`)
      .then(response => {
        setCustomers(response.data);
        setSearchResult(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/delete/${id}`)
        .then(response => {
          setCustomers(customers.filter(customer => customer.id !== id));
          noti("Customer removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");        
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedCustomerId(id);
    const selectedCustomer = customers.find(customer => customer.id === id);
    if (selectedCustomer) {
      setFormData({
        nameUpdate: selectedCustomer.name,
        phoneUpdate: selectedCustomer.phone,
        addressUpdate: selectedCustomer.address,
        mailUpdate: selectedCustomer.mail,
        cityUpdate: selectedCustomer.city
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
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/save`, formData)
      .then(response => {
        fetchCustomers();
        setFormData({
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null
        });
        noti("Customer added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/update/${selectedCustomerId}`, {
      name: formData.nameUpdate,
      phone: formData.phoneUpdate,
      address: formData.addressUpdate,
      mail: formData.mailUpdate,
      city: formData.cityUpdate
    })
    .then(response => {
      fetchCustomers();
      setFormData({
        ...formData,
        nameUpdate: null,
        phoneUpdate: null,
        addressUpdate: null,
        mailUpdate: null,
        cityUpdate: null
      });
      noti("Customer updated successfully!", "success");
      setShowUpdateForm(false);
    })
    .catch(error => {
      noti(error.response.data.message, "error");    
    });
  };

  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const searchByName = (e) => {
    e.preventDefault();
    if (search !== '') {
      axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/customers/name?name=${search}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setSearchResult(response.data);
            noti("Search results updated successfully!", "success");
          } else if (typeof response.data === 'object') { 
            setSearchResult([response.data]); 
            noti("Search results updated successfully!", "success");
          } else {
            setSearchResult([]);
            noti("No results found!", "warning");
          }
        })
        .catch(error => {
          noti(error.response.data.message, "error");
        });
    } else {
      noti("Please enter a name to search!", "error");
      fetchCustomers();
    }
  };
  
  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Customer Panel</h3>


          <form className='searchForm' onSubmit={searchByName}>
            <input 
              type="text" 
              placeholder='Search by name' 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            <button type='submit'>Search</button>
          </form>


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
          {searchResult.map(item => (
            <tr key={item.id} className='item-data'>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.mail}</td>
              <td>{item.address}</td>
              <td>{item.city}</td>
              <td><button className='remove' onClick={() => handleDelete(item.id)}><IoIosRemoveCircle /></button></td>
              <td><button className='update' onClick={() => handleUpdateClick(item.id)}><FaRegEdit /></button></td>
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
          <h3 className='item-title'>Add Customer</h3>
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
    </div>
  );
};

export default Customer;
