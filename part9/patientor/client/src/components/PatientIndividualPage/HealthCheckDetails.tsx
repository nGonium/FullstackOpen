import {
  Diagnosis,
  HealthCheckEntry as HealthCheckEntryType,
} from '../../types';
import EntryBox from './EntryBox';
import HealthRating from './HealthRating';

interface Props {
  entry: HealthCheckEntryType;
  getDiagnoses: (diagnosisCodes: Diagnosis['code'][]) => Diagnosis[];
}

const HealthCheckDetails = ({ entry, getDiagnoses }: Props) => {
  const {
    date,
    type,
    description,
    healthCheckRating,
    specialist,
    diagnosisCodes,
  } = entry;
  const diagnoses = diagnosisCodes && getDiagnoses(diagnosisCodes);

  return (
    <EntryBox>
      <p>
        {date} {type}
      </p>
      <p>
        <em>{description}</em>
      </p>
      <HealthRating rating={healthCheckRating} />
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

export default HealthCheckDetails;
