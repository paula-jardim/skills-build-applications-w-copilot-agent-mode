import React, { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
        setLoading(false);
        console.log('Workouts endpoint:', endpoint);
        console.log('Fetched workouts:', data);
      })
      .catch(err => {
        setLoading(false);
        console.error('Error fetching workouts:', err);
      });
  }, [endpoint]);

  if (loading) return <div>Carregando treinos...</div>;

  if (!workouts.length) return <div className="alert alert-warning">Nenhum treino encontrado.</div>;

  const columns = workouts[0] ? Object.keys(workouts[0]) : [];

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Treinos</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-primary">
              <tr>
                {columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, idx) => (
                <tr key={workout.id || idx}>
                  {columns.map(col => <td key={col}>{String(workout[col])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
