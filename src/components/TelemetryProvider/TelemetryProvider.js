import React, { Fragment } from 'react';
import { ai } from '../../TelemetryService';

class TelemetryProvider extends React.Component {
    constructor() {
        super();
        this.state = {
            initialized: false,
        };
    }

    componentDidMount() {
        const { initialized } = this.state;
        const appInsightsIKey = this.props.instrumentationKey;
        if(!Boolean(initialized) && Boolean(appInsightsIKey)) {
            ai.initialize(appInsightsIKey);
            this.setState({ initialized: true});
        }
        this.props.after();
    }

    render() {
        const { children } = this.props;
        return (
            <Fragment>
                { children }
            </Fragment>
        );
    }
}

export default TelemetryProvider;