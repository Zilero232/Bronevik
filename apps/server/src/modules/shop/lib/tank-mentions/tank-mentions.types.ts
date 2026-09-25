export type NamedVehicle = {
  tankId: number;
  name: string;
};

export type MatchTankNamesInput = {
  text: string;
  vehicles: readonly NamedVehicle[];
  minLength: number;
};
