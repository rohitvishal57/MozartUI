import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AesEncryptionService {
  
  private key: string = '0123456789abcdef0123456789abcdef'; 
  private iv: string = '0123456789abcdef';    
  private axiskey: string = '5891233561234567'; 
  private getKeyAndIv() {
    return {
      key: CryptoJS.enc.Utf8.parse(this.key),
      iv: CryptoJS.enc.Utf8.parse(this.iv),
    };
  }
  private getAxisKeyAndIv() {
    return {
      key: CryptoJS.enc.Utf8.parse(this.axiskey),
      iv: CryptoJS.enc.Utf8.parse(this.axiskey),
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
 axisEncrypt(payload: any): string {
    const { key, iv } = this.getAxisKeyAndIv();
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
  axisDecrypt(encryptedData: string): any {
    const { key, iv } = this.getAxisKeyAndIv();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  }
}
