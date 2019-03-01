// @flow

import {connect} from 'react-redux';
import FirstTimeFileDownloadNotice from "../components/FirstTimeFileDownloadNotice";
import {processBackgroundTasks, saveLocalVars} from "../actions";
import persist from "../persist";

const mapStateToProps = state => {
  const show = state.flags.online && !state.localVars.askedToDownloadFiles;
  return {
    alreadyAsked: state.localVars.askedToDownloadFiles,
    online: state.flags.online,
    files: show ? state.bgProgress.filesLeft.length : 0,
    fileUrls: show ? state.bgProgress.filesLeft.slice(0, 200).map(a => a.url) : [],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ok: () => dispatch(saveLocalVars({downloadFiles: true, askedToDownloadFiles: true})),
    cancel: () => dispatch(saveLocalVars({askedToDownloadFiles: true})),
    getBytesInternal: (urls: Array<string>) => {
      return persist.getFilesSize(urls);
    },
  };
};

const mergeProps = (propsFromState, propsFromDispatch, props) => ({
  getBytes: () => propsFromDispatch.getBytesInternal(propsFromState.fileUrls),
  ...propsFromState,
  ...propsFromDispatch,
  ...props,
});

const FirstTimeFileDownloadNoticeContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(FirstTimeFileDownloadNotice);

export default FirstTimeFileDownloadNoticeContainer;
