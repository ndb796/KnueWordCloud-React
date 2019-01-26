import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import AppShell from './AppShell';
import Login from './Login';
import Home from './Home';
import Texts from './Texts';
import Words from './Words';
import Stopwords from './Stopwords';
import Detail from './Detail';
import '../index.css';

class App extends React.Component {
    render() {
        return (
            <Router>
                <AppShell>
                    <div>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/home" component={Home}/>
                        <Route exact path="/texts" component={Texts}/>
                        <Route exact path="/words" component={Words}/>
                        <Route exact path="/stopwords" component={Stopwords}/>
                        <Route exact path="/detail/:textID" component={Detail}/>
                    </div>
                </AppShell>
            </Router>
        );
    }
}

export default App;