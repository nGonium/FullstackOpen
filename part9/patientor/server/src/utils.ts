import {
  NewPatient,
  Gender,
  NewHealthCheckEntry,
  NewOccupationalHealthcareEntry,
  NewHospitalEntry,
  BaseEntry,
  Diagnosis,
  UnionOmit,
  HealthCheckRating,
} from './types';

export const toNewEntry = (object: unknown) => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    !(
      'type' in object &&
      'description' in object &&
      'date' in object &&
      'specialist' in object
    )
  ) {
    throw new Error('Missing fields in medical entry');
  }
  if (typeof object.type !== 'string') {
    throw new Error('Invalid medical entry type');
  }

  const baseEntry: UnionOmit<BaseEntry, 'id' | 'type'> = {
    date: parseDate(object.date),
    description: parseString(object.description),
    specialist: parseString(object.specialist),
  };

  if ('diagnosisCodes' in object) {
    if (!Array.isArray(object.diagnosisCodes)) {
      throw new Error('Malformatted parameter diagnosisCodes');
    }
    baseEntry.diagnosisCodes = parseDiagnosisCodes(object);
  }

  switch (object.type) {
    case 'HealthCheck': {
      if (!('healthCheckRating' in object)) {
        throw new Error('Missing parameter');
      }
      const entry: NewHealthCheckEntry = {
        ...baseEntry,
        type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
      return entry;
    }
    case 'OccupationalHealthcare': {
      if (!('employerName' in object)) {
        throw new Error('Missing parameter');
      }
      const entry: NewOccupationalHealthcareEntry = {
        ...baseEntry,
        type: object.type,
        employerName: parseString(object.employerName),
      };
      if ('sickLeave' in object) {
        if (typeof object.sickLeave !== 'object' || object.sickLeave === null) {
          throw new Error('invalid parameter sickLeave');
        }
        const { sickLeave } = object;
        if (!('startDate' in sickLeave && 'endDate' in sickLeave)) {
          throw new Error('missing parameters in sickLeave');
        }
        entry.sickLeave = {
          startDate: parseDate(sickLeave.startDate),
          endDate: parseDate(sickLeave.endDate),
        };
      }
      return entry;
    }
    case 'Hospital': {
      if (
        !(
          'discharge' in object &&
          typeof object.discharge === 'object' &&
          object.discharge !== null &&
          'date' in object.discharge &&
          'criteria' in object.discharge
        )
      ) {
        throw new Error('Missing parameter');
      }
      const entry: NewHospitalEntry = {
        ...baseEntry,
        type: object.type,
        discharge: {
          criteria: parseString(object.discharge.criteria),
          date: parseDate(object.discharge.date),
        },
      };
      return entry;
    }
    default:
      throw new Error('Invalid medical entry type');
  }
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

// Type guard asserts type in compiler if TRUE is returned
// Predicate (text is string) is asserted on that variable on subsequent calls
const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error(`Expected string, received ${typeof text}`);
  }
  return text;
};
const isNumber = (num: unknown): num is number =>
  typeof num === 'number' && !isNaN(num);

// const parseNumber = (num: unknown): number => {
//   if (!num || !isNumber(num)) {
//     throw new Error(`Expected number, received ${typeof num}`);
//   }
//   return num;
// };

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));
const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating =>
  Object.values(HealthCheckRating).includes(param);
const parseHealthCheckRating = (param: unknown): HealthCheckRating => {
  if (!isNumber(param) || !isHealthCheckRating(param)) {
    throw Error('Invalid value for healthCheckRating');
  }
  return param;
};

const isGender = (gender: string): gender is Gender =>
  Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Gender missing or of non-acceptable value' + gender);
  }
  return gender;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};
