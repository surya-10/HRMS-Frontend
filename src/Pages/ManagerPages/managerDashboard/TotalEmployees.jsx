import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CircleChart = ({ data }) => {
    const generateColors = (length) => {
        return Array.from({ length }, () =>
            `#${Math.floor(Math.random() * 16777215).toString(16)}`
        );
    };

    const COLORS = generateColors(data.length);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className='shadow-lg'>
            <PieChart width={400} height={300}>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="designation"
                    cx="50%"
                    cy="45%"
                    outerRadius={120}
                    innerRadius={80}
                    // rotate={90}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} className="hover:opacity-90" />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: 'white', color: 'crimson' }}
                    itemStyle={{ color: 'purple' }}
                    cursor={{ fill: 'rgba(10, 0, 0, 0)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
        </div>
    );
};

export default CircleChart;
