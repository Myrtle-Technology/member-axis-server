export class BundleAdministratorWorkflowSettings {
  membershipMustBeApprovedByAdmin: boolean;
  paymentMustBeReceivedBeforeMemberActivated: boolean;
  constructor(dto?: Partial<BundleAdministratorWorkflowSettings>) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
