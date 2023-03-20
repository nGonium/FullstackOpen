import axios from 'axios';
import { Diagnosis } from '../types';

const baseUrl = `http://localhost:3001/api/diagnoses`;

const getAll = (): Promise<Diagnosis[]> => {
  return axios.get(baseUrl).then((res) => res.data);
};

const diagnosesService = {
  getAll,
};

export default diagnosesService;
