import { RolesBuilder } from 'nest-access-control';
import { Resources } from './enums/resources.enum';
import { RoleService } from './role.service';
import { GrantDto } from './dto/grant.dto';
import { Permission } from './entities';
import { Role as RoleEnum } from './enums/role.enum';
import { PermissionAction } from './enums/permission-action.enum';

// TODO: add roles to the database
export const rolesBuilder: RolesBuilder = new RolesBuilder();

export async function RolesBuilderFactory(
  roleService: RoleService,
): Promise<RolesBuilder> {
  const hashMapOfGrants = rolesBuilder.getGrants();
  let roles = await roleService.find();
  // if (roles.length === 0) {
  const _roles = Object.keys(hashMapOfGrants).map((role) => {
    const _permissions = Object.keys(hashMapOfGrants[role])
      .map((resource: Resources) => {
        if ((resource as string) == '$extend') return [];
        return Object.keys(hashMapOfGrants[role][resource]).map(
          (grant: PermissionAction) =>
            new Permission({
              resource,
              action: grant,
              attributes: hashMapOfGrants[role][resource][grant],
            }),
        );
      })
      .reduce((acc, val) => acc.concat(val), [])
      .map((permission) => roleService.findOrCreatePermission(permission));
    return Promise.all(_permissions).then((p) => {
      return Promise.resolve({
        name: role,
        slug: role,
        permissions: p,
      });
    });
  });
  roles = await Promise.all(
    (
      await Promise.all(_roles)
    ).map((role) => roleService.findOrCreateRole(role)),
  );
  // }

  const grants: GrantDto[] = roles
    ?.map((role) => {
      return (role?.permissions || []).map(
        (permission) =>
          new GrantDto(
            role,
            permission.action,
            permission.resource,
            permission.attributes,
          ),
      );
    })
    .reduce((acc, val) => acc.concat(val), []);
  return grants.length ? new RolesBuilder(grants) : rolesBuilder;
  // return rolesBuilder;
}

/** Members */
rolesBuilder.grant(RoleEnum.Member).readAny(Resources.MembershipPlan);

/** Admin */
rolesBuilder
  .grant(RoleEnum.Admin)
  // .extend(RoleEnum.Member) replaced with block
  .readOwn(Resources.Member)
  .createOwn(Resources.Member)
  .deleteOwn(Resources.Member)
  .updateOwn(Resources.Member)
  .readAny(Resources.MembershipPlan)
  // members
  .readOwn(Resources.OrganizationMember)
  .updateOwn(Resources.OrganizationMember)
  .createOwn(Resources.OrganizationMember)
  .deleteOwn(Resources.OrganizationMember)
  // organizations
  .readOwn(Resources.Organization)
  .updateOwn(Resources.Organization)
  .createOwn(Resources.Organization)
  .deleteOwn(Resources.Organization)
  // membership plans
  .readOwn(Resources.MembershipPlan)
  .updateOwn(Resources.MembershipPlan)
  .createOwn(Resources.MembershipPlan)
  .deleteOwn(Resources.MembershipPlan)
  // membership plans
  .readOwn(Resources.Email)
  .updateOwn(Resources.Email)
  .createOwn(Resources.Email)
  .deleteOwn(Resources.Email)
  // membership plans
  .readOwn(Resources.Sms)
  .updateOwn(Resources.Sms)
  .createOwn(Resources.Sms)
  .deleteOwn(Resources.Sms);

/** Super Admin */
rolesBuilder
  .grant(RoleEnum.SuperAdmin)
  // .extend(RoleEnum.Admin)
  // members
  .readAny(Resources.OrganizationMember)
  .updateAny(Resources.OrganizationMember)
  .createAny(Resources.OrganizationMember)
  .deleteAny(Resources.OrganizationMember)
  // organizations
  .readAny(Resources.Organization)
  .updateAny(Resources.Organization)
  .createAny(Resources.Organization)
  .deleteAny(Resources.Organization)
  // membership plans
  .readAny(Resources.MembershipPlan)
  .updateAny(Resources.MembershipPlan)
  .createAny(Resources.MembershipPlan)
  .deleteAny(Resources.MembershipPlan)
  // membership plans
  .readAny(Resources.Email)
  .updateAny(Resources.Email)
  .createAny(Resources.Email)
  .deleteAny(Resources.Email)
  // membership plans
  .readAny(Resources.Sms)
  .updateAny(Resources.Sms)
  .createAny(Resources.Sms)
  .deleteAny(Resources.Sms);
