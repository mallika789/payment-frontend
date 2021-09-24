import { Component, OnInit, ViewChild } from '@angular/core';
import { SenderService } from '../sender.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sender } from '../sender';
import { Bank } from '../bank';
import { ApiService } from '../api.service';
import { BankBic } from '../models/bankBic';
import { Customer } from '../models/customer';
import { TransactionReq } from '../models/transaction';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';


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
  dialogRef!: MatDialogRef<ModalComponent>;

  //Receiver
  bank: Bank = new Bank('', '');
  model1: Bank = new Bank('', '');


  constructor(private senderService: SenderService, private apiService: ApiService, private dialog: MatDialog) { }

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
              "accountHolderClearBalanace": cust.clearBalance
            });
          }, (error) => {
            this.senderForm.patchValue({
              "accountHolderName": '',
              "accountHolderClearBalanace": '0'
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
              "receiverBankName": bic.name
            });
          }, (error) => {
            this.receiverForm.patchValue({
              "receiverBankName": '',
            });
          });
      }
    });

  }
  onTransactionSubmit() {
    let trans: TransactionReq = {
      transferType: this.transactionForm.get('transferType')?.value,
      messageCode: this.transactionForm.get('messageCode')?.value,
      amount: this.transactionForm.get('amount')?.value,
      receiverAcctNumber: this.receiverForm.get('receiverNumber')?.value,
      receiverName: this.receiverForm.get('receiverName')?.value,
      senderAcctNumber: this.senderForm.get("accountHolderNumber")?.value,
      receiverBic: this.receiverForm.get("receiverBicCode")?.value
    };


    this.dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "",
        message: "",
        isLoading: true
      }
    });

    this.apiService.postTransaction(trans).subscribe((data) => {
      this.dialogRef.componentInstance.data = {
        title: "Transaction successfull 🥳",
        message: "amount has been sent successfully",
        isLoading: false
      };
    }, (error) => {
      this.dialogRef.componentInstance.data = {
        title: "Transaction failed ",
        message: error?.error?.message,
        isLoading: false
      };
    })
  }




}
