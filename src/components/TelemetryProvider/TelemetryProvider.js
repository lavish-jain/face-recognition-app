import React, { Fragment } from 'react';
import { ai } from '../../TelemetryService';
import { withRouter } from 'react-router-dom';
import { withAITracking } from '@microsoft/applicationinsights-react-js';

class TelemetryProvider extends React.Component {
    constructor() {
        super();
        this.state = {
            initialized: false,
        };
    }

    componentDidMount() {
        const { history } = this.props;
        const { initialized } = this.state;
        const appInsightsIKey = this.props.instrumentationKey;
        if(!Boolean(initialized) && Boolean(appInsightsIKey) && Boolean(history)) {
            ai.initialize(appInsightsIKey, history);
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

export default withRouter(withAITracking(ai.reactPlugin, TelemetryProvider));