import express from 'express';
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
  const diagnoses = diagnosisService.getEntries();
  res.send(diagnoses);
});

export default router;
