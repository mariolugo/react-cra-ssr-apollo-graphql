import React, {Component} from 'react';
import Page from '../../components/page';
import CreateLink from '../homepage/CreateLink';

class About extends Component {

  render(){
    console.log(this.props);
    return (
      <Page id="about" title="About" description="This is about really cool stuff.">
        <p>What we're all about</p>
        <CreateLink history={this.props.history}/>
      </Page>
    )
  }
};

export default About;
