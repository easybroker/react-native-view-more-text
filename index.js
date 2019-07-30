import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  fullTextWrapper: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  viewMoreText: {
    color: 'blue',
  },
  transparent: {
    opacity: 0,
  },
});

class ViewMoreText extends React.Component {
  trimmedTextHeight = null;
  fullTextHeight = null;
  shouldShowMore = false;

  state = {
    isFulltextShown: true,
    numberOfLines: this.props.numberOfLines,
  }

  hideFullText = () => {
    if (
      this.state.isFulltextShown &&
      this.trimmedTextHeight &&
      this.fullTextHeight
    ) {
      this.shouldShowMore = this.trimmedTextHeight < this.fullTextHeight;
      this.setState({
        isFulltextShown: false,
      });
    }
  }

  onLayoutTrimmedText = (event) => {
    const {
      height,
    } = event.nativeEvent.layout;

    this.trimmedTextHeight = height;
    this.hideFullText();
  }

  onLayoutFullText = (event) => {
    const {
      height,
    } = event.nativeEvent.layout;

    this.fullTextHeight = height;
    this.hideFullText();
  }

  onPressMore = () => {
    this.setState({
      numberOfLines: null,
    }, () => {
      this.props.afterExpand();
    });
  }

  onPressLess = () => {
    this.setState({
      numberOfLines: this.props.numberOfLines,
    }, () => {
      this.props.afterCollapse();
    });
  }

  getWrapperStyle = () => {
    if (this.state.isFulltextShown) {
      return styles.transparent;
    }
    return {};
  }

  renderViewMore = () => (
    <Text
      style={styles.viewMoreText}
      onPress={this.onPressMore}
    >
      View More
    </Text>
  )

  renderViewLess = () => (
    <Text
      style={styles.viewMoreText}
      onPress={this.onPressLess}
    >
      View Less
    </Text>
  )

  renderFooter = () => {
    const {
      numberOfLines,
    } = this.state;

    if (this.shouldShowMore === true) {
      if (numberOfLines > 0) {
        return (this.props.renderViewMore || this.renderViewMore)(this.onPressMore);
      }
      return (this.props.renderViewLess || this.renderViewLess)(this.onPressLess);
    }
    return null;
  }

  renderFullText = () => {
    if (this.state.isFulltextShown) {
      return (
        <View onLayout={this.onLayoutFullText} style={styles.fullTextWrapper}>
          <Text onLongPress={this._longPressShouldBeActive()} style={this.props.textStyle}>{this.props.children}</Text>
        </View>
      );
    }
    return null;
  }

  _onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.props.children)
    }
  }

  _longPressShouldBeActive = () => {
    return this.props.longPressActive ? this._onLongPress : null
  }

  render() {
    return (
      <View style={this.getWrapperStyle()}>
        <View onLayout={this.onLayoutTrimmedText}>
          <Text
            style={this.props.textStyle}
            numberOfLines={this.state.numberOfLines}
            onLongPress={this._longPressShouldBeActive()}
          >
            {this.props.children}
          </Text>
          {this.renderFooter()}
        </View>

        {this.renderFullText()}
      </View>
    );
  }
}

ViewMoreText.propTypes = {
  afterCollapse: PropTypes.func,
  afterExpand: PropTypes.func,
  longPressActive: PropTypes.bool,
  numberOfLines: PropTypes.number.isRequired,
  onLongPress: PropTypes.func,
  renderViewLess: PropTypes.func,
  renderViewMore: PropTypes.func,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ViewMoreText.defaultProps = {
  afterCollapse: () => {},
  afterExpand: () => {},
  longPressActive: false,
  onLongPress: () => null,
  textStyle: {},
};

export default ViewMoreText;
