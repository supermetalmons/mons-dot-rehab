import { useLocation } from 'react-router-dom';

export default function AppResponseFeature() {
  const location = useLocation();
  const fullQuery = location.search;

  return (
    <div>
      <h1>app response</h1>
      <p>query: {fullQuery}</p>
    </div>
  );
}