import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Index from './components/Index';
import Personnel from './components/Personnel';
import Medications from './components/Medications';
import Patients from './components/Patients';
import Patient from './components/Patient';
import AddMedicalRecord from './components/AddMedicalRecord';
import ViewMedicalRecord from './components/ViewMedicalRecord';

const NotFoundContent = () => {
  return (
    <div className='App'>
      <h1>404 Not Found</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundContent />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<Index />} />
        <Route exact path="/personnel" element={<Personnel />} />
        <Route exact path="/medications" element={<Medications />} />
        <Route exact path="/patients" element={<Patients />} />
        <Route exact path="/patient/:id" element={<Patient />} />
        <Route exact path="/medical_record/:id/add" element={<AddMedicalRecord />} />
        <Route exact path="/medical_record/:medicalRecordNumber/:id" element={<ViewMedicalRecord />} />
      </Routes>
    </Router>
  );
}

export default App;
