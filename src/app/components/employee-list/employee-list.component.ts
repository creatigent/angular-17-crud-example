import { Component, OnInit } from '@angular/core';
import { Manager, Role, EmployeeRole } from '../../models/app.model';
import { AppService } from '../../services/app.service';
import { Subject } from "rxjs"
import { takeUntil } from "rxjs/operators"

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})

export class EmployeeListComponent implements OnInit {
  componentDestroyed$: Subject<boolean> = new Subject()
  title = '';
  selectedManager: number;
  roleName = "director";
  employees = new Array<Manager>;

  directors = [
    { id: -1, name: 'All' },
  ];
  
  constructor(private appService: AppService) 
  {
    this.selectedManager = this.directors[0].id;

    // employee data
    const employeeData  = this.getEmployeeInfoByManagerId(this.selectedManager);
    //console.log(employeeData);

    // roles data
    // const rolesData = this.getRolesData();
    //console.log(rolesData);

    // employee roles, 
    // const employeeRoles = this.getEmployeeRoles();
    //console.log(employeeRoles);

    employeeData.forEach( e => {
      const roles = this.getEmployeeInfo(e.id!);
      this.employees.push({id: e.id, name: e.name, roles: roles });
    })
  }

  ngOnInit(): void {    
    const roleIds = this.getRoleIds();
    const employeeIds = this.getEmployeeIdsByRoleId(roleIds);
    const employeeInfos = this.getEmployeeInfoByEmployeeIds(employeeIds);
    employeeInfos.forEach( i => {
      this.directors.push({id:i.id!, name:i.name!});
    })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

  onSelected(event: Event) {
    this.employees = new Array<Manager>;
    const filteredValue = (event.target as HTMLInputElement).value;
    const employeeInfos  = this.getEmployeeInfoByManagerId(Number(filteredValue));
    employeeInfos.forEach( e => {
      const roles = this.getEmployeeInfo(e.id!);
      this.employees.push({id: e.id, name: e.name, roles: roles });
    })
  }

  getRoleIds() : Array<number> {
    const roleIds = new Array<number>();
    this.appService.getRolesData()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe({
      next: (data) => {
        data.forEach( i => {
          if(i.name?.toLocaleLowerCase() == this.roleName) {  
            roleIds.push(i.id!);
          }
        });
      }
    })
    return roleIds;
  }

  getEmployeeIdsByRoleId(roleIds : Array<number>) : Array<number> {
    const employeeIds = new Array<number>();
    const roleId = roleIds[0];
    this.appService.getEmployeeRoles().subscribe({
      next : (data) => {
        data.forEach( i=> {
          if(i.roleId == roleId) {  
            employeeIds.push(i.employeeId!);
          }
        })
      }
    })
    return employeeIds;
  }

  getEmployeeInfoByEmployeeIds(employeeIds : Array<number>) : Array<Manager> {
    const employeeInfos = new Array<Manager>();
    this.appService.getEmployees().subscribe({
      next : (data) => {
        data.forEach( i=> {
          if(employeeIds.find(id => id === i.id)) {  
            const name = i.firstName! + " " + i.lastName!
            employeeInfos.push({ id : i.id, name: name });
          }
        })
      }
    })
    return employeeInfos;
  }

  getEmployeeInfoByManagerId(employeeId : number) : Array<Manager> {
    const employeeInfos = new Array<Manager>();
    this.appService.getEmployees().subscribe({
      next : (data) => {
        if (employeeId == -1) {
          data.forEach( i=> {
              const name = i.firstName! + " " + i.lastName!
              employeeInfos.push({ id : i.id, name: name });
          })
        } else {
          data.forEach( i=> {
            const name = i.firstName! + " " + i.lastName!
            if(i.managerId == employeeId) {
              employeeInfos.push({ id : i.id, name: name });
            } 
          })
        }
      }
    })
    return employeeInfos;
  }

  getEmployeeRoles() : Array<EmployeeRole> {
    let employeeRoles : Array<EmployeeRole> = [];
    this.appService.getEmployeeRoles().subscribe({
      next : (data) => {
        data.map( m => { employeeRoles.push({id:m.id, roleId:m.roleId, employeeId:m.employeeId}) })
      }
    })
    return employeeRoles;
  }

  getRolesData() : Array<Role> {
    let roles : Array<Role> = [];
    this.appService.getRolesData().subscribe({
      next : (data) => {
        data.map( m => { roles.push({id:m.id, name:m.name}) })
      }
    })
    return roles;
  }

  getEmployeeInfo(employeeId : number) : Array<Role> {
    let roles : Array<Role> = [];
    
    let roleIds = this.getEmployeeRoleIdsByEmployeeId(employeeId);
    
    roleIds.forEach( i => {
      let role = this.getRolesByRoleId(i);
      roles.push(role);
    })
   
    return roles;
  }

  getRolesByRoleId(roleId : number) : Role {
    let role : Role = {};
    this.appService.getRolesData().subscribe({
      next : (data) => {
        data.forEach( i=> {
          if(i.id === roleId) {  
            role = ({id:i.id, name:i.name});
          }
        })
      }
    })
    return role;
  }

  getEmployeeRoleIdsByEmployeeId(employeeId : number) : number[] {
    let roleIds : number[] = [];
    this.appService.getEmployeeRoles().subscribe({
      next : (data) => {
        data.forEach( i=> {
          if(i.employeeId == employeeId) {  
            roleIds.push(i.roleId!);
          }
        })
      }
    })
    return roleIds;
  }
}
