import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import '../index.css';
import Cookies from 'universal-cookie';

class Home extends React.Component {
    constructor(props) {
        super(props);
        /*
        const cookies = new Cookies();
        if (cookies.get('password') != 'knue') {
            this.props.history.push("/");
        }
        */
    }
    render() {
        return (
            <Card>
                <CardTitle title="상담 언어를 명료하게!"/>
                <CardText>
                    <ul>
                        <li>축어록에 기록된 단어 중에서 핵심 단어를 추출하여 워드 클라우드를 생성합니다.</li>
                        <li>[감성 단어]를 추가하여 특정한 단어에 대하여 가중치를 부여할 수 있습니다.</li>
                    </ul>
                </CardText>
            </Card>
        );
    }
}

export default Home;