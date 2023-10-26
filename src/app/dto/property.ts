import {IUser} from "./user";

export interface IProperty {
  id?: string
  address?: string;
  brokerId?: string;
  details?: string;
  nBathrooms?: string;
  nBedrooms?: string;
  nRooms?: string;
  postalCode?: string;
  price?: number;
  propertyType?: string;
  yearBuilt?: number;
}

export class Property implements IProperty {
  id?: string
  address?: string;
  brokerId?: string;
  details?: string;
  nBathrooms?: string;
  nBedrooms?: string;
  nRooms?: string;
  postalCode?: string;
  price?: number;
  propertyType?: string;
  yearBuilt?: number;


  constructor(id?: string, address?: string, brokerId?: string, details?: string,nBathrooms?: string,nBedrooms?: string,nRooms?: string,postalCode?: string,price?: number,propertyType?: string,yearBuilt?: number ) {
    this.id = id;
    this.address = address;
    this.brokerId = brokerId;
    this.details = details;
    this.nBathrooms = nBathrooms;
    this.nBedrooms = nBedrooms;
    this.nRooms = nRooms;
    this.postalCode = postalCode;
    this.price = price;
    this.propertyType = propertyType;
    this.yearBuilt = yearBuilt;
  }
  public static createPropertyFromDocumentSnapshot(id?: string, doc?: any): IUser {
    return new Property(
      id,
      doc.address,
      doc.brokerId,
      doc.details,
      doc.nBathrooms,
      doc.nBedrooms,
      doc.nRooms,
      doc.postalCode,
      doc.price,
      doc.propertyType,
      doc.yearBuilt,
    )
  }
}
