import { useEffect, useState } from 'react';
import { apiRequest } from '../../../../utils/api.js';

/** UI shell for Phase 6. It intentionally handles an empty list: recommendations
 * appear when the intern completes rankCandidates on the backend. */
export default function RecommendationPanel() {
  const token = localStorage.getItem('token');
  const [state, setState] = useState({ loading: true, recommendations: [], error: null });

  useEffect(() => {
    const controller = new AbortController();
    apiRequest('/recommendations?limit=6', { token, signal: controller.signal })
      .then(({ recommendations }) => !controller.signal.aborted && setState({ loading: false, recommendations, error: null }))
      .catch(error => !controller.signal.aborted && setState({ loading: false, recommendations: [], error: error.message }));
    return () => controller.abort();
  }, [token]);

  async function sendEvent(recommendationId, event) {
    await apiRequest(`/recommendations/${recommendationId}/events`, { token, method: 'POST', body: { event } });
    if (event === 'dismissed') setState(value => ({ ...value, recommendations: value.recommendations.filter(row => row.recommendationId !== recommendationId) }));
  }

  return <section className="recommendations" aria-labelledby="recommendations-title">
    <h2 id="recommendations-title">Next practice</h2>
    {state.loading && <p>Finding practice problems…</p>}
    {state.error && <p>Recommendations are unavailable: {state.error}</p>}
    {!state.loading && !state.error && state.recommendations.length === 0 && <p>No recommendations yet. Complete the ranking exercise in the backend guide to enable this section.</p>}
    {state.recommendations.map(row => <article className="recommendation-card" key={row.recommendationId}>
      <div><strong>{row.problem.title}</strong><span>{row.problem.platform.name}</span></div>
      <p>{row.problem.difficulty || (row.problem.problemRating ? `Rating ${row.problem.problemRating}` : 'Difficulty unavailable')}</p>
      <p>{row.reasonCodes.join(' • ') || 'Reason will appear after ranking is implemented.'}</p>
      <button onClick={() => sendEvent(row.recommendationId, 'started')}>Start</button>
      <button onClick={() => sendEvent(row.recommendationId, 'dismissed')}>Not now</button>
    </article>)}
  </section>;
}
