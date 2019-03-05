export type Location = [number, number]; // lng, lat

export interface MVLActionLog {
  id?: number, //uint64_t
  beneficiaryAccount: string,
  mileagePoint: number,
  behaviorPoint: number,
  type: 'mileage'|'pickup'|'review'|'speeding'|'cont_speeding'|'rapid_acc'|'rapid_start'|'rapid_dec'|'rapid_stop',
  timestamp: number, // unix timestamp
  data: any,
}

export interface DrivingBehavior {
  type: 'speeding'|'cont_speeding'|'rapid_acc'|'rapid_start'|'rapid_dec'|'rapid_stop',
  location: Location,
  speed: number, // km/h
  acc: number, // km/h/s
  timestamp: number, // unix timestamp
}