import React from "react";
import ReactDOM from "react-dom";

export default class GeneratorSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.engine.setGenerator(this.props.type);
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
      >
        {this.props.type}
      </div>
    );
  }
}
