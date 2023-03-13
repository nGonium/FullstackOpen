import diagnosisData from '../../data/diagnoses';
import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnosisData;

const getEntries = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getEntries,
};
