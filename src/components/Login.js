import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Cookies from 'universal-cookie';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class Login extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        };
        const cookies = new Cookies();
        cookies.set('password', '', { path: '*' });
        this.handleValueChange = this.handleValueChange.bind(this);
    }
    login = () => {
        if (this.state.password == 'knue') {
            this.props.history.push('/home');
        }
        const cookies = new Cookies();
        cookies.set('password', this.state.password, { path: '*' });
        this.setState({
            password: ''
        });
    }
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        상담 언어를 명료하게!
                    </Typography>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">비밀번호</InputLabel>
                        <Input value={this.state.password} onChange={this.handleValueChange} name="password" type="password" id="password" autoComplete="current-password" />
                    </FormControl>
                    <Button onClick={this.login} fullWidth variant="contained" color="primary" className={classes.submit}>
                        로그인
                    </Button>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(Login);