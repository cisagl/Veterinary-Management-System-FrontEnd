import './home.css';

const App = () => {
  return (
    <div className="home">
      <div className="container">
        <h1 className="heading">Welcome to the Veterinary Management System</h1>
        <p className="description">Thank you for choosing our comprehensive Veterinary Management System (VMS) to streamline your clinic's operations. Our platform offers a wide range of features designed to optimize the management of your veterinary practice.</p>
        
        <h2 className="subheading">Key Features</h2>
        <ul className="feature-list">
          <li className="feature-item"><strong>Appointment Management:</strong> Easily schedule, modify, and cancel appointments with our intuitive interface. Keep track of upcoming appointments and patient histories.</li>
          
          <li className="feature-item"><strong>Doctor Management:</strong> Manage your team of veterinarians efficiently. Add new doctors, update their information, and track their availability.</li>
          
          <li className="feature-item"><strong>Report Generation:</strong> Generate detailed reports on patient visits, treatments, and diagnoses. Analyze trends and make informed decisions to improve patient care.</li>
          
          <li className="feature-item"><strong>Vaccination Records:</strong> Maintain comprehensive vaccination records for all animals in your care. Keep track of vaccination schedules and ensure timely administration.</li>
          
          <li className="feature-item"><strong>User-Friendly Interface:</strong> Our user-friendly interface makes it easy for you and your staff to navigate the system and perform tasks efficiently.</li>
        </ul>
        
        <h2 className="subheading">Get Started</h2>
        <p className="description">To begin using the Veterinary Management System, simply explore the options available in the navigation bar above. Whether you need to schedule appointments, update patient records, or generate reports, our system has you covered.</p>
        
        <p className="description">If you have any questions or require assistance, don't hesitate to reach out to our support team. We're here to help you make the most of our system and ensure the smooth operation of your veterinary clinic.</p>
        
        <p className="description">Thank you for choosing VMS. We look forward to helping you manage your clinic more effectively and provide the best possible care to your patients.</p>
      </div>
    </div>
  );
};

export default App;