const calculatePayout = (postMetrics,rates) => {
    const views = postMetrics.impressions;  // from insights
    const likes = postMetrics.likes;         // from likes API
    const comments = postMetrics.comments.total_count; // from comments API
    const shares = postMetrics.shares;       // from insights (if available)
  
    const earnings = (views * rates.perView) + 
                     (likes * rates.perLike) + 
                     (comments * rates.perComment) + 
                     (shares * rates.perShare);
    return earnings;
  };
  
  export default { calculatePayout };
  