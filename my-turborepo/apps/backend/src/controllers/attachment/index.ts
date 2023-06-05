import create from './create';
import remove from './delete';
import read from './read';
import list from './list';

export default {
  create,
  delete: remove,
  read,
  list,
};
