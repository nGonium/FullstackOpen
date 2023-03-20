import {
  Alert,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientsService from '../../services/patients';
import { Diagnosis, EntryFormValues } from '../../types';

interface FormNotification {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

type EntryType = 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
function isType(x: string): x is EntryType {
  return ['HealthCheck', 'Hospital', 'OccupationalHealthcare'].includes(x);
}

const now = new Date();
const nowFormatted = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

interface Props {
  diagnoses: Diagnosis[];
}

const HealthCheckForm: React.FC<Props> = ({ diagnoses }) => {
  const { id: patientId } = useParams();
  const [formNotification, setFormNotification] = useState<
    FormNotification | undefined
  >();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [type, setType] = useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(nowFormatted);
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [discharge, setDischarge] = useState({
    date: nowFormatted,
    criteria: '',
  });
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState({
    startDate: nowFormatted,
    endDate: nowFormatted,
  });
  const [diagnosesCodes, setDiagnosesCodes] = useState<Diagnosis['code'][]>([]);
  if (!patientId) {
    console.error('Incorrect use of component');
    return null;
  }
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const submitFormData = async (formData: EntryFormValues) => {
      try {
        const createdEntry = await PatientsService.createEntry(
          patientId,
          formData
        );
        setFormNotification({
          type: 'success',
          message: `Created new entry: ${createdEntry.description}`,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setFormNotification({ type: 'error', message: error.response?.data });
          return;
        }
        setFormNotification({ type: 'error', message: `Something went wrong` });
      }
    };
    switch (type) {
      case 'HealthCheck': {
        const formData: EntryFormValues = {
          type,
          description,
          date,
          specialist,
          healthCheckRating,
        };
        if (diagnosesCodes.length > 0) {
          formData.diagnosisCodes = diagnosesCodes;
        }
        submitFormData(formData);
        break;
      }
      case 'Hospital': {
        const formData: EntryFormValues = {
          type,
          description,
          date,
          specialist,
          discharge,
        };
        if (diagnosesCodes.length > 0) {
          formData.diagnosisCodes = diagnosesCodes;
        }
        submitFormData(formData);
        break;
      }
      case 'OccupationalHealthcare': {
        const formData: EntryFormValues = {
          type,
          description,
          date,
          specialist,
          employerName,
        };
        if (sickLeave) {
          formData.sickLeave = sickLeave;
        }
        if (diagnosesCodes.length > 0) {
          formData.diagnosisCodes = diagnosesCodes;
        }
        submitFormData(formData);
        break;
      }
    }
  };

  if (isCollapsed)
    return <Button onClick={() => setIsCollapsed(false)}>Add entry</Button>;

  return (
    <Card>
      <Grid padding="1rem" display="flex" flexDirection="column" gap="0.5rem">
        {formNotification && (
          <Alert severity={formNotification.type}>
            {formNotification.message}
          </Alert>
        )}
        <Select
          value={type}
          onChange={(e) => {
            if (!isType(e.target.value)) {
              throw new Error('Invalid entry form type');
            }
            setType(e.target.value);
          }}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
        <Typography component="h2" variant="h6" fontWeight="bold">
          New {type} entry
        </Typography>
        <TextField
          label="Description"
          variant="filled"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          type="date"
          label="Date"
          variant="filled"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          label="Specialist"
          variant="filled"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
        />
        {type === 'HealthCheck' && (
          <TextField
            type="number"
            label="Healthcheck rating"
            variant="filled"
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(Number(e.target.value))}
          />
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              type="date"
              label="Discharge date"
              variant="filled"
              value={discharge.date}
              onChange={(e) =>
                setDischarge((d) => ({ ...d, date: e.target.value }))
              }
            />
            <TextField
              type="text"
              label="Discharge criteria"
              variant="filled"
              value={discharge.criteria}
              onChange={(e) =>
                setDischarge((d) => ({ ...d, criteria: e.target.value }))
              }
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              type="text"
              label="Employer name"
              variant="filled"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />
            <TextField
              type="date"
              label="Sick leave start date"
              variant="filled"
              value={sickLeave.startDate}
              onChange={(e) =>
                setSickLeave((sl) => ({ ...sl, startDate: e.target.value }))
              }
            />
            <TextField
              type="date"
              label="Sick leave end date"
              variant="filled"
              value={sickLeave.endDate}
              onChange={(e) =>
                setSickLeave((sl) => ({ ...sl, endDate: e.target.value }))
              }
            />
          </>
        )}
        <FormControl fullWidth>
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            variant="filled"
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosesCodes}
            onChange={(e) => {
              setDiagnosesCodes(
                typeof e.target.value === 'string'
                  ? [e.target.value]
                  : e.target.value
              );
            }}
          >
            {diagnoses.map(({ code }) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid display="flex" gap="1rem">
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsCollapsed(true)}
          >
            CANCEL
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            SUBMIT
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default HealthCheckForm;
