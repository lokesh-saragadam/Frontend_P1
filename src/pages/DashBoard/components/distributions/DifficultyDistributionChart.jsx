import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

export function DifficultyDistributionChart({ overview }) {
  const problemCountsByDifficulty = { Easy: overview.easy, Medium: overview.medium, Hard: overview.hard };
  
  const chartData = Object.entries(problemCountsByDifficulty).map(([difficulty, count]) => ({
    difficulty: difficulty,
    count: count
  }));

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#28A745'; 
    if (difficulty === 'Medium' || difficulty === 'Difficult') return '#FFCE56'; 
    if (difficulty === 'Hard') return '#FF6384'; 
    return '#36A2EB'; 
  };

  return (
    // Added flexbox column to center the title above the chart
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="Difficulty">
      
      {/* Centered Title */}
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Leetcode Difficulty</h3>
      
      <div style={{ width: 400, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Attempted Problems">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.difficulty)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

