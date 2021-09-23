import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sender } from './sender';

@Injectable({
  providedIn: 'root'
})
export class SenderService {

  constructor(private http:HttpClient) { }

  public url:string="http://localhost:8080/customer/"

  public getSenderDetails(cust_id:string) : Observable<Sender>{
    return this.http.get<Sender>(this.url+cust_id)
  }

}