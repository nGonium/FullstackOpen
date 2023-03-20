import patientData from '../../data/patients';
import {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const patients: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return patients;
};

const getEntryById = (id: Patient['id']): Patient | undefined => {
  return patients.find((p) => p.id === id);
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

const addMedicalEntry = (patientId: Patient['id'], entry: NewEntry): Entry => {
  const patient = patientData.find(({ id }) => id === patientId);
  if (!patient) throw new Error(`No patient found with id: ${patientId}`);
  const entryId = uuidv4();
  const createdEntry: Entry = { ...entry, id: entryId };
  return createdEntry;
};

export default {
  getEntries,
  getEntryById,
  getNonSensitiveEntries,
  addPatient,
  addMedicalEntry,
};
