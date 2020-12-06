

export interface Territory {
  territoryId: string;
  number: number;
  section: string;
  checkouts: Checkout[];
  territoryCardFileName: string;
  notes: string;
}

export interface Checkout {
  checkoutId: number;
  territoryId: string;
  name: string;
  checkedIn: Date;
  checkedOut: Date;
}
