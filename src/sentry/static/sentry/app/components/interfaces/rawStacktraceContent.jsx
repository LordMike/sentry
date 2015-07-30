var React = require("react");

var PropTypes = require("../../proptypes");
var {defined, trim} = require("../../utils");

var RawStacktraceContent = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    platform: React.PropTypes.string
  },

  getFrame(frame) {
    switch (this.props.platform) {
      case "javascript":
        return this.getJavaScriptFrame(frame);
      default:
        return this.getDefaultFrame(frame);
    }
  },

  getJavaScriptFrame(frame) {
    var result = '';
    if (defined(frame.function)) {
      result += '  at ' + frame.function + '(';
    } else {
      result += '  at ? (';
    }
    if (defined(frame.filename)) {
      result += frame.filename;
    } else if (defined(frame.module)) {
      result += frame.module;
    }
    if (defined(frame.lineNo) && frame.lineNo >= 0) {
      result += ':' + frame.lineNo;
    }
    if (defined(frame.colNo) && frame.colNo >= 0) {
      result += ':' + frame.colNo;
    }
    result += ')';
    return result;
  },

  getDefaultFrame(frame) {
    var result = '';
    if (defined(frame.filename)) {
      result += '  File "' + frame.filename + '"';
    } else if (defined(frame.module)) {
      result += '  Module "' + frame.module + '"';
    } else {
      result += '  ?';
    }
    if (defined(frame.lineNo) && frame.lineNo >= 0) {
      result += ', line ' + frame.lineNo;
    }
    if (defined(frame.colNo) && frame.colNo >= 0) {
      result += ', col ' + frame.colNo;
    }
    if (defined(frame.function)) {
      result += ', in ' + frame.function;
    }
    if (defined(frame.context)) {
      frame.context.forEach((item) => {
        if (item[0] === frame.lineNo) {
          result += '\n    ' + trim(item[1]);
        }
      });
    }
    return result;
  },

  render() {
    var data = this.props.data;
    var firstFrameOmitted, lastFrameOmitted;
    var children = [];

    if (data.framesOmitted) {
      firstFrameOmitted = data.framesOmitted[0];
      lastFrameOmitted = data.framesOmitted[1];
    } else {
      firstFrameOmitted = null;
      lastFrameOmitted = null;
    }

    data.frames.forEach((frame, frameIdx) => {
      children.push(this.getFrame(frame));
      if (frameIdx === firstFrameOmitted) {
        children.push((
          '.. frames ' + firstFrameOmitted + ' until ' + lastFrameOmitted + ' were omitted and not available ..'
        ));
      }

    });

    return <pre className="traceback">{children.join('\n')}</pre>;
  }
});

module.exports = RawStacktraceContent;