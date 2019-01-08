import React from 'react';
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
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar onClick={this.handleDrawerToggle}/>
                    <Drawer
                        open={this.state.toggle} docked={false}
                        onRequestChange={this.handleRequestChange}>
                        <MenuItem primaryText={'Home'}/>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AppShell;