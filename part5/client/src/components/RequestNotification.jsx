// import { useEffect, useState } from "react"

const statusColorMap = {
  success: "green",
  error: "red",
  info: "gray",
}

const RequestNotification = ({ status, message }) => {
  const messageColor = statusColorMap[status] ?? "gray"

  return (
    <div
      data-testid="request-notification"
      style={{
        backgroundColor: "lightgray",
        borderColor: messageColor,
        color: messageColor,
        border: "2px solid",
        padding: "0.5rem",
        borderRadius: "0.5em",
      }}
    >
      {message}
    </div>
  )
}

export default RequestNotification
