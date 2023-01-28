import Techs from '../value-object/techs-value-object';
import Entity from '../../../@shared/entity/entity.abstract';
import CandidateValidatorFactory from '../factory/candidate.validator.factory';
import NotificationError from '../../../@shared/notification/notification.error';
import { hashSync, compareSync } from 'bcryptjs';

type Props = {
  id?: string;
  name: string;
  email: string;
  image: string;
  password: string;
  phone: string;
  techs?: Techs[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Candidate extends Entity {
  private _name: string;
  private _email: string;
  private _image: string;
  private _phone: string;
  private _password: string;
  private _techs: Techs[];

  constructor(props: Props) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._email = props.email;
    this._image = props.image;
    this._phone = props.phone;
    this._techs = props.techs;
    this._password = props.password;

    this.validate();
  }

  validate() {
    CandidateValidatorFactory.create().validate(this);
    if (this.notification.hasError()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  encrypt_password() {
    this._password = hashSync(this._password);
  }

  valid_password(password: string): boolean {
    return compareSync(password, this._password);
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

  get password(): string {
    return this._password;
  }

  get phone(): string {
    return this._phone;
  }

  get techs(): Techs[] {
    return this._techs;
  }

  update(name: string, image: string, phone: string, techs: Techs[]): void {
    this._name = name;
    this._image = image;
    this._phone = phone;
    this._techs = techs;
    this.validate();
  }
}
