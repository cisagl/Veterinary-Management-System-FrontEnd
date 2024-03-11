import { IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import './table.css';

const Table = ({ data, onDelete, onUpdateClick }) => {
  return (
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
        {data.map(item => (
          <tr key={item.id} className='item-data'>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{item.mail}</td>
            <td>{item.address}</td>
            <td>{item.city}</td>
            <td><button className='remove' onClick={() => onDelete(item.id)}><IoIosRemoveCircle /></button></td>
            <td><button className='update' onClick={() => onUpdateClick(item.id)}><FaRegEdit /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
