import { useEffect } from "react"
// Accepted types: error, success
const Notification = ({ notification, setNotification }) => {
  const TIMEOUT_TIME = 5000
  useEffect(() => {
    if (notification) {
      setTimeout(() => setNotification(null), TIMEOUT_TIME)
    }
  }, [notification, setNotification])
  
  if (notification === null) return null
  
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

  return <p style={notificationStyle}>{text}</p>
}

export default Notification