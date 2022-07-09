import {   Component,
  NgModule,
  VERSION,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
 } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h2>Video in {{ngVersion}}</h2>
  <button id="showVideo" (click)="initVideo($event)" [disabled]="streaming">Open camera</button><br>
  <pre *ngIf="error">
            {{error | json}}
          </pre>
  <video #video width="320" height="240"></video>
  `,
  styles: []
})
export class AppComponent implements AfterViewInit {
  title = "live-video-demo";
  @ViewChild("video") video: ElementRef;
  ngVersion: string;
  streaming = false;
  error: any;
  private stream: MediaStream = null;
  private constraints = {
    audio: false,
    video: true,
  };

  constructor() {
    this.ngVersion = `Angular! v${VERSION.full}`;
  }

  ngAfterViewInit() {
  }

  initVideo(e) {
    this.getMediaStream()
      .then((stream) => {
        this.stream = stream;
        this.streaming = true;
      })
      .catch((err) => {
        this.streaming = false;
        this.error = err.message + " (" + err.name + ":" + err.constraintName + ")";
      });
  }
  private getMediaStream(): Promise<MediaStream> {

    const video_constraints = { video: true,audio:true };
    const _video = this.video.nativeElement;
    return new Promise<MediaStream>((resolve, reject) => {
      // (get the stream)
      return navigator.mediaDevices.
        getUserMedia(video_constraints)
        .then(stream => {
          (<any>window).stream = stream; // make variable available to browser console
          _video.srcObject = stream;
          // _video.src = window.URL.createObjectURL(stream);
          _video.onloadedmetadata = function (e: any) { };
          _video.play();
          return resolve(stream);
        })
        .catch(err => reject(err));
    });
  }
}
