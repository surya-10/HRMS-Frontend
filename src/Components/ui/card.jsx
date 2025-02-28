import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  console.log(props)
  return (
    <div
      className={`rounded-lg  bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 border-b ${className}`} {...props}>
      {children}
    </div>
  );
};
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h2>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
