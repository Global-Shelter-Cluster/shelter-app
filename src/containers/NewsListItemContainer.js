// @flow

import React from 'react';
import {connect} from 'react-redux';
import NewsListItem from '../components/NewsListItem';
import {getObject, isObjectSeen} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {NewsObject} from "../model/news";
import {markSeen} from "../actions";

const mapStateToProps = (state, props) => {
  const news: NewsObject = convertFiles(state, 'news', getObject(state, 'news', props.id));

  const ret = {
    news,
    isSeen: isObjectSeen(state, 'news', news.id),
  };

  ret.enter = () => props.navigation.push('News', {newsId: news.id});

  return ret;
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    markSeen: () => dispatch(markSeen('news', props.id)),
  };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(NewsListItem));
