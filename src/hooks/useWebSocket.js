import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // TODO: Initialize socket connection
    // const socketInstance = io(url);
    // setSocket(socketInstance);
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url]);

  return { socket, connected };
};

export default useWebSocket;
