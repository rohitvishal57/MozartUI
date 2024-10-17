import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AesEncryptionService {
  
  private key: string = '0123456789abcdef0123456789abcdef'; 
  private iv: string = '0123456789abcdef';    

  private getKeyAndIv() {
    return {
      key: CryptoJS.enc.Utf8.parse(this.key),
      iv: CryptoJS.enc.Utf8.parse(this.iv),
    };
  }

  encrypt(payload: any): string {
    const { key, iv } = this.getKeyAndIv();
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decrypt(encryptedData: string): any {
    const { key, iv } = this.getKeyAndIv();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  }
}
