import React from "react";
import PropTypes from "../../proptypes";

var GroupEventTags = React.createClass({
  propTypes: {
    group: PropTypes.Group.isRequired,
    event: PropTypes.Event.isRequired
  },

  render() {
    var children = this.props.event.tags.map((tag, tagIdx) => {
      var key = tag[0];
      var value = tag[1];
      return (
        <li key={tagIdx}>
          {key} = {value}
        </li>
      );
    });

    return (
      <div id="tags" className="box">
        <div className="box-header">
          <h3>Tags</h3>
        </div>
        <div className="box-content with-padding">
          <ul className="mini-tag-list">
            {children}
          </ul>
        </div>
      </div>
    );
  }
});

export default GroupEventTags;

