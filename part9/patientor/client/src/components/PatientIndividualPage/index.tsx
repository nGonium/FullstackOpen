import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import { Diagnosis, Patient } from '../../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import MedicalEntries from './MedicalEntries';
import HealthCheckForm from './HealthCheckForm';
import diagnosesService from '../../services/diagnoses';

const PatientIndividualPage = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  useEffect(() => {
    if (patientId === undefined) return;
    patientService.getById(patientId).then((patient) => setPatient(patient));
  }, [patientId]);
  const [diagnosesDictionary, setDiagnosesDictiory] = useState<Diagnosis[]>([]);
  useEffect(() => {
    diagnosesService.getAll().then((data) => setDiagnosesDictiory(data));
  });

  if (!patient)
    return (
      <div>
        <h2>404 Patient not found</h2>
        <p>
          Error: could not find patient with id: {patientId ?? 'missing id'}
        </p>
      </div>
    );

  const { name, ssn, gender, occupation, entries } = patient;
  let genderIcon;
  switch (gender) {
    case 'male':
      genderIcon = <MaleIcon />;
      break;
    case 'female':
      genderIcon = <FemaleIcon />;
      break;
    default:
      genderIcon = <TransgenderIcon />;
  }
  return (
    <>
      <h2>
        {name} {genderIcon}
      </h2>
      <p>
        SSN: {ssn}
        <br />
        occupation: {occupation}
      </p>
      <HealthCheckForm diagnoses={diagnosesDictionary} />
      <MedicalEntries entries={entries} diagnoses={diagnosesDictionary} />
    </>
  );
};

export default PatientIndividualPage;
