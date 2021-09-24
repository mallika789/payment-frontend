import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Bank } from "./bank"
import { Customer } from "./models/customer"
import { TransactionReq } from "./models/transaction"

@Injectable({
    providedIn: 'root'
  })
export class ApiService{
    constructor(private http:HttpClient) { }

    public url:string="http://localhost:8080/"

    public getBankDetails(bic:string) : Observable<Bank>{
        return this.http.get<Bank>(this.url+"bankBic/"+bic)
    }

    public getCustomerDetails(cust_id:string) : Observable<Customer> {
        return this.http.get<Customer>(this.url+"customer/"+cust_id)
    }
    public postTransaction(trans:TransactionReq){
        return this.http.post('/transaction',trans);
      }
    
    
}