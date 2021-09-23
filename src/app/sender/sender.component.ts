import { Component, OnInit, ViewChild } from '@angular/core';
import { SenderService } from '../sender.service';
import { Sender } from '../sender';
import { Bank } from '../bank';
import { BankService } from '../bank.service';
import { BankBic } from '../models/bankBic';
import { Customer } from '../models/customer';
import { MessageCode } from '../models/messageCode';
import { TransactionReq } from '../models/transaction';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  
  //Sender
  sender:Sender = new Sender('','',0.0,'');
  @ViewChild('f')
  form:any
  model:Sender = new Sender('','',0.0,'');

  //Receiver
  bank:Bank = new Bank('','');
  model1:Bank = new Bank('','');


  constructor(private senderService:SenderService, private bankService:BankService) { }

  ngOnInit(): void {
  
  }
  /*onTransactionSubmit() {
    let trans: TransactionReq = {
      transferType: this.form.get('transferType')?.value,
      messageCode: this.form.get('messageCode')?.value,
      amount: this.form.get('amount')?.value,
      receiverAcctNumber: this.form.get('accountHolderNumber')?.value,
      receiverName: this.form.get('accountHolderName')?.value,
      senderAcctNumber: this.form?.value,
      receiverBic: this.form?.value
    };*/

    
  getSenderDetails(event:any) {
    if( event.target.value.length == 14) {
      this.senderService.getSenderDetails(this.form.value.cust_id)
    
                .subscribe( res=>{
                  this.sender=new Sender(res.customerId,res.name,res.clearBalance,res.overDraft)
                  console.log(this.sender);
                });
    }
                
  }

  getBankDetails(event:any) {
      this.bankService.getBankDetails(event.target.value)
    
                .subscribe( res=>{
                  this.bank=new Bank(res.bic,res.name)
                  console.log(res.bic)
                  console.log(res.name)
                });     
  }


}
