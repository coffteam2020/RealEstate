import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import * as Animatable from "react-native-animatable";

export default class TextView extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    numberOfLines: PropTypes.number,
  };
  static defaultProps = {
    numberOfLines: 1,
    style: {
      fontSize: 16,
      textAlign: 'left',
      fontWeight: 'normal',
      color: 'white',
      backgroundColor: 'transparent',
    },
  };
  render() {
    const { text } = this.props;
    if (!text || text.length == 0) {
      return null;
    }
    return <Animatable.Text numberOfLines={3} animation="slideInDown" duration={600} {...this.props}>{text}</Animatable.Text>;
  }
}
