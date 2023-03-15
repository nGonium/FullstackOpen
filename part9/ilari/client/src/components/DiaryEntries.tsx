import { DiaryEntry } from '../typesServer';
import React from 'react';

interface DiaryEntriesProps {
  diaryEntries: DiaryEntry[];
}

const DiaryEntries = ({ diaryEntries }: DiaryEntriesProps) => {
  return (
    <>
      <h2>Diary entries</h2>
      {diaryEntries.map(({ date, id, visibility, weather }) => (
        <React.Fragment key={id}>
          <p>
            <strong>{date}</strong>
          </p>
          <p>
            visibility: {visibility} <br />
            weather: {weather}
          </p>
        </React.Fragment>
      ))}
    </>
  );
};

export default DiaryEntries;
