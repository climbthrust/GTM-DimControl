import { useState } from 'react';
import Button from './components/Button';

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div>
      <Button>Suchen</Button>
      <Button variant='secondary'>Abbrechen</Button>
    </div>
  );
}
