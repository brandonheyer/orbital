import React from "react";
import ReactDOM from "react-dom";

import ActiveEntities from './ActiveEntities';
import GeneratorSelector from './GeneratorSelector';
import SpeedSelector from './SpeedSelector';

export default class UI extends React.Component {
  render() {
    return (
      <div>
        <ActiveEntities style={{float: "left"}}
          engine={this.props.engine}
        > </ActiveEntities>

        <div className="generators" style={{float: "left"}}>
          <GeneratorSelector
            engine={this.props.engine}
            type="multi"
          />

          <GeneratorSelector
            engine={this.props.engine}
            type="small"
          />

          <GeneratorSelector
            engine={this.props.engine}
            type="massive"
          />
        </div>

        <div className="speeds" style={{float: "left"}}>
          <SpeedSelector value="1" engine={this.props.engine} />
          <SpeedSelector value="2" engine={this.props.engine} />
          <SpeedSelector value="4" engine={this.props.engine} />
        </div>

      </div>
    );
  }
}
