import { Diagnosis, Entry } from '../../types';
import HealthCheckDetails from './HealthCheckDetails';
import OccupationalHealthcareDetails from './OccupationalHealthcareDetails';
import HospitalDetails from './HospitalDetails';

interface Props {
  entry: Entry;
  getDiagnoses: (diagnosisCodes: Diagnosis['code'][]) => Diagnosis[];
}

const assertNever = (param: never) => {
  throw new Error(`Invalid entry: ${param}`);
};

const EntryDetails = ({ entry, getDiagnoses }: Props) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckDetails entry={entry} getDiagnoses={getDiagnoses} />;
    case 'Hospital':
      return <HospitalDetails entry={entry} getDiagnoses={getDiagnoses} />;
    case 'OccupationalHealthcare':
      return (
        <OccupationalHealthcareDetails
          entry={entry}
          getDiagnoses={getDiagnoses}
        />
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
