// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type tabs from "./DocumentList";
import DocumentList from "./DocumentList";

type Props = {
  online: boolean,
  group: PublicGroupObject,
  navigation: { setParams: ({}) => {} },
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));

  return {
    online: state.flags.online,
    group: group,
  };
};

const mapDispatchToProps = dispatch => ({});

class DocumentListScreen extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "recent",
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({title: this.props.group.title});
    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab: tab});
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <DocumentList {...this.props} tab={this.state.tab} changeTab={(tab: string) => this.setState({tab: tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListScreen);
