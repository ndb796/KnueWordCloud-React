import React from 'react';
import { Card } from 'material-ui/Card';
import { FloatingActionButton, Dialog, FlatButton, TextField } from 'material-ui';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import '../index.css';

const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
};

const databaseURL = "https://knue-word-cloud.firebaseio.com";

class Stopwords extends React.Component {
    constructor() {
        super();
        this.state = {
            stopwords: {},
            dialog: false
        };
    }

    _get() {
        fetch(`${databaseURL}/stopwords.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(stopwords => this.setState({stopwords: (stopwords == null) ? {} : stopwords}));
    }

    _post(stopword) {
        return fetch(`${databaseURL}/stopwords.json`, {
            method: 'POST',
            body: JSON.stringify(stopword)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = this.state.stopwords;
            nextState[data.name] = stopword;
            this.setState({stopwords: nextState});
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/stopwords/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = this.state.stopwords;
            delete nextState[id];
            this.setState({stopwords: nextState});
        });
    }

    componentDidMount() {
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })

    handleSubmit = () => {
        const stopword = {
            word: this.wordText.getValue()
        }
        this.handleDialogToggle();
        if (!stopword.word) {
            return;
        }
        this._post(stopword);
    }

    handleDelete = (id) => {
        this._delete(id);
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.stopwords).map(id => {
                    const stopword = this.state.stopwords[id];
                    return (
                        <Card key={id} style={{marginTop: '5px', paddingTop: '10px', paddingBottom: '10px'}}>
                            <Grid container>
                                <Grid style={{marginTop: '7px', display: 'flex', justifyContent: 'center'}} item xs={6}>제한 단어: {stopword.word}</Grid>
                                <Grid style={{display: 'flex', justifyContent: 'center'}} item xs={6}><Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button></Grid>
                            </Grid>
                        </Card>
                    );
                })}
                <FloatingActionButton style={fabStyle} onClick={this.handleDialogToggle}>
                    <ContentAddIcon/>
                </FloatingActionButton>
                <Dialog
                    title="제한 단어 추가"
                    actions={<FlatButton label="추가" primary={true} onClick={this.handleSubmit}/>}
                    modal={false}
                    open={this.state.dialog}
                    onRequestClose={this.handleDialogToggle}>
                    <div>단어를 입력하세요.</div>
                    <TextField hintText="단어" name="stopword" ref={ref => this.wordText=ref}/>
                </Dialog>
            </div>
        );
    }
}

export default Stopwords;