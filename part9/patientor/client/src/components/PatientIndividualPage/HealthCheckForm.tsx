import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientsService from '../../services/patients';
import { EntryFormValues, Patient } from '../../types';

const HealthCheckForm: React.FC = () => {
  const { id: patientId } = useParams();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [diagnosesString, setDiagnosesString] = useState('');
  if (!patientId) {
    console.error('Incorrect use of component');
    return null;
  }
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const formData: EntryFormValues = {
      type: 'HealthCheck',
      description,
      date,
      specialist,
      healthCheckRating,
    };
    if (diagnosesString) {
      formData.diagnosisCodes = diagnosesString.split(', ');
    }
    // console.dir(formData);
    try {
      const createdEntry = await PatientsService.createEntry(
        patientId,
        formData
      );
      console.log('success');
      console.dir(createdEntry);
    } catch (error) {
      console.log('failure');
      console.dir(error);
    }
  };

  return (
    <Card>
      <Grid padding="1rem" display="flex" flexDirection="column" gap="0.5rem">
        <Typography component="h2" variant="h6" fontWeight="bold">
          New HealthCheck entry
        </Typography>
        <TextField
          label="Description"
          variant="filled"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          type="date"
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
        <TextField
          type="number"
          label="Healthcheck rating"
          variant="filled"
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(Number(e.target.value))}
        />
        <TextField
          label="Diagnosis codes"
          variant="filled"
          value={diagnosesString}
          onChange={(e) => setDiagnosesString(e.target.value)}
        />

        <Grid display="flex" gap="1rem">
          <Button variant="outlined" color="error">
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
