import defaultParameters from './defaultParameters.js';
import Is from 'strong-type';

const is=new Is;

class Address {
    constructor(parameters){
        const parmsRemaining=defaultParameters.call(this,parameters);
        
        if(!parmsRemaining){
            //if no parmsRemaining stop trying to merge
            return;
        };
        
        if (Array.isArray(parameters)) {
            this.street = parameters[0];
            this.city = parameters[1];
            this.region = parameters[2];
            this.postalCode = parameters[3];
            return;
        }
    
        if (typeof parameters == 'number') {
            parameters+='';
        }
    
        if (typeof parameters == 'string') {
            this.#parse(parameters);
        }

        return;
    }

    get unitType(){
        return this.#dominos.UnitType;
    }
    set unitType(value){
        is.string(value);
        return this.#dominos.UnitType=value;
    }

    get street(){
        return this.#dominos.Street;
    }
    set street(value){
        is.string(value);
        return this.#dominos.Street=value;
    }

    get city(){
        return this.#dominos.City;
    }
    set city(value){
        is.string(value);
        return this.#dominos.City=value;
    }

    get region(){
        return this.#dominos.Region;
    }
    set region(value){
        is.string(value);
        return this.#dominos.Region=value;
    }

    get postalCode(){
        return this.#dominos.PostalCode;
    }
    set postalCode(value){
        is.string(value);
        return this.#dominos.PostalCode=value;
    }

    get dominos(){
        return this.#dominos;
    }

    #dominos={
        Street: '',
        StreetNumber: '',
        StreetName: '',
        UnitType: 'House',
        UnitNumber: '',
        City: '',
        Region: '',
        PostalCode: ''
    }

    get addressLines() {
        const line1 = this.street||'';
        const line2 = `${
            (this.City ? this.city + ',' : '')
        } ${
            (this.Region ? this.region + ',' : '')
        } ${
            this.postalCode
        }`

        const lines={
            line1,
            line2
        };
        
        return lines;
    }

    #parse(locationString) {
        return parseAddress.call(this,locationString);
    }
        
}

const parseAddress=function(locationString){
    const splitAddress = locationString.split(',');

    for (var i in splitAddress) {
        splitAddress[i] = splitAddress[i].trim();
    }

    this.postalCode= splitAddress[splitAddress.length-1]

    //need better intellegence for auto determining address parts
    //added some, should externalize it
    //while not perfect, it does seem to get most of the right stuff
    //in good enough places for dominos to like it.
    switch (splitAddress.length) {
        case 1:
            if (!this.postalCode) {
                this.postalCode='';
                this.city = splitAddress[0];
            }
            break;
        case 2:
            if(splitAddress[0].length<3){
                this.region = splitAddress[0];
            }else{
                this.city = splitAddress[0];
            }
            if (!this.postalCode) {
                if(splitAddress[1].length>2){
                    if(this.city){
                        this.street = this.city;
                    }
                    this.city = splitAddress[1];
                }else{
                    if(this.region){
                        this.city=this.region;
                    }
                    this.region = splitAddress[1];
                }
            }
            break;
        case 3:
            if(splitAddress[0].length<3){
                this.region = splitAddress[0];
            }else{
                this.city = splitAddress[0];
            }

            if(splitAddress[1].length<3){
                if(this.region){
                    if(this.city){
                        this.street = this.city;
                    }
                    this.city=this.region;
                }
                this.region = splitAddress[1];
            }else{
                if(this.city){
                    this.street = this.city;
                }
                this.city = splitAddress[1];
            }

            if (!this.postalCode) {
                if(splitAddress[2].length<3){
                    if(this.region){
                        if(this.city){
                            this.street = this.city;
                        }
                        this.city=this.region;
                    }
                    this.region = splitAddress[2];
                }else{
                    if(this.city){
                        this.street = this.city;
                    }
                    this.city = splitAddress[1];
                }
            }
            break;
        case 4:
            this.street = splitAddress[0];
            this.city = splitAddress[1];
            this.region = splitAddress[2];
            this.postalCode = splitAddress[3];
    }

    if (!this.postalCode) {
        this.postalCode='';
    }
}

export {
    Address as default,
    Address
};
