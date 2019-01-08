import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { FloatingActionButton, Dialog, FlatButton, TextField } from 'material-ui';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
};

const databaseURL = "https://wordcloud-e11f9.firebaseio.com";

class Words extends React.Component {
    constructor() {
        super();
        this.state = {
            words: {},
            dialog: false
        };
    }

    _get() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: (words == null) ? {} : words}));
    }

    _post(word) {
        return fetch(`${databaseURL}/words.json`, {
            method: 'POST',
            body: JSON.stringify(word)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = this.state.words;
            nextState[data.name] = word;
            this.setState({words: nextState});
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/words/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = this.state.words;
            delete nextState[id];
            this.setState({words: nextState});
        });
    }

    componentDidMount() {
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })

    handleSubmit = () => {
        const word = {
            word: this.wordText.getValue(),
            weight: this.weightText.getValue()
        }
        this.handleDialogToggle();
        if (!word.word && !word.weight) {
            return;
        }
        this._post(word);
    }

    handleDelete = (id) => {
        this._delete(id);
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.words).map(id => {
                    const word = this.state.words[id];
                    return (
                        <Card key={id} style={{marginTop: '5px', paddingTop: '10px', paddingBottom: '10px'}}>
                            <Grid container>
                                <Grid style={{marginTop: '7px', display: 'flex', justifyContent: 'center'}} item xs={4}>단어: {word.word}</Grid>
                                <Grid style={{marginTop: '7px', display: 'flex', justifyContent: 'center'}} item xs={4}>가중치: {word.weight}</Grid>
                                <Grid style={{display: 'flex', justifyContent: 'center'}} item xs={4}><Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button></Grid>
                            </Grid>
                        </Card>
                    );
                })}
                <FloatingActionButton style={fabStyle} onClick={this.handleDialogToggle}>
                    <ContentAddIcon/>
                </FloatingActionButton>
                <Dialog
                    title="단어 추가"
                    actions={<FlatButton label="추가" primary={true} onClick={this.handleSubmit}/>}
                    modal={false}
                    open={this.state.dialog}
                    onRequestClose={this.handleDialogToggle}>
                    <div>단어를 입력하세요.</div>
                    <TextField hintText="단어" name="word" ref={ref => this.wordText=ref}/>
                    <div>가중치를 입력하세요.</div>
                    <TextField hintText="가중치(숫자만)" name="weight" ref={ref => this.weightText=ref}/>
                </Dialog>
            </div>
        );
    }
}

export default Words;