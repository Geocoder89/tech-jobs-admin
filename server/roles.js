const AccessControl = require("accesscontrol");

const access = new AccessControl();

exports.roles = (function() {
  access.grant("basic")
    .readOwn("profile")
    .updateOwn("profile");

  access.grant("admin")
    .extend("basic")
    .updateAny("profile")
    .deleteAny("profile");

  return access;
})();
