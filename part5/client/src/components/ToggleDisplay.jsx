const ToggleDisplay = ({ isVisible, children }) => (
  <div style={{ display: isVisible ? "" : "none" }}>{children}</div>
)

export default ToggleDisplay
