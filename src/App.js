import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/home/Home';
import GovernorPage from './components/governor/GovernorPage';
import ContractPage from './components/overview/ContractPage';
import Layout from './components/meniu/Layout';
import NavigationBar from './components/meniu/NavigationBar';
import { Provider } from 'react-redux';
import store from './redux/store';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <React.Fragment>
          <NavigationBar />
          <Layout>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/ContractPage' component={ContractPage} />
              <Route exact path='/GovernorPage' component={GovernorPage} />
            </Switch>
          </Layout> 
        </React.Fragment>
      </Router>
    </Provider>
  );
}

export default App;
