import { useLocation } from 'react-router-dom';

export default function AppResponseFeature() {
  const location = useLocation();
  const fullQuery = location.search;

  return (
    <div>
      <h1>App Response</h1>
      <p>Full URL Query: {fullQuery}</p>
    </div>
  );
}