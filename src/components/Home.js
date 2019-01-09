import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import '../index.css';

class Home extends React.Component {
    render() {
        return (
            <Card>
                <CardTitle title="Word Cloud Project"/>
                <CardText>
                    React 및 Firebase 기반의 워드 클라우드 프로젝트
                </CardText>
            </Card>
        );
    }
}

export default Home;