import React from 'react';
import { Link } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import { AppBar, Drawer, MenuItem } from 'material-ui';

class AppShell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        };
    }
    handleDrawerToggle = () => this.setState({toggle: !this.state.toggle})
    handleRequestChange = toggle => this.setState({toggle: toggle})
    handleLinkClick = () => this.setState({toggle: false})
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar onClick={this.handleDrawerToggle}/>
                    <Drawer
                        open={this.state.toggle} docked={false}
                        onRequestChange={this.handleRequestChange}>
                        <MenuItem
                            primaryText={'Home'}
                            containerElement={<Link to={'/'}/>}
                            onClick={this.handleLinkClick}
                        />
                        <MenuItem
                            primaryText={'Texts'}
                            containerElement={<Link to={'/texts'}/>}
                            onClick={this.handleLinkClick}
                        />
                        <MenuItem
                            primaryText={'Words'}
                            containerElement={<Link to={'/words'}/>}
                            onClick={this.handleLinkClick}
                        />
                    </Drawer>
                </div>
                <div id="content" style={{margin: 'auto', marginTop: '20px'}}>
                    {React.cloneElement(this.props.children)}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AppShell;