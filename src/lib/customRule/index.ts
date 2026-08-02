import doesMatchFileType from './matching/doesMatchFileType';
import doesMatchPath from './matching/doesMatchPath';
import getSortedRules from './queries/getSortedRules';
import getFileItems from './queries/getFileItems';
import removeFromAllFiles from './operations/removeFromAllFiles';
import add from './operations/add';
import addToAllFiles from './operations/addToAllFiles';
import isApplicable from './matching/isApplicable';

export default {
  doesMatchFileType,
  doesMatchPath,
  getSortedRules,
  getFileItems,
  removeFromAllFiles,
  add,
  addToAllFiles,
  isApplicable,
};
