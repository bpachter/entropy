import { useEffect } from 'react';
import { useRoute } from './router';
import { Home } from './pages/Home';
import { chapterComponents } from './chapters';

/** Hash-routed shell: "/" is the contents cover, "/<id>" is a chapter. */
export default function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const id = route.replace(/^\//, '');
  const Chapter = id ? chapterComponents[id] : undefined;

  if (Chapter) return <Chapter />;
  return <Home />;
}
