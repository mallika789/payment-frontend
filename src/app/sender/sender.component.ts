import { Component, OnInit, ViewChild } from '@angular/core';
import { SenderService } from '../sender.service';
import { Sender } from '../sender';
import { Bank } from '../bank';
import { ApiService } from '../api.service';
import { BankBic } from '../models/bankBic';
import { Customer } from '../models/customer';
import { MessageCode } from '../models/messageCode';
import { TransactionReq } from '../models/transaction';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {

  //Sender
  sender: Sender = new Sender('', '', 0.0, '');
  @ViewChild('f')
  form: any
  model: Sender = new Sender('', '', 0.0, '');

  transactionForm!: FormGroup;
  senderForm!: FormGroup;
  receiverForm!: FormGroup;

  //Receiver
  bank: Bank = new Bank('', '');
  model1: Bank = new Bank('', '');


  constructor(private senderService: SenderService, private apiService: ApiService) { }

  ngOnInit() {
    this.senderForm = new FormGroup({
      accountHolderNumber: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]),
      accountHolderName: new FormControl({ value: '', disabled: true }),
      accountHolderClearBalanace: new FormControl({ value: '0', disabled: true })

    });
    this.receiverForm = new FormGroup({
      receiverNumber: new FormControl('', Validators.required),
      receiverName: new FormControl({ value: '', disabled: true }),
      receiverBicCode: new FormControl(null, Validators.required),
      receiverBankName: new FormControl({ value: '', disabled: true })
    });
    this.transactionForm = new FormGroup({
      transferType: new FormControl('', Validators.required),
      messageCode: new FormControl('', Validators.required),
      transferAmount: new FormControl('', Validators.required)
    });



    this.senderForm.get('accountHolderNumber')?.statusChanges.subscribe(status => {
      if (status === "VALID") {
        let accountNumber: string = this.senderForm.get('accountHolderNumber')?.value;
        this.apiService.getCustomerDetails(accountNumber)
          .subscribe((cust: Customer) => {
            this.senderForm.patchValue({
              "accountHolderName": cust.name,
              "clearBalance": cust.clearBalance
            });
          }, (error) => {
            this.senderForm.patchValue({
              "accountHolderName": '',
              "clearBalance": '0'
            });
          });
      }
    });

    this.receiverForm.get('receiverNumber')?.statusChanges.subscribe(status => {
      if (status === "VALID") {
        let accountNumber: string = this.receiverForm.get('receiverNumber')?.value;
        this.apiService.getCustomerDetails(accountNumber)
          .subscribe((cust: Customer) => {
            this.receiverForm.patchValue({
              "receiverName": cust.name,
            });
          }, (error) => {
            this.receiverForm.patchValue({
              "receiverName": '',
            });
          });
      }
    });


    this.receiverForm.get("receiverBicCode")?.statusChanges.subscribe(status => {
      if (status === "VALID") {
        let bic: string = this.receiverForm.get("receiverBicCode")?.value;
        this.apiService.getBankDetails(bic)
          .subscribe((bic: BankBic) => {
            this.receiverForm.patchValue({
              "bankName": bic.name
            });
          }, (error) => {
            this.receiverForm.patchValue({
              "bankName": '',
            });
          });
      }
    });



  }


  /*getSenderDetails(event:Event) {
    if( event.target.value.length == 14) {
      this.senderService.getSenderDetails(this.form.value.cust_id)
                .subscribe( res=>{
                  this.sender=new Sender(res.customerId,res.name,res.clearBalance,res.overDraft)
                  console.log(this.sender);
                });
    }
                
  }*/




}
