export type PassengersFilter = {
  page: number;
  limit: number;
  orderby: string;
  order: 'ASC' | 'DESC',
  name: string;
  survived: boolean;

}
