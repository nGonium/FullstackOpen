import { Diagnosis, Entry } from '../../types';
import React from 'react';
import EntryDetails from './EntryDetails';
import { Grid } from '@mui/material';

interface Props {
  entries: Entry[];
  diagnoses: Diagnosis[];
}

const MedicalEntries = ({ entries, diagnoses: diagnosesDictionary }: Props) => {
  const getDiagnoses = (diagnosisCodes: Diagnosis['code'][]): Diagnosis[] => {
    if (!diagnosesDictionary)
      return diagnosisCodes.map((code) => ({ code, name: '' }));
    return diagnosisCodes.map((code) => ({
      code,
      name: diagnosesDictionary.find((v) => v.code === code)?.name || '',
    }));
  };

  const entryToJSX = (entry: Entry) => {
    // const { id, date, description, diagnosisCodes } = entry;
    const { id } = entry;
    const common = (
      <React.Fragment key={id}>
        {/* <p>
          {date} <em>{description}</em>
        </p>
        {diagnosisCodes && (
          <ul>
            {diagnosisCodes.map((code, idx) => (
              <li key={idx}>
                {code} {getDiagnosisDescription(code)}
              </li>
            ))}
          </ul>
        )} */}
        <EntryDetails entry={entry} getDiagnoses={getDiagnoses} />
      </React.Fragment>
    );
    return common;
  };
  return (
    <>
      <h2>entries</h2>
      <Grid container gap={1} flexDirection="column">
        {entries.map(entryToJSX)}
      </Grid>
    </>
  );
};

export default MedicalEntries;
