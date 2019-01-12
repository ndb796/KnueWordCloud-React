import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import '../index.css';
import ActionUpdateIcon from 'material-ui/svg-icons/action/update';
import { FloatingActionButton, Dialog, FlatButton, TextField } from 'material-ui';

const databaseURL = "https://wordcloud-e11f9.firebaseio.com";
const apiURL = "https://wordcloudpython.tk";

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
            imageUrl: null,
            maxCount: 30,
            minLength: 1
        }
    }
    componentDidMount() {
        this._getImage();
        this._getText();
        this._getWords();
    }
    _getText() {
        fetch(`${databaseURL}/texts/${this.props.match.params.textID}.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(text => this.setState({textContent: text['textContent']}));
    }
    _getWords() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: (words == null) ? {} : words}));
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
            words: this.state.words
        }
        this.handleDialogToggle();
        if (!wordCloud.textID ||
            !wordCloud.text ||
            !wordCloud.maxCount ||
            !wordCloud.minLength ||
            !wordCloud.words) {
            return;
        }
        this._post(wordCloud);
    }
    _post = (wordCloud) => {
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
    handleValueChange = (e) => {
        let nextState = {};
        if(e.target.value % 1 === 0) {
            if(e.target.value < 1) {
                nextState[e.target.name] = 1;
            } else {
                nextState[e.target.name] = e.target.value;
            }
        }
        this.setState(nextState);
    }
    render() {
        return (
            <Card>
                <CardText>
                    {
                        (this.state.imageUrl)?
                            ((this.state.imageUrl == 'READY')?
                                '워드 클라우드 이미지를 불러오고 있습니다.':
                                ((this.state.imageUrl == 'NONE')?
                                    '해당 텍스트에 대한 워드 클라우드를 만들어 주세요.':
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
        );
    }
}

export default Detail;