import { useEffect, useState } from 'react';
import { apiRequest } from '../../../../utils/api.js';

/** UI shell for Phase 6. It intentionally handles an empty list: recommendations
 * appear when the intern completes rankCandidates on the backend. */
export default function RecommendationPanel() {
  const token = localStorage.getItem('token');
  const [platform, setPlatform] = useState('Codeforces');
  const [limit, setLimit] = useState(3);
  const [state, setState] = useState({ loading: true, recommendations: [], error: null });

  useEffect(() => {
    const controller = new AbortController();
    apiRequest(`/recommendations?platform=${platform}&limit=${limit}`, { token, signal: controller.signal })
      .then(({ recommendations }) => !controller.signal.aborted && setState({ loading: false, recommendations, error: null }))
      .catch(error => !controller.signal.aborted && setState({ loading: false, recommendations: [], error: error.message }));
    return () => controller.abort();
  }, [token, platform, limit]);

  async function sendEvent(recommendationId, event) {
    await apiRequest(`/recommendations/${recommendationId}/events`, { token, method: 'POST', body: { event } });
    if (event === 'dismissed') setState(value => ({ ...value, recommendations: value.recommendations.filter(row => row.recommendationId !== recommendationId) }));
  }
  const reasonLabels = {
    UNSOLVED: 'New problem', WEAK_TAG: 'Strengthen this topic', APPROPRIATE_DIFFICULTY: 'Right next challenge',
    FRESH_PRACTICE: 'Fresh practice', FRESH_TOPIC: 'Fresh topic', NEW_TAG: 'Explore a new tag', PREVIOUSLY_ATTEMPTED: 'Try again'
  };

  return <section className="recommendations" aria-labelledby="recommendations-title">
    <div className="recommendations__header">
      <div><p className="recommendations__eyebrow">Personal learning path</p><h2 id="recommendations-title">{platform === 'Leetcode' ? 'LeetCode' : platform} Recommendations</h2></div>
      <label>Platform <select value={platform} onChange={event => setPlatform(event.target.value)}><option>Codeforces</option><option value="Leetcode">LeetCode</option></select></label>
      <label>Show <select value={limit} onChange={event => setLimit(Number(event.target.value))}><option value={1}>1</option><option value={3}>3</option><option value={5}>5</option><option value={10}>10</option></select></label>
    </div>
    {state.loading && <p>Finding {platform} practice problems…</p>}
    {state.error && <p>Recommendations are unavailable: {state.error}</p>}
    {!state.loading && !state.error && state.recommendations.length === 0 && <p>No {platform} recommendations are available yet. Connect the platform and import more activity.</p>}
    <div className="recommendations__grid">{state.recommendations.map((row, index) => <article className="recommendation-card" key={row.recommendationId}>
      <div className="recommendation-card__topline"><span className="recommendation-card__number">{String(index + 1).padStart(2, '0')}</span><span className="recommendation-card__platform">{row.problem.platform.name}</span></div>
      <h3>{row.problem.title}</h3>
      <div className="recommendation-card__details"><span className={`recommendation-card__difficulty recommendation-card__difficulty--${(row.problem.difficulty || 'rating').toLowerCase()}`}>{row.problem.difficulty || (row.problem.problemRating ? `${row.problem.problemRating} rating` : 'Difficulty unavailable')}</span>{row.problem.tags.slice(0, 3).map(tag => <span className="recommendation-card__tag" key={tag}>{tag}</span>)}</div>
      <div className="recommendation-card__reasons">{row.reasonCodes.map(reason => <span key={reason}>{reasonLabels[reason] || reason}</span>)}</div>
      <div className="recommendation-card__actions">
        {row.problem.canonicalUrl ? <a href={row.problem.canonicalUrl} target="_blank" rel="noreferrer" onClick={() => { void sendEvent(row.recommendationId, 'started'); }}>Start problem <span aria-hidden="true">↗</span></a> : <button disabled title="Sync this platform to add the problem link">Problem link unavailable</button>}
        <button className="recommendation-card__dismiss" onClick={() => { void sendEvent(row.recommendationId, 'dismissed'); }}>Not now</button>
      </div>
    </article>)}
    </div>
  </section>;
}
