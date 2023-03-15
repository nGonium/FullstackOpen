import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../typesServer';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaryEntries = async () => {
  try {
    const res = await axios.get<DiaryEntry[]>(baseUrl);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export const createDiaryEntry = async (object: NewDiaryEntry) => {
  try {
    const res = await axios.post<DiaryEntry>(baseUrl, object);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      console.error(error);
      const errorMessage = error.response?.data || error.message || '';
      return Promise.reject(errorMessage);
    }
  }
};
