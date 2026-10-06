import React, { useMemo } from 'react';

const DIFFICULTY_CLASS = {
  Easy: 'badge--easy',
  Medium: 'badge--medium',
  Hard: 'badge--hard',
};

/**
 * RecentActivity
 * Takes the `recentActivity` array straight from GET /dashboard.
 *
 * Expected shape (from dashboard/service.js -> getRecentActivity):
 * [
 *   {
 *     problemId: 123,
 *     title: "Merge Intervals",
 *     difficulty: "Medium" | null,
 *     rating: 1800 | null,          // Codeforces problems
 *     platform: "LeetCode",
 *     language: "Python3" | null,
 *     submittedAt: "2026-08-03T12:40:00Z",
 *     submittedAtRelative: "2 hours ago"
 *   },
 *   ...
 * ]
 */

// Assuming DIFFICULTY_CLASS is defined in your file or imported
// const DIFFICULTY_CLASS = { ... };

export default function RecentActivity({ recentActivity }) {
  const processedActivity = useMemo(() => {
    if (!recentActivity) return [];

    const SUCCESS_VERDICTS = ['Accepted', 'OK'];
    const grouped = [];
    const failedMap = new Map();
    const successMap = new Map();

    recentActivity.forEach((item) => {
      const isSuccess = SUCCESS_VERDICTS.includes(item.verdict);
      const problemKey = `${item.platform}-${item.title}`;
      
      if (isSuccess) {
        if (successMap.has(problemKey)) {
          // Increment existing success group
          const group = successMap.get(problemKey);
          group.totalAttempts += 1;
        } else {
          // Create a new success group
          const newGroup = {
            ...item,
            isSuccessGroup: true,
            groupId: `success-${item.submissionId}`,
            totalAttempts: 1,
          };
          grouped.push(newGroup);
          successMap.set(problemKey, newGroup);
        }
      } else {
        if (failedMap.has(problemKey)) {
          // Increment existing failed group
          const group = failedMap.get(problemKey);
          group.totalAttempts += 1;
          group.verdictCounts[item.verdict] = (group.verdictCounts[item.verdict] || 0) + 1;
        } else {
          // Create a new failed group
          const newGroup = {
            ...item,
            isSuccessGroup: false,
            groupId: `failed-${item.submissionId}`,
            totalAttempts: 1,
            verdictCounts: { [item.verdict]: 1 }
          };
          grouped.push(newGroup);
          failedMap.set(problemKey, newGroup);
        }
      }
    });

    return grouped;
  }, [recentActivity]);

  if (!processedActivity || processedActivity.length === 0) {
    return (
      <section className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <p className="recent-activity__empty">
          No submissions yet. Import your platform activity to see it here.
        </p>
      </section>
    );
  }

  return (
    <section className="recent-activity">
      <h2 className="section-title">Recent Activity</h2>
      <ul className="recent-activity__list">
        {processedActivity.map((item) => {
          
          return (
            <li 
              key={item.groupId} 
              className={`activity-item ${!item.isSuccessGroup ? 'activity-item--failed-group' : ''}`}
            >
              <span className="activity-item__check" aria-label={item.isSuccessGroup ? 'Success' : 'Failed'}>
                {item.isSuccessGroup ? '✓' : '•'}
              </span>
              
              <div className="activity-item__main">
                <span className="activity-item__title">{item.title}</span>
                <div className="activity-item__meta">
                  {item.difficulty && (
                    <span className={`badge ${DIFFICULTY_CLASS[item.difficulty] || ''}`}>
                      {item.difficulty}
                    </span>
                  )}
                  {item.problemRating && <span className="badge badge--rating">{item.problemRating}</span>}
                  <span className="activity-item__platform">{item.platform}</span>
                  
                  {/* Render verdict text based on success vs failed */}
                  {item.isSuccessGroup ? (
                    <span className="verdict-success">
                      {item.totalAttempts > 1 ? `${item.verdict} (x${item.totalAttempts})` : item.verdict}
                    </span>
                  ) : (
                    <span className="verdict-failed">
                      Failed: {item.totalAttempts} ({Object.entries(item.verdictCounts)
                        .map(([verdict, count]) => `${verdict}: ${count}`)
                        .join(', ')})
                    </span>
                  )}
                </div>
              </div>

              <span className="activity-item__time">
                {item.submittedAtRelative ?? new Date(item.submittedAt).toLocaleDateString()}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}