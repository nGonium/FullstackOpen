import { useState } from 'react';
import { createDiaryEntry } from '../services/diaryEntryService';
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from '../typesServer';

interface AddDiaryEntryProps {
  addDiaryEntry: (diaryEntry: DiaryEntry) => void;
}

const AddDiaryEntryForm = ({ addDiaryEntry }: AddDiaryEntryProps) => {
  const [errorNotification, setErrorNotification] = useState('');
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const handleSubmit = (e: React.SyntheticEvent) => {
    const formData: NewDiaryEntry = {
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    };
    createDiaryEntry(formData)
      .then((data) => addDiaryEntry(data as DiaryEntry))
      .catch((err) => {
        setErrorNotification(err);
      });
  };
  return (
    <>
      <h2>Add new entry</h2>
      {errorNotification !== '' && (
        <p style={{ color: 'red' }}>{errorNotification}</p>
      )}
      <label>
        date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <br />
      <fieldset>
        <legend>visibility</legend>
        {Object.values(Visibility).map((v) => (
          <label>
            {v}
            <input
              name="visibility"
              type="radio"
              value={v}
              onChange={(e) => setVisibility(e.target.value)}
            />
          </label>
        ))}
      </fieldset>
      <br />
      <fieldset>
        <legend>weather</legend>
        {Object.values(Weather).map((v) => (
          <label>
            {v}
            <input
              name="weather"
              type="radio"
              value={v}
              onChange={(e) => setWeather(e.target.value)}
            />
          </label>
        ))}
      </fieldset>
      <br />
      <label>
        comment
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSubmit}>add</button>
    </>
  );
};

export default AddDiaryEntryForm;
