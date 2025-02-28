import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const TimePickerValue = () => {
  const [value, setValue] = useState(dayjs('2022-04-17T16:30')); // Initial controlled value set to one hour ahead of uncontrolled value
  const [uncontrolledValue, setUncontrolledValue] = useState(dayjs('2022-04-17T15:30'));

  const handleUncontrolledChange = (newValue) => {
    setUncontrolledValue(newValue);
    setValue(newValue.add(1, 'hour')); // Set controlled value to one hour ahead
  };

  const handleControlledChange = (newValue) => {
    const diffInHours = newValue.diff(uncontrolledValue, 'hour', true); // Include fractional hours
    if (Math.abs(diffInHours) <= 1) {
      setValue(newValue);
    } else {
      alert('The time difference must be within one hour.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker']}>
        <TimePicker
          label="From"
          defaultValue={uncontrolledValue}
          onChange={handleUncontrolledChange}
        />
        <TimePicker
          label="TO"
          value={value}
          onChange={handleControlledChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default TimePickerValue;
