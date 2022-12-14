// import { useDispatch } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';
import { connect } from 'react-redux';

const Filter = ({ setFilter }) => {
  // const dispatch = useDispatch();
  const handleChange = (e) => {
    // input-field value is in variable event.target.value
    // dispatch(setFilter(e.target.value));
    setFilter(e.target.value);
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

const mapDispatchToProps = { setFilter };
export default connect(null, mapDispatchToProps)(Filter);
