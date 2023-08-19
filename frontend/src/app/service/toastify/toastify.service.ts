import { Injectable } from '@angular/core';
import * as Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class ToastifyService {

  constructor() { }

  successToast(text: string): void {
    this.toast(text, 'var(--cs2DarkGreen)', 2000);
  }

  errorToast(text: string): void {
    this.toast(text, 'var(--cs2DarkRed)', 5000);
  }

  private toast(text: string, backgroundColor: string, durationTime: number): void {
    Toastify({
      text: text,
      duration: durationTime,
      close: true,
      gravity: 'bottom',
      position: 'left',
      stopOnFocus: true,
      style: {
        background: backgroundColor
      }
    }).showToast();
  }
}
