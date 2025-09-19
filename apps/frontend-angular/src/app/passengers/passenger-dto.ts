export type PassengerDTO = {
  id: number;
  name: string;
  sex: string;
  age: number | null;
  pclass: number;
  sibSp: number;
  parch: number;
  ticket: string;
  fare: number;
  cabin: string | null;
  embarked: string | null;
  survived: number;
}
