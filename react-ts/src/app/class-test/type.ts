/**
 * keyof
 */
export interface Person {
  name: string,
  age: number
}

type PersonKeys = keyof Person;

const p1: PersonKeys = 'name';

const p2: PersonKeys = 'age';

type Food = {
  name: string,
  price: number
}

const f1: Food = { name: '122', price: 123 }



/**
 * Record
 */
type Methods = 'GET' | 'POST' | 'DELETE';


type MethodsRecord = Record<Methods, boolean>;





type MyObjectRecord = Record<number, boolean>



const myObject: MyObjectRecord = { 1: true }






/**
 * Partial
 */
const pizza: Partial<Food> = {};

/**
 * Required
 */
type Program = {
  code?: string,  
}

type RequiredProgram = Required<Program>;

/**
 * Pick
 */
type SomePerson = Pick<Person, 'name'>;

/**
 * Readonly
 */
type ReadonlyPerson = Readonly<Person>;

/**
 * Exclude
 */
type MyTypes = 'name' | 'age' | 'height';

type ExcludeMyTypes = Exclude<MyTypes, 'name'>;

/**
 * Omit
 */
type MyPet = {
  color: string
  food: string
  price: number
}

type SomePet = Omit<MyPet, 'color'>