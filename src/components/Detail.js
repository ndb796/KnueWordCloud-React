import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import '../index.css';
import ActionUpdateIcon from 'material-ui/svg-icons/action/update';
import { FloatingActionButton, Dialog, FlatButton, TextField } from 'material-ui';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const databaseURL = "https://knue-word-cloud.firebaseio.com";
const apiURL = "https://knuewordcloud.tk";

const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
};

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textContent: '',
            words: {},
            stopwords: {},
            imageUrl: null,
            maxCount: 30,
            minLength: 1,
            weights: {}
        }
    }
    componentDidMount() {
        this._getImage();
        this._getText();
        this._getWords();
        this._getStopwords();
        this._getCountAndLength();
    }
    _getText() {
        fetch(`${databaseURL}/texts/${this.props.match.params.textID}.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(text => this.setState({textContent: text['textContent']}));
    }
    _getCountAndLength() {
        fetch(`${databaseURL}/processes/${this.props.match.params.textID}.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(process => {
            if(process != null) this.setState({maxCount: process['maxCount'], minLength: process['minLength']})        
        });
    }
    _getWords() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: (words == null) ? {} : words}));
    }
    _getStopwords() {
        fetch(`${databaseURL}/stopwords.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(stopwords => this.setState({stopwords: (stopwords == null) ? {} : stopwords}));
    }
    _getImage() {
        fetch(`${apiURL}/validate?textID=${this.props.match.params.textID}`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            if(data['result'] == true) {
                this.setState({imageUrl: apiURL + "/outputs?textID=" + this.props.match.params.textID})
            } else {
                this.setState({imageUrl: 'NONE'});
            }
        });
    }
    _getWeights() {
        const wordCloud = {
            textID: this.props.match.params.textID,
            text: this.state.textContent,
            maxCount: this.state.maxCount,
            minLength: this.state.minLength,
            words: this.state.words,
            stopwords: this.state.stopwords
        }
        return fetch(`${apiURL}/weights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wordCloud)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(dict => {
            // 아이템 배열을 생성합니다.
            var items = Object.keys(dict).map(function(key) {
                return [key, dict[key]];
            });
            // 두 번째 값을 기준으로 정렬을 수행합니다.
            items.sort(function(first, second) {
                return second[1] - first[1];
            });
            // 값이 큰 10개의 원소까지만 추출합니다.
            items = items.slice(0, 10)
            // 새로운 딕셔너리 객체를 생성합니다.
            let newDict = {};
            for(let i = 0; i < items.length; i++) {
                let key = items[i][0];
                let value = items[i][1];
                newDict[key] = value;
            }
            // 값이 큰 10개의 원소를 포함하는 새로운 배열로 weights을 설정합니다.
            this.setState({weights: newDict})
        });
    }
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })
    handleSubmit = () => {
        this.setState({imageUrl: 'READY'});
        const wordCloud = {
            textID: this.props.match.params.textID,
            text: this.state.textContent,
            maxCount: this.state.maxCount,
            minLength: this.state.minLength,
            words: this.state.words,
            stopwords: this.state.stopwords
        }
        this.handleDialogToggle();
        if (!wordCloud.textID ||
            !wordCloud.text ||
            !wordCloud.maxCount ||
            !wordCloud.minLength ||
            !wordCloud.words ||
            !wordCloud.stopwords) {
            return;
        }
        this.setState({
            weights: {}
        });
        this._post_python(wordCloud);
        this._post_firebase(wordCloud);
    }
    _post_python = (wordCloud) => {
        return fetch(`${apiURL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wordCloud)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            this.setState({imageUrl: apiURL + "/outputs?textID=" + this.props.match.params.textID})
        });
    }
    _post_firebase = (wordCloud) => {
        return fetch(`${databaseURL}/processes/${this.props.match.params.textID}.json`, {
            method: 'PUT',
            body: JSON.stringify(wordCloud)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
        });
    }
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    render() {
        return (
            <div>
                <Card>
                    <CardText>
                        {
                            (this.state.imageUrl)?
                                ((this.state.imageUrl == 'READY')?
                                    '워드 클라우드 이미지를 불러오고 있습니다.':
                                    ((this.state.imageUrl == 'NONE')?
                                        '해당 축어록 대한 워드 클라우드를 만들어 주세요.':
                                        <img key={Math.random()} src={this.state.imageUrl + '&random=' + Math.random()} style={{width: '100%'}}/>)):
                            ''
                        }
                    </CardText>
                    <FloatingActionButton style={fabStyle} onClick={this.handleDialogToggle}>
                        <ActionUpdateIcon/>
                    </FloatingActionButton>
                    <Dialog
                        title="워드 클라우드 생성"
                        actions={<FlatButton label={(this.state.imageUrl == 'NONE')? '만들기' : '다시 만들기'} primary={true} onClick={this.handleSubmit}/>}
                        modal={false}
                        open={this.state.dialog}
                        onRequestClose={this.handleDialogToggle}>
                        <div>최대 단어 개수</div>
                        <TextField type="number" name="maxCount"
                        onChange={this.handleValueChange} value={this.state.maxCount}/>
                        <div>단어의 최소 길이</div>
                        <TextField type="number" name="minLength"
                        onChange={this.handleValueChange} value={this.state.minLength}/>
                    </Dialog>
                </Card>
                {
                    (this.state.imageUrl && this.state.imageUrl != 'READY' && this.state.imageUrl != 'NONE')?
                        <Button style={{marginTop: '12px', marginBottom: '8px'}}
                         variant="contained" color="primary" onClick={() => this._getWeights()}>주요 단어 10개</Button>:
                        ''
                }
                {Object.keys(this.state.weights).map(word => {
                    const weight = this.state.weights[word];
                    return (
                        <Card key={word} style={{marginTop: '5px', paddingTop: '10px', paddingBottom: '10px'}}>
                            <Grid container>
                                <Grid style={{marginTop: '7px', display: 'flex'}} item xs={6}>&nbsp;&nbsp;&nbsp;&nbsp;주요 단어: {word}</Grid>
                                <Grid style={{marginTop: '7px', display: 'flex'}} item xs={6}>가중치: {weight}</Grid>
                            </Grid>
                        </Card>
                    );
                })}
            </div>
        );
    }
}

export default Detail;