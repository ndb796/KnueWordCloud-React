import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class Detail extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <CardTitle title="Word Cloud Project"/>
                <CardText>
                    {this.props.match.params.textID}
                </CardText>
            </Card>
        );
    }
}

export default Detail;