import OverviewCard from './OverviewCard';

/**
 * OverviewCards
 * Takes the `overview` object straight from GET /dashboard and renders
 * all the Part 1 cards. No extra fetching or calculation — everything
 * is already computed by the backend service.
 *
 * Expected shape (from dashboard/service.js -> getDashboardOverview):
 * {
 *   uniqueAttemptedProblems: 843,
 *   easy: 320,
 *   medium: 410,
 *   hard: 113,
 *   currentStreak: 14,
 *   longestStreak: 38,
 *   platformsConnected: 2,
 *   lastSubmissionAtRelative: "3 minutes ago" | null
 * }
 */
export default function OverviewCards({ overview }) {
  if (!overview) return null;

  const {
    uniqueAttemptedProblems,
    easy,
    medium,
    hard,
    currentStreak,
    longestStreak,
    platformsConnected,
    lastSubmissionAtRelative,
  } = overview;

  return (
    <div className="overview-cards">
      <OverviewCard label="Attempted Problems" value={uniqueAttemptedProblems} />
      <OverviewCard label="Easy" value={easy} accent="easy" />
      <OverviewCard label="Medium" value={medium} accent="medium" />
      <OverviewCard label="Hard" value={hard} accent="hard" />
      <OverviewCard
        label="Current Streak"
        value={currentStreak}
        sublabel={currentStreak === 1 ? 'day' : 'days'}
        accent="streak"
      />
      <OverviewCard
        label="Longest Streak"
        value={longestStreak}
        sublabel={longestStreak === 1 ? 'day' : 'days'}
      />
      <OverviewCard
        label="Platforms Connected"
        value={platformsConnected}
        sublabel={platformsConnected === 1 ? 'platform' : 'platforms'}
      />
      {lastSubmissionAtRelative && <OverviewCard label="Last Submission" value={lastSubmissionAtRelative} />}
    </div>
  );
}
