export class Manager {
  id? : number;
  name?: string;
  roles? : Array<Role>
}

export class EmployeeInfo {
  id? : number;
  name?: string;
  roles? : Array<Role>
}

export class Director {
  id?: number;
  name?: string;
}

export class Employee {
  id?: number;
  managerId?: number;
  firstName?: string;
  lastName?: string;
}

export class Role {
  id?: number;
  name?: string;
}

export class EmployeeRole {
  id?: number;
  roleId?: number;
  employeeId?: number;
}

export interface User {
  id: number;
  name: string;
}
