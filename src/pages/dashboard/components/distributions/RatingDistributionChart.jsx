import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export function RatingDistributionChart({ problemCountsByRating }) {
  const chartData = Object.entries(problemCountsByRating).map(([rating, count]) => ({ rating, count }));
  
  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#E83E8C', '#20C997', '#007BFF', '#6610F2', '#FD7E14', '#28A745'  
  ];

  return (
    // Added flexbox column to center the title above the chart
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="Rating">
      
      {/* Centered Title - Moved OUTSIDE ResponsiveContainer */}
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Codeforces Rating</h3>
      
      <div style={{ width: 400, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="count"
              nameKey="rating"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}