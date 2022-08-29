import { ApiProperty } from '@nestjs/swagger';
import { RenewalReminderEmailRecipients } from '../enums/renewal-reminder-email-recipients.enum';
import { RenewalReminderWhen } from '../enums/renewal-reminder-when.enum';

export class RenewalReminder {
  noOfDays: number;
  @ApiProperty({ description: '`on`, `before`, or `after` renewal date' })
  when: RenewalReminderWhen;
  sendEmail: boolean;
  sendEmailTo: RenewalReminderEmailRecipients[];
  changeMembershipLevelTo: number;

  constructor(dto?: Partial<RenewalReminder>) {
    if (dto) {
      Object.assign(this, dto);
      this.sendEmailTo = dto.sendEmailTo || [];
    }
  }
}
