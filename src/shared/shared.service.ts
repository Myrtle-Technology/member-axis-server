import { BaseEntity, Repository } from 'typeorm';

export class SharedService<Entity extends BaseEntity> {
  constructor(readonly repo: Repository<Entity>) {}
  public find: Repository<Entity>['find'] = this.repo.find.bind(this.repo);
  public findOne: Repository<Entity>['findOne'] = this.repo.findOne.bind(
    this.repo,
  );
  public create: Repository<Entity>['create'] = this.repo.save.bind(this.repo);
  public update: Repository<Entity>['update'] = this.repo.update.bind(
    this.repo,
  );
}
