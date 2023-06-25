import { Injectable } from '@angular/core';
import * as Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class ToastifyService {

  constructor() { }

  successToast(text: string): void {
    this.toast(text, 'var(--cs2DarkGreen)');
  }

  errorToast(text: string): void {
    this.toast(text, 'var(--cs2DarkRed)');
  }

  private toast(text: string, backgroundColor: string): void {
    Toastify({
      text: text,
      duration: 5000,
      close: true,
      gravity: 'bottom',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: backgroundColor
      }
    }).showToast();
  }
}
