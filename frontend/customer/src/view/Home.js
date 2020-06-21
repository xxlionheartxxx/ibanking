import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default Home;
