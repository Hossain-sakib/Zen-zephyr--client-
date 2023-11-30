import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DataPieChart = ({ totalUsers, totalPosts, totalComments, totalVotes }) => {
  const data = [
    { name: 'Total Users', value: totalUsers },
    { name: 'Total Posts', value: totalPosts },
    { name: 'Total Comments', value: totalComments },
    { name: 'Total Votes', value: totalVotes },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

DataPieChart.propTypes = {
  totalUsers: PropTypes.number,
  totalPosts: PropTypes.number,
  totalComments: PropTypes.number,
  totalVotes: PropTypes.number,
}

export default DataPieChart;
