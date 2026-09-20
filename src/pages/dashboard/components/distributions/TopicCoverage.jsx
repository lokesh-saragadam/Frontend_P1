
//function for unique string-color map.
function getColorForTag(tagName) {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate an HSL color for bright, distinct dots
  return `hsl(${Math.abs(hash) % 360}, 75%, 55%)`;
}


export default function TopicCoverage({ attemptedProblemCountsByTopic }){

  const topicCount = attemptedProblemCountsByTopic;
  const sortedTags = Object.entries(topicCount).sort((a, b) => b[1] - a[1]);

  // Generates a consistent dot color based on the tag's name


    return (
      <div className="tags-wrapper">
        {sortedTags.map(([tag, count]) => (
          <div key={tag} className="tag-chip">
            {/* Colored Dot */}
            <span 
              className="tag-dot" 
              style={{ backgroundColor: getColorForTag(tag) }}
            ></span>
            
            {/* Tag Name (Replaces hyphens with spaces for readability) */}
            <span className="tag-name">
              {tag.replace(/-/g, ' ')}
            </span>
            
            {/* Count Container */}
            <span className="tag-count">
              {count}
            </span>
          </div>
        ))}
      </div>
    );
};