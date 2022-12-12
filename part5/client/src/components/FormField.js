import PropTypes from "prop-types"

const FormField = ({ name, value, onFieldInput }) => {
  return (
    <div>
      {name}
      <input name={name} value={value} onChange={onFieldInput} />
    </div>
  )
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFieldInput: PropTypes.func.isRequired,
}

export default FormField
