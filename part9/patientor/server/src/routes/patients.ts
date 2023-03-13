import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getNonSensitiveEntries();
  res.send(patients);
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
