import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, Subject } from 'rxjs';
import { Role, EmployeeRole, Employee } from '../models/app.model';

const baseUrl = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})

export class AppService {
  constructor(
    private http: HttpClient
  ){}

  employees: Employee[] = [
    { id: 1, managerId: 0, firstName: "Jeffrey", lastName: "Wells", },
    { id: 2, managerId: 1, firstName: "Victor", lastName: "Atkins", },
    { id: 3, managerId: 1, firstName: "Kelli", lastName: "Hamilton", },
    { id: 4, managerId: 2, firstName: "Adam", lastName: "Broun", },
    { id: 5, managerId: 2, firstName: "Brian", lastName: "Cruz", },
    { id: 6, managerId: 2, firstName: "Kristen", lastName: "Floyd", },
    { id: 7, managerId: 3, firstName: "Lois", lastName: "Martinez", },
    { id: 8, managerId: 3, firstName: "Michael", lastName: "Lind", },
    { id: 9, managerId: 3, firstName: "Eric", lastName: "Bay", },
    { id: 10, managerId: 3, firstName: "Brandon", lastName: "Young", },
  ];



  employeeRole: EmployeeRole[] = [
    { id: 1, roleId: 1, employeeId: 1 }, // Jeffrey Wells
    { id: 2, roleId: 1, employeeId: 2 }, // Victor Atkins
    { id: 3, roleId: 1, employeeId: 3 }, // Kelli Hamilton
    { id: 4, roleId: 2, employeeId: 4 }, // Adam Broun
    { id: 5, roleId: 3, employeeId: 4 }, // Adam Broun
    { id: 6, roleId: 4, employeeId: 5 }, // Brian Cruz
    { id: 7, roleId: 6, employeeId: 6 }, // Kristen Floyd
    { id: 8, roleId: 3, employeeId: 7 }, // Lois Martinez
    { id: 9, roleId: 5, employeeId: 8 }, // Michael Lind
    { id: 10, roleId: 2, employeeId: 9 }, // Eric Bay
    { id: 11, roleId: 6, employeeId: 9 }, // Eric Bay
    { id: 12, roleId: 4, employeeId: 10 }, // Brandon Young
  ];


  roles: Role[] = [
    { id: 1, name: "Director"},
    { id: 2, name: "IT" },
    { id: 3, name: "Support" },
    { id: 4, name: "Accounting" },
    { id: 5, name: "Analyst" },
    { id: 6, name: "Sales" }
  ];

  getRolesData(): Observable<Role[]> {    
    // this.http.get("")
    return of(this.roles);
  }

  getEmployeeRoles(): Observable<EmployeeRole[]> {
    return of(this.employeeRole);
  }

  getEmployeeRoleList() : EmployeeRole[] {
    return this.employeeRole;
  }

  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  getEmployeeList() : Employee[] {
    return this.employees;
  }

  addEmployee(id: number, managerId: number, firstName: string, lastName: string) : void {   
    this.employees.push({id:id, managerId:managerId, firstName:firstName, lastName:lastName });
  }
   
  addEmployeeRole(id: number, roleId: number, employeeId: number) : void {   
    this.employeeRole.push({id:id, roleId:roleId, employeeId:employeeId });
  }
  
 }
