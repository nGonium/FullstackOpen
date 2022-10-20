// Accepted types: error, success
const Notification = ({ notification, setNotification }) => {
  if (notification === null) return null
  
  const TIMEOUT_TIME = 5000
  const { text, type } = notification
  const color = 
    type === 'error' ? 'red' 
    : type === 'success' ? 'green' 
    : 'gray'
  
  const notificationStyle = {
    fontSize: '20px',
    padding: '10px',
    border: `2px solid ${color}`,
    borderRadius: '4px',
    color: color,
    width: '100%',
    display: 'block',
    backgroundColor: '#ccc',
  }
  setTimeout(() => setNotification(null), TIMEOUT_TIME)
  return <p style={notificationStyle}>{text}</p>
}

export default Notification