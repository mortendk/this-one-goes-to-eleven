/**
 * Return the path to netlifycms for
 *
 * @param {String} path - the filePathStem to the markdown file
 *
 * @returns {String} Path to netlifycms
 */

module.exports = function (path) {
  contentpath = path.replace("/content/", "");
  folder = contentpath.split("/");
  // test whats the collection is
  if (folder[0]) {
    url = `/admin/#/collections/${folder[0]}/entries/${folder[1]}/index`;
    // let collection =`admin/#/collections/${folder[0]}/entries/`
    return url;
  }
};
