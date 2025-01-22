import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
const MessageBoard = ({ message }: { message: string}) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 m-4 lg:m-0 lg:w-full lg:h-full">
      <div className="bg-white shadow-md rounded-md p-2 w-[90%] m-2 text-center">
        <p className="text-xl my-5 font-semibold text-gray-700">{message}</p>
        <FontAwesomeIcon icon={faCircleQuestion}  style={{ color: '#28a745', fontSize: '100px' }} />
      </div>
    </div>
  );
};

export default MessageBoard;