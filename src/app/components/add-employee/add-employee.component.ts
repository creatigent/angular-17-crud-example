import { Component, OnInit } from '@angular/core';
import { Employee, Manager, Director } from '../../models/app.model';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ageValidator } from '../../shared/age.validator';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})

export class AddEmployeeComponent implements OnInit {
  submissionForm!: FormGroup;
  selectedManager: number = 1;
  submitted = false;
  employees = new Array<Manager>;
  directors = new Array<Director>; 
  roleName = "director";
  managerId : number  = 0;
  requiredField: boolean = false;

  dropdownList: { item_id: number; item_text: string }[] = []
  selectedItems : any;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: false
  };

  constructor(private appService: AppService, 
              private fb: FormBuilder, 
              private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.submissionForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age : ['', [Validators.required, ageValidator(18)]]
    });

    const roleIds = this.getRoleIds();
    const employeeIds = this.getEmployeeIdsByRoleId(roleIds);
    const employeeInfos = this.getEmployeeInfoByEmployeeIds(employeeIds);
    employeeInfos.forEach( i => {
      this.directors.push({id:i.id!, name:i.name!});
    })

    this.managerId = this.selectedManager;

    this.populateDropDonwlistWithRoles();
  }

  populateDropDonwlistWithRoles() : void {
    this.appService.getRolesData().subscribe({
      next: (data) => {
        data.forEach( i => {
          this.dropdownList.push({ item_id: i.id!, item_text: i.name! });
        });
      }
    })
  }

  setStatus() {
    (this.selectedItems.length > 0) ? this.requiredField = true : this.requiredField = false;
  }

  onItemSelect(item: any) {   
    //this.setStatus();
    this.setClass();
  }
  onSelectAll(items: any) {
    this.setClass();
  }

  setClass() {
    this.setStatus();
    if (this.selectedItems.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }

  getRoleIds() : Array<number> {
    const roleIds = new Array<number>();
    this.appService.getRolesData().subscribe({
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

  onSelected(event: Event) {
    const filteredValue = (event.target as HTMLInputElement).value;
    this.managerId = Number(filteredValue);
  }

  toasterMessage(msg : string) {
    this.toastr.success(msg);
  }

  onSubmit(): void {
    if (this.submissionForm.valid) {
      const values = this.submissionForm.value;
      const managerId = this.managerId;
      const firstName = values.firstName;
      const lastName = values.lastName;
      const roles = this.selectedItems;
      if( roles !== undefined) {
        const newEmployeeId = this.saveEmployee(managerId, firstName, lastName);
        this.saveEmployeeRole(roles, newEmployeeId);
        this.toasterMessage("Form submitted successfully!");
      } else {
        this.toasterMessage("Form has errors. Please check the fields.");
      }
    } else {
      this.toasterMessage("Form has errors. Please check the fields.");
    }
  }

  getEmployeeInfoByManagerId(employeeId : number) : Array<Manager> {
    // console.log(employeeId);
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

  saveEmployee(managerId: number, firstName: string, lastName:string): number {
    const list = this.appService.getEmployeeList();
    const employeeIds : number[] = [];
    list.map(({ id }) => employeeIds.push(id!));
    var largeNumber = this.findLargestId(employeeIds);
    const newEmployeeId = largeNumber + 1;
    if(!list.find( m => m.id === newEmployeeId ))
    {
      this.appService.addEmployee(newEmployeeId, managerId, firstName, lastName);
    }
    return newEmployeeId;
  }

  saveEmployeeRole(roles: any, employeeId: number): void {
    const employeeRoleList = this.appService.getEmployeeRoleList();
    const roleIds : number[] = [];
    employeeRoleList.map(({ id }) => roleIds.push(id!));
    let newRoleId = this.findLargestId(roleIds);
   
    roles.forEach ( (i:any) => {
      this.appService.addEmployeeRole(++newRoleId, i.item_id, employeeId);
    });

    /*
    this.appService.getEmployeeRoles().subscribe({
      next : (data) => {
        data.map(i => console.log(i.id, i.roleId, i.employeeId));
      }
    })
    */
  }

  findLargestId(array: number[]): number {
    let largestId = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] > largestId) {
        largestId = array[i];
      }
    }
    return largestId;
  }
}
