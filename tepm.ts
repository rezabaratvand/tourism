interface options {
  name: string;
  age: number;
  birthDate: Date;
}

interface Person {
  useFactory: (...args: any[]) => Promise<options>;
}

declare class Temp {
  static register(options: Person);
}

Temp.register({
  useFactory: async () => ({ age: 13, birthDate: new Date(), name: 'reza' }),
});
