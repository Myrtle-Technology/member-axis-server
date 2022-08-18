import { BaseEntity, Repository } from 'typeorm';

export class SharedService<Model extends BaseEntity> {
  constructor(readonly repo: Repository<Model>) {}
  public find = this.repo.find.bind(this.repo);
  public findOne = this.repo.findOne.bind(this.repo);
  public create = this.repo.save.bind(this.repo);
  public update = this.repo.update.bind(this.repo);
}
