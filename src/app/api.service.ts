import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Bank } from "./bank"

@Injectable({
    providedIn: 'root'
  })
export class ApiService{
    constructor(private http:HttpClient) { }

    public url:string="http://localhost:8080/"

    public getBankDetails(bic:string) : Observable<Bank>{
        return this.http.get<Bank>(this.url+"bankBic/"+bic)
    }
    
    
}