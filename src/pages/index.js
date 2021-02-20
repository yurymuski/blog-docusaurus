import React from 'react';

function Home() {
  React.useEffect(() => {
    window.location.href = '/docs/';
  }, []);

  return null;

}

export default Home;
