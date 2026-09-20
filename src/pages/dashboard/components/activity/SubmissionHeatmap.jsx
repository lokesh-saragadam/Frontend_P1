
import { ActivityCalendar } from 'react-activity-calendar';

export default function SubmissionHeatmap({ submissionCountsByDate }){
    const countsByDate = submissionCountsByDate;
    const calendarDays = Object.entries(countsByDate).map(([date, count]) => ({
    date,
    count,
    level: Math.min(count, 4) // Maps to color levels 0-4
  }));

  // Sort chronologically (required by the library)
  calendarDays.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!calendarDays.length) return <p>No submission activity yet.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <ActivityCalendar 
        data={calendarDays} 
        theme={{
          light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        }}
        colorScheme="light"
      />
    </div>
  );
}