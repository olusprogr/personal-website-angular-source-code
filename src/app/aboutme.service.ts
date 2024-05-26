import { Injectable } from '@angular/core';
import * as aboutMeData from '../assets/json/aboutme.json'

type aboutMe = {
  title: string,
  description: string
  subTitle: string
  subDescription: string
}

@Injectable({
  providedIn: 'root'
})
export class AboutmeService {

  private aboutMe: aboutMe[] = [];

  constructor() {
    this.aboutMe = (aboutMeData as any).default as aboutMe[]
  }

  public getAboutMe(): aboutMe[] {
    return this.aboutMe
  }
}
