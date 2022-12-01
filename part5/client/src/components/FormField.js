const FormField = ({ name, value, onFieldInput }) => {
  return (
    <div>
      {name}
      <input name={name} value={value} onChange={onFieldInput} />
    </div>
  );
};

export default FormField;
