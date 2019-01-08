import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { FloatingActionButton, Dialog, FlatButton, TextField } from 'material-ui';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router-dom';

const styles = theme => ({
    hidden: {
        display: 'none'
    }
});

const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
};

const databaseURL = "https://wordcloud-e11f9.firebaseio.com";
  
class Texts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            fileContent: null,
            texts: '',
            dialog: false
        }
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    _get() {
        fetch(`${databaseURL}/texts.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({texts: (texts == null) ? {} : texts}));
    }

    _post(text) {
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({texts: nextState});
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/texts/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = this.state.texts;
            delete nextState[id];
            this.setState({texts: nextState});
        });
    }

    componentDidMount() {
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: ''
    })

    handleSubmit = () => {
        const text = {
            textName: this.textName.getValue(),
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();
        if (!text.textName || !text.textContent) {
            return;
        }
        this._post(text);
    }

    handleDelete = (id) => {
        this._delete(id);
    }

    handleFileChange(e) {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({
                fileContent: text
            })
        }
        reader.readAsText(e.target.files[0], "EUC-KR");
        this.setState({
            fileName: e.target.value
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {Object.keys(this.state.texts).map(id => {
                    const text = this.state.texts[id];
                    return (
                        <Card key={id} style={{marginTop: '5px', paddingTop: '10px', paddingBottom: '10px'}}>
                            이름: <CardHeader title={text.textName.substring(0, 12) + '...'}/>
                            <Grid container>
                                <Grid style={{marginTop: '7px', display: 'flex', justifyContent: 'center'}} item xs={6}>
                                    {text.textContent.substring(0, 10) + '...'}
                                </Grid>
                                <Grid style={{display: 'flex', justifyContent: 'center'}} item xs={3}><Link to={"detail/" + id}><Button variant="contained" color="primary">보기</Button></Link></Grid>
                                <Grid style={{display: 'flex', justifyContent: 'center'}} item xs={3}><Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button></Grid>
                            </Grid>
                        </Card>
                    );
                })}
                <FloatingActionButton style={fabStyle} onClick={this.handleDialogToggle}>
                    <ContentAddIcon/>
                </FloatingActionButton>
                <Dialog
                    title="텍스트 추가"
                    actions={<FlatButton label="추가" primary={true} onClick={this.handleSubmit}/>}
                    modal={false}
                    open={this.state.dialog}
                    onRequestClose={this.handleDialogToggle}>
                    <div>텍스트 이름을 작성하세요.</div>
                    <TextField hintText="이름" name="textName" ref={ref => this.textName=ref}/>
                    <div>텍스트 파일을 업로드하세요.</div>
                    <input className={classes.hidden} accept="text/plain" id="raised-button-file" type="file" value={(this.state.fileName)? this.state.fileName : null} onChange={this.handleFileChange} />
                    <label htmlFor="raised-button-file"> 
                        <Button variant="contained" color="primary" component="span" name="file">
                            {this.state.fileName === ''? ".txt 파일 선택" : this.state.fileName}
                        </Button>
                    </label><br/>
                    <TextTruncate
                        line={1}
                        truncateText="..."
                        text={this.state.fileContent}
                    />
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Texts);