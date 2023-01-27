import { randomUUID } from 'crypto';

import Techs from '../value-object/techs-value-object';
import Entity from '../../../@shared/entity/entity.abstract';
import CandidateValidatorFactory from '../factory/candidate.validator.factory';
import NotificationError from '../../../@shared/notification/notification.error';

type Props = {
  id?: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  techs?: Techs[];
};

export default class Candidate extends Entity {
  private _name: string;
  private _email: string;
  private _image: string;
  private _phone: string;
  private _techs: Techs[];

  constructor(props: Props) {
    super();
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._image = props.image;
    this._phone = props.phone;
    this._techs = props.techs;

    this.validate();

    if (this.notification.hasError()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  validate() {
    CandidateValidatorFactory.create().validate(this);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
  get image(): string {
    return this._image;
  }

  get phone(): string {
    return this._phone;
  }

  get techs(): Techs[] {
    return this._techs;
  }
}
