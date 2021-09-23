import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Bank } from "./bank"

@Injectable({
    providedIn: 'root'
  })
export class BankService{
    constructor(private http:HttpClient) { }

    public url:string="http://localhost:8080/bankBic/"

    public getBankDetails(bic:string) : Observable<Bank>{
        return this.http.get<Bank>(this.url+bic)
    }
}