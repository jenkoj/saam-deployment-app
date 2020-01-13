import React, { Component } from 'react';
import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

const customJSON = log => ({
msg: log.message,
level: log.level.label,
stacktrace: log.stacktrace
});

remote.apply(log, { format: customJSON });
log.enableAll();

class ErrorBoundary extends Component {
 constructor(props) {
  super(props);
  this.state = { hasError: false };
}

static getDerivedStateFromError(error) {
  // Update state so the next render will show the fallback UI.
  return { hasError: true };
}

componentDidCatch(error, info) {
  // log the error to our server with loglevel
  log.error(JSON.stringify(error));
}

render() {
 if (this.state.hasError) {
  // You can render any custom fallback UI
  return <h3>Something went wrong. Please refresh the page and/or restart the gateway.</h3>;
 }

 return this.props.children;
}
}

export default ErrorBoundary;