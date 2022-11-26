import axios from 'axios';
import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import Note from './components/Note';
import Notification from './components/Notification';
import noteService from './services/noteService';
// import './App.css'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2022
      </em>
    </div>
  );
};

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const displayedNotes = showAll
    ? notes
    : notes.filter(({ important }) => important === true);

  const addNote = (e) => {
    e.preventDefault();
    const note = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    noteService.create(note).then((created) => {
      setNotes(notes.concat(created));
      setNewNote('');
    });
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((updated) => {
        setNotes(notes.map((n) => (n.id !== id ? n : updated)));
      })
      .catch((err) => {
        setErrorMessage(`Note: "${note.content}" already deleted`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== n));
      });
  };

  useEffect(() => {
    noteService.getAll().then((received) => setNotes(received));
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {displayedNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          onChange={handleNoteChange}
          placeholder="A new note..."
          value={newNote}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
