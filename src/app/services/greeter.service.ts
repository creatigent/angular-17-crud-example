import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GreeterService {

  hello() : string {
    return "Hello I'm Angular!!!";
  }
}

