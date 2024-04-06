import { Component } from '@angular/core';
import { User } from './models/app.model';
import { GreeterService } from './services/greeter.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tyler';
  users: User[] = [];
  msg: string = "simple string";

  constructor(private userService: UserService, private greeterService: GreeterService ) { }

  ngOnInit(): void {
    this.msg = this.greeterService.hello();
    this.userService.getUsers().then(users => this.users = users);
  }
}
