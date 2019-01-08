import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';

const databaseURL = "https://wordcloud-e11f9.firebaseio.com";

class Words extends React.Component {
    constructor() {
        super();
        this.state = {
            words: {}
        };
    }

    _get() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: words}));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.words != this.state.words
    }

    componentDidMount() {
        this._get();
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.words).map(id => {
                    const word = this.state.words[id];
                    return (
                        <Card key={id}>
                            <CardHeader title={word.word}/>
                            <CardText>{word.weight}</CardText>
                        </Card>
                    );
                })}
            </div>
        );
    }
}

export default Words;