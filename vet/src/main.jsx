import ReactDOM from 'react-dom/client'
import App from './components/home/Home.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Customer from './components/customer/customer';
import Doctor from './components/doctor/doctor';
import Nav from './components/nav/nav';
import AvailableDate from './components/available-date/availableDate';
import Appointment from './components/appointment/appointment';
import Animal from './components/animal/animal';
import Report from './components/report/report';
import Vaccine from './components/vaccine/vaccine';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Nav />
        <Routes>
            <Route path="*" element={<App />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path='/appointment' element={<Appointment />} />
            <Route path='/animal' element={<Animal />} />
            <Route path='/report' element={<Report />} />
            <Route path="/vaccine" element={<Vaccine />} />
        </Routes>
    </BrowserRouter>
)