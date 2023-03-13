import patientData from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';

const patients: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuidv4();
  const addedPatient: Patient = { ...patient, id };
  patients.push(addedPatient);
  return addedPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
