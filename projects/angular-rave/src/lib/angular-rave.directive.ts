import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { PrivateRaveOptions } from './rave-options';

interface MyWindow extends Window {
  getpaidSetup: (raveOptions: Partial<PrivateRaveOptions>) => void;
}

declare var window: MyWindow;

@Directive({
  selector: '[angular-rave]'
})
export class AngularRaveDirective {
  @Input() PBFPubKey: string;
  @Input() integrity_hash: string;
  @Input() txref: string;
  @Input() payment_method: string;
  @Input() amount: number;
  @Input() currency: string;
  @Input() country: string;
  @Input() customer_email: string;
  @Input() customer_phone: string;
  @Input() customer_firstname: string;
  @Input() customer_lastname: string;
  @Input() pay_button_text: string;
  @Input() custom_title: string;
  @Input() subaccount: { id: string, transaction_split_ratio: string }[];
  @Input() custom_description: string;
  @Input() redirect_url: string;
  @Input() custom_logo: string;
  @Input() meta: any;
  @Input() raveOptions: Partial<PrivateRaveOptions> = {};
  @Output() onclose: EventEmitter<void> = new EventEmitter<void>();
  @Output() callback: EventEmitter<any> = new EventEmitter<any>();
  private _raveOptions: Partial<PrivateRaveOptions> = {};

  constructor() { }

  @HostListener('click')
  buttonClick() {
    this.pay();
  }

  pay() {
    if (typeof window.getpaidSetup !== 'function') {
      return console.error('ANGULAR-RAVE: Please verify that you imported rave\'s script into your index.html');
    }
    // If the raveoptions Input is present then use
    if (this.raveOptions && Object.keys(this.raveOptions).length > 3) {
      if (this.validateOptions()) {
        window.getpaidSetup(this.raveOptions);
      }
    } else {
      if (this.validateInput()) {
        this.insertRaveOptions();
        window.getpaidSetup(this._raveOptions);
      }
    }
  }

  insertRaveOptions() {
    if (this.amount) { this._raveOptions.amount = this.amount; }
    if (this.PBFPubKey) { this._raveOptions.PBFPubKey = this.PBFPubKey; }
    if (this.payment_method) { this._raveOptions.payment_method = this.payment_method; }
    if (this.redirect_url) { this._raveOptions.redirect_url = this.redirect_url; }
    if (this.integrity_hash) { this._raveOptions.integrity_hash = this.integrity_hash; }
    if (this.pay_button_text) { this._raveOptions.pay_button_text = this.pay_button_text; }
    if (this.country) { this._raveOptions.country = this.country; }
    if (this.currency) { this._raveOptions.currency = this.currency; }
    if (this.custom_description) { this._raveOptions.custom_description = this.custom_description; }
    if (this.customer_email) { this._raveOptions.customer_email = this.customer_email; }
    if (this.custom_logo) { this._raveOptions.custom_logo = this.custom_logo; }
    if (this.custom_title) { this._raveOptions.custom_title = this.custom_title; }
    if (this.customer_firstname) { this._raveOptions.customer_firstname = this.customer_firstname; }
    if (this.customer_lastname) { this._raveOptions.customer_lastname = this.customer_lastname; }
    if (this.subaccount) { this._raveOptions.subaccount = this.subaccount; }
    if (this.customer_phone) { this._raveOptions.customer_phone = this.customer_phone; }
    if (this.txref) { this._raveOptions.txref = this.txref; }
    if (this.onclose) { this._raveOptions.onclose = () => this.onclose.emit(); }
    if (this.callback) { this._raveOptions.callback = res => this.callback.emit(res); }
  }

  validateOptions() {
    if (!this.raveOptions.PBFPubKey) { return console.error('ANGULAR-RAVE: Merchant public key is required'); }
    if (!(this.raveOptions.customer_email || this.raveOptions.customer_phone)) {
      return console.error('ANGULAR-RAVE: Customer email or phone number is required');
    }
    if (!this.raveOptions.txref) { return console.error('ANGULAR-RAVE: A unique transaction reference is required'); }
    if (!this.raveOptions.amount) { return console.error('ANGULAR-RAVE: Amount to charge is required'); }
    if (!this.callback.observers.length) { return console.error('ANGULAR-RAVE: You should attach to callback to verify your transaction'); }
    if (this.onclose.observers.length) { this.raveOptions.onclose = () => this.onclose.emit(); }
    this.raveOptions.callback = res => this.callback.emit(res);
    return true;
  }

  validateInput() {
    if (!this.PBFPubKey) { return console.error('ANGULAR-RAVE: Merchant public key is required'); }
    if (!(this.customer_email || this.customer_phone)) { return console.error('ANGULAR-RAVE: Customer email or phone number is required'); }
    if (!this.txref) { return console.error('ANGULAR-RAVE: A unique transaction reference is required'); }
    if (!this.amount) { return console.error('ANGULAR-RAVE: Amount to charge is required'); }
    if (!this.callback) { return console.error('ANGULAR-RAVE: You should attach to callback to verify your transaction'); }
    return true;
  }

}
