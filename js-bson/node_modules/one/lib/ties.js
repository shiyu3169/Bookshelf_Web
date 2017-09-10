module.exports = function ties(pkg, buildOptions){
  var result = pkg.manifest.web && pkg.manifest.web.tie || {};

  var i = buildOptions.tie && buildOptions.tie.length || 0, tie;
  while( i-- ){
    tie = buildOptions.tie[i];
    result[ tie.pkg || tie.module ] = tie.obj || tie.to;
  }

  return result;
};
