import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getNonSensitiveEntries();
  res.send(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientService.getEntryById(req.params.id);
  if (!patient) {
    res.status(404).send();
  } else {
    res.send(patient);
  }
});

router.post('/:id/entries', (req, res) => {
  const patientId = req.params.id;
  const patient = patientService.getEntryById(patientId);
  if (!patient) {
    res.status(404).send();
    return;
  }
  try {
    const createdEntry = patientService.addMedicalEntry(
      patientId,
      toNewEntry(req.body)
    );
    patient.entries.push(createdEntry);
    res.status(201).send(createdEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) errorMessage = error.message;
    res.status(400).send(errorMessage);
  }
});

router.post('/', (req, res) => {
  try {
    const addedEntry = patientService.addPatient(toNewPatient(req.body));
    res.send(addedEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) errorMessage += error.message;
    res.status(400).send(errorMessage);
  }
});

export default router;
