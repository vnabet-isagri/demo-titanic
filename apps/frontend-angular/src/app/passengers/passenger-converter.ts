import {PassengerDTO} from './models/passenger-dto';
import {Passenger, Sex} from './models/passenger';

/**
 * Conversion du DTO d'un passager
 * @param dto
 */
export default function convertPassenger(dto: PassengerDTO):Passenger {
  return {
    id: dto.id,
    age: dto.age,
    cabin: dto.cabin,
    fare: convertFare(dto.fare),
    embarked: dto.embarked,
    parch: dto.parch,
    sibSp: dto.sibSp,
    sex: dto.sex as Sex,
    name: dto.name,
    pclass: dto.pclass,
    ticket: dto.ticket,
    survived: dto.survived === 1
  }
}

/**
 * Conversion d'un decimal en format chaine de monnaie anglaise '£ s d'
 * @param fare
 */
function convertFare(fare:number):string {
  const pounds = Math.floor(fare);
  const shillings = Math.floor((fare - pounds) * 20);
  const pence = Math.round(((fare - pounds) * 20 - shillings) * 12);
  return `£${pounds} ${shillings}s ${pence}d`;
}
