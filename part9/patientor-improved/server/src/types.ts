import { z } from 'zod';

// Universal / utility
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

const isDate = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));

// Entry
export const baseEntrySchema = z.object({
  id: z.string(),
  type: z.enum(['HealthCheck', 'OccupationalHealthcare', 'Hospital']),
  description: z.string(),
  date: z.string().refine(isDate, 'invalid date'),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});
// type BaseEntry = z.infer<typeof baseEntrySchema>;

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}
const healthCheckRatingEnum = z.nativeEnum(HealthCheckRating);

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: healthCheckRatingEnum,
});
export type HealthCheckEntry = z.infer<typeof healthCheckEntrySchema>;

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(3).max(64),
  description: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});
export type OccupationalHealthcareEntry = z.infer<
  typeof occupationalHealthcareEntrySchema
>;

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});
export type HospitalEntry = z.infer<typeof hospitalEntrySchema>;

export const entrySchema = z.union([
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);
export type Entry = z.infer<typeof entrySchema>;
export const newEntrySchema = z.union([
  hospitalEntrySchema.omit({ id: true }),
  occupationalHealthcareEntrySchema.omit({ id: true }),
  healthCheckEntrySchema.omit({ id: true }),
]);
export type NewEntry = z.infer<typeof newEntrySchema>;
export type EntryFormValues = UnionOmit<Entry, 'id'>;

// Patient
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
const genderSchema = z.nativeEnum(Gender);
// type Gender = z.infer<typeof gender>

const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
  ssn: z.string(),
  occupation: z.string(),
  gender: genderSchema,
  dateOfBirth: z.string(),
  entries: z.array(entrySchema),
});
export type Patient = z.infer<typeof patientSchema>;

const patientFormValuesSchema = patientSchema.omit({ id: true, entries: true });
export type PatientFormValues = z.infer<typeof patientFormValuesSchema>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
export const newPatientSchema = patientSchema.omit({ id: true });
export type NewPatient = z.infer<typeof newPatientSchema>;
// export type NewPatient = Omit<Patient, 'id'>;

// Diagnosis
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// interface BaseEntry {
//   id: string;
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes?: Array<Diagnosis['code']>;
// }

// type HealthCheckRating = z.infer<typeof healthCheckRating>

// export enum HealthCheckRating {
//   'Healthy' = 0,
//   'LowRisk' = 1,
//   'HighRisk' = 2,
//   'CriticalRisk' = 3,
// }

// export interface HealthCheckEntry extends BaseEntry {
//   type: 'HealthCheck';
//   healthCheckRating: HealthCheckRating;
// }

// export interface OccupationalHealthcareEntry extends BaseEntry {
//   type: 'OccupationalHealthcare';
//   employerName: string;
//   description: string;
//   sickLeave?: {
//     startDate: string;
//     endDate: string;
//   };
// }

// export interface HospitalEntry extends BaseEntry {
//   type: 'Hospital';
//   discharge: {
//     date: string;
//     criteria: string;
//   };
// }

// export type Entry =
//   | HospitalEntry
//   | OccupationalHealthcareEntry
//   | HealthCheckEntry;

// export type EntryFormValues = UnionOmit<Entry, 'id'>;

// export interface Patient {
//   id: string;
//   name: string;
//   ssn: string;
//   occupation: string;
//   gender: Gender;
//   dateOfBirth: string;
//   entries: Entry[];
// }

// export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
// export type NewPatient = Omit<Patient, 'id'>;
// export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

// // Define special omit for unions
// export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
//   ? Omit<T, K>
//   : never;

// export interface Diagnosis {
//   code: string;
//   name: string;
//   latin?: string;
// }

// export enum Gender {
//   Male = 'male',
//   Female = 'female',
//   Other = 'other',
// }

// export enum EntryType {
//   HealthCheck = 'HealthCheck',
//   OccupationalHealthcare = 'OccupationalHealthcare',
//   Hospital = 'Hospital',
// }

// export interface BaseEntry {
//   id: string;
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes?: Array<Diagnosis['code']>;
// }

// export enum HealthCheckRating {
//   'Healthy' = 0,
//   'LowRisk' = 1,
//   'HighRisk' = 2,
//   'CriticalRisk' = 3,
// }

// export interface HealthCheckEntry extends BaseEntry {
//   type: 'HealthCheck';
//   healthCheckRating: HealthCheckRating;
// }

// // Define Entry without the 'id' property
// export type NewHealthCheckEntry = UnionOmit<HealthCheckEntry, 'id'>;

// export interface OccupationalHealthcareEntry extends BaseEntry {
//   type: 'OccupationalHealthcare';
//   employerName: string;
//   sickLeave?: {
//     startDate: string;
//     endDate: string;
//   };
// }
// export type NewOccupationalHealthcareEntry = UnionOmit<
//   OccupationalHealthcareEntry,
//   'id'
// >;

// export interface HospitalEntry extends BaseEntry {
//   type: 'Hospital';
//   discharge: {
//     date: string;
//     criteria: string;
//   };
// }

// export type NewHospitalEntry = UnionOmit<HospitalEntry, 'id'>;

// export type Entry =
//   | HospitalEntry
//   | OccupationalHealthcareEntry
//   | HealthCheckEntry;

// export type NewEntry = UnionOmit<Entry, 'id'>;

// export interface Patient {
//   id: string;
//   name: string;
//   ssn: string;
//   occupation: string;
//   gender: Gender;
//   dateOfBirth: string;
//   entries: Entry[];
// }

// export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
// export type NewPatient = Omit<Patient, 'id'>;
