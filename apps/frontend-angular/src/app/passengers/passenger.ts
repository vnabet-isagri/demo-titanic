export type Passenger = {
  id: number;
  name: string;
  sex: Sex;
  age: number | null;
  pclass: number;
  sibSp: number;
  parch: number;
  ticket: string;
  fare: string;
  cabin: string | null;
  embarked: string | null;
  survived: boolean;
}

export type Sex = "male" | "female";
