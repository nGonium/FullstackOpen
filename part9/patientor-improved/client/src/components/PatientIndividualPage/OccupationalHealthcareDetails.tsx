import { Diagnosis, OccupationalHealthcareEntry } from '../../types';
import EntryBox from './EntryBox';

interface Props {
  entry: OccupationalHealthcareEntry;
  getDiagnoses: (diagnosisCodes: Diagnosis['code'][]) => Diagnosis[];
}

const OccupationalHealthcareDetails = ({ entry, getDiagnoses }: Props) => {
  const { date, type, description, specialist, diagnosisCodes } = entry;
  const diagnoses = diagnosisCodes && getDiagnoses(diagnosisCodes);
  return (
    <EntryBox>
      <p>
        {date} {type}
      </p>
      <p>
        <em>{description}</em>
      </p>
      <p>diagnosed by {specialist}</p>
      <ul>
        {diagnoses?.map(({ code, name }, idx) => (
          <li key={idx}>
            {code}: {name}
          </li>
        ))}
      </ul>
    </EntryBox>
  );
};

export default OccupationalHealthcareDetails;
