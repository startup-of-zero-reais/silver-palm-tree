import DomainValidation from "src/@shared/domain/DomainValidation";
import Techs from "./techs-value-object";
// import {randomUUID} from 'crypto';

type Props = {
    id?: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    techs: Techs[];
    github: string;
}

export default class Candidate { 
    private _id: string;
    private _name: string;
    private _email: string;
    private _image: string;
    private _github: string;
    private _phone: string;
    private _techs: Techs[];


    constructor(props: Props) {
        this._id = props.id || "ANY_VALUE"; 
        this._name = props.name;
        this._email = props.email;
        this._image = props.image;
        this._phone = props.phone;
        this._techs = props.techs;
        this._github = props.github;
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

    get github(): string {
        return this._github;
    }

    private validate(): void {
        DomainValidation.notNull(this._name);
        DomainValidation.notNull(this._email);
        DomainValidation.notNull(this._image);
        DomainValidation.notNull(this._phone);
        DomainValidation.notNull(this._github);
        
    }




}