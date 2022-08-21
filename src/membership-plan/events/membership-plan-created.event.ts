import { MembershipPlan } from '../entities/membership-plan.entity';

export class MembershipPlanCreated {
  public static eventName = 'membership-plan.created';
  constructor(public readonly membershipPlan: MembershipPlan) {}
}
