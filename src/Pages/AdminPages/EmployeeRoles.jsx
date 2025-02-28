import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DepartmentChart = () => {
  const [chartWidth, setChartWidth] = useState(0);
  const chartContainerRef = useRef(null);
  let [show, setShow] = useState(false)

  const data = [
    { department: 'UI/UX', employees: 90 },
    { department: 'Development', employees: 110 },
    { department: 'Management', employees: 80 },
    { department: 'HR', employees: 20 },
    { department: 'Testing', employees: 60 },
    { department: 'Marketing', employees: 100 },
  ];

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };

    // Initial setup
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div ref={chartContainerRef} className="w-full p-4 bg-white rounded-lg shadow">
      {chartWidth > 0 && (
        <BarChart
          width={chartWidth}
          height={343}
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          barSize={15}
          barGap={6}
        >
          <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="department"
            type="category"
            tick={{ fill: '#000' }}
            fontSize={12}
          />
          <Tooltip />
          <Bar dataKey="employees" fill="#455d7a" radius={[0, 10, 10, 0]} />
        </BarChart>
      )}
    </div>
  );
};

const EmployeeRoles = () => {
  let [show, setShow] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setShow(true)
      }
      else {
        setShow(false)
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    return () =>{
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  return (
    <div className={` ${show ? "w-[49%]":"w-full"} space-y-3`}>
      <p className="text-gray-800 text-lg font-semibold">
        Employees By Department
      </p>
      <DepartmentChart />
    </div>
  );
};

export default EmployeeRoles;
