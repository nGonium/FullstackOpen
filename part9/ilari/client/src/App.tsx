// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { DiaryEntry } from './typesServer';
import { useEffect, useState } from 'react';
import DiaryEntries from './components/DiaryEntries';
import AddDiaryEntryForm from './components/AddDiaryEntryForm';
import { getAllDiaryEntries } from './services/diaryEntryService';

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const addDiaryEntry = (diaryEntry: DiaryEntry) => {
    setDiaryEntries((diaryEntries) => diaryEntries.concat(diaryEntry));
  };
  useEffect(() => {
    getAllDiaryEntries().then(
      (diaryEntries) => diaryEntries && setDiaryEntries(diaryEntries)
    );
  }, []);

  return (
    <div className="App">
      <div>
        <AddDiaryEntryForm addDiaryEntry={addDiaryEntry} />
        <DiaryEntries diaryEntries={diaryEntries} />
      </div>
    </div>
  );
}

export default App;
