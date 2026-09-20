import { apiRequest } from '../../utils/api.js';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import OverviewCards from './components/overview/OverviewCards.jsx';
import RecentActivity from './components/overview/RecentActivity.jsx';
import LoadingSkeleton from './components/layout/LoadingSkeleton.jsx';
import Welcome from './components/layout/Welcome.jsx';
import { DifficultyDistributionChart } from './components/distributions/DifficultyDistributionChart.jsx';
import { RatingDistributionChart } from './components/distributions/RatingDistributionChart.jsx';
import TopicCoverage from './components/distributions/TopicCoverage.jsx'
import MonthlySubmissionChart from './components/analytics/MonthlySubmissionChart.jsx';
import SubmissionHeatmap from './components/activity/SubmissionHeatmap.jsx';
import './Dashboard.css';

/**
 * Dashboard
 * Single container that hits GET /dashboard once and fans the response
 * out to every section (Part 2 & 4 of the spec: one API call, split
 * into presentational sections).
 *
 * Response shape expected from the backend:
 * {
 *   overview: { uniqueAttemptedProblems, easy, medium, hard, currentStreak,
 *               longestStreak, platformsConnected, lastSubmissionAtRelative },
 *   recentActivity: [ { problemId, title, difficulty, platform, ... } ]
 * }
 */
export default function Dashboard() {
  const [dashboardResponse, setDashboardResponse] = useState(null);
  const { id: userId } = useParams();
  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMessage(null);
    async function load() {
      try {
        const responseBody = await apiRequest('/dashboard/' + userId, { token, signal: controller.signal });
        if (!controller.signal.aborted) setDashboardResponse({ ...responseBody, requestedUserId: userId });
      } catch (failure) {
        if (controller.signal.aborted) return;
        if (failure.status === 401) {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
          return;
        }
        setErrorMessage(failure.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [userId, token, retryCount, navigate]);

  if (loading) return <LoadingSkeleton />;

  if (errorMessage) {
    return (
      <div className="dashboard-error">
        <p>Could not load your dashboard: {errorMessage}</p>
        <button onClick={() => setRetryCount(value => value + 1)}>Retry</button>
      </div>
    );
  }

  if (!dashboardResponse || dashboardResponse.requestedUserId !== userId) return <LoadingSkeleton />;

  return (
    <div className="dashboard">

      <Welcome username={dashboardResponse.username}/>
      
      <section className="dashboard__overview">
        <h2 className="section-title">Overview</h2>
        <OverviewCards overview={dashboardResponse.dashboardData.overview} />
      </section>

      <RecentActivity recentActivity={dashboardResponse.dashboardData.recentActivity} />

      {/* Reserved for later: Analytics, Heatmap, Recommendations */}
      <h2>Distributions</h2>
      <section className="DistributionD">
        < DifficultyDistributionChart overview={dashboardResponse.dashboardData.overview} />
        < RatingDistributionChart problemCountsByRating={dashboardResponse.dashboardData.overview.problemCountsByRating}/>
      </section>
      <h2>Tags</h2>
      <section className="DistributionT">
        < TopicCoverage attemptedProblemCountsByTopic={dashboardResponse.dashboardData.attemptedProblemCountsByTopic}/>
      </section>
      <section className ="Months_Analytics">
        <MonthlySubmissionChart submissionCountsByMonth = {dashboardResponse.dashboardData.submissionCountsByMonth}/>
      </section>
      <section className="SubmissionHeatmap">
        <SubmissionHeatmap submissionCountsByDate={dashboardResponse.dashboardData.submissionCountsByDate}/>
      </section>
    </div>
  );
}
