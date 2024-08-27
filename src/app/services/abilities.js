const { AbilityBuilder, Ability ,createMongoAbility} = require('@casl/ability');

function defineAbilitiesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === 'super-admin') {
    can('manage', 'all');  // full access
  } else if (role === 'admin') {
    can('read', 'all'); // read-only access to everything
    can('update', 'User'); // can update User documents
    
   // cannot('delete', 'all');

    //can('delete','User');
   // cannot('delete', 'super-admin'); // cannot delete super admins
  } else if (role === 'user') {
    can('read', 'self'); // can only read their own data
    cannot('delete', 'all');
  } else {
    cannot('manage', 'all'); // default for unrecognized roles
  }

  return build();
}

module.exports = defineAbilitiesFor;
