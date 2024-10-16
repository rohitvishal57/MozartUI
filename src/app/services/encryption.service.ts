import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private secretKey = '0123456789abcdef0123456789abcdef';

  encrypt(data: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string) {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }


  textEncrypt$(data: string) {
    return CryptoJS.AES.encrypt(data, this.secretKey.trim()).toString()
  }

  textDecrpt$(data: string) {
    return CryptoJS.AES.decrypt(data, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  objEncrypt$(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey.trim()).toString();
  }
  objDecrpt$(data: any) {
    const decrypted = CryptoJS.AES.decrypt(data, this.secretKey.trim());
    return CryptoJS.enc.Utf8.stringify(decrypted)
  }

}
