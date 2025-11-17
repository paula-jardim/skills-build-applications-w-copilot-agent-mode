import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
        setLoading(false);
        console.log('Activities endpoint:', endpoint);
        console.log('Fetched activities:', data);
      })
      .catch(err => {
        setLoading(false);
        console.error('Error fetching activities:', err);
      });
  }, [endpoint]);

  if (loading) return <div>Carregando atividades...</div>;

  if (!activities.length) return <div className="alert alert-warning">Nenhuma atividade encontrada.</div>;

  // Descobrir colunas dinamicamente
  const columns = activities[0] ? Object.keys(activities[0]) : [];

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Atividades</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-primary">
              <tr>
                {columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, idx) => (
                <tr key={activity.id || idx}>
                  {columns.map(col => <td key={col}>{String(activity[col])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activities;
