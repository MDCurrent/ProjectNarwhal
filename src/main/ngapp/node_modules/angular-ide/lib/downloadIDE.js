const fs = require('fs');

const mt = require('mt-downloader');
const path = require('path');
const Rx = require('rx');
const demux = require('muxer').demux;

const ProgressBar = require('./progress-bar');

const chalk = require('chalk');

const url = require('url');

const IDE_COMPRESSED_FILE = 'angular_ide';


function urlBuilder(osType, arch) {
  const ideURLBase = 'https://www.genuitec.com/products/webclipse/download/angularide';
  
  const downloadURL = url.parse(ideURLBase);
  let osArch = null;

  switch (osType) {
    case 'Linux':
      if (arch === 'x64') {
        osArch = 'linux.gtk.x86_64';
      } else {
        osArch = 'linux.gtk.x86';
      }
      break;
    case 'Darwin':
      osArch = 'macosx.cocoa.x86_64';
      break;
    case 'Windows_NT':
      if (arch === 'x64') {
        osArch = 'win32.win32.x86_64';
      } else {
        osArch = 'win32.win32.x86';
      }
      break;
    default:
  }

  downloadURL.query = { os: osArch };

  return url.format(downloadURL);
}

module.exports = function (osType, arch) {
  const SIMULTANEOUS_DOWNLOADS = 3;

  const fStat = Rx.Observable.fromNodeCallback(fs.stat);

  const downloadOptions = {
    url: urlBuilder(osType, arch),
    path: path.resolve(IDE_COMPRESSED_FILE),
    range: SIMULTANEOUS_DOWNLOADS,
  };

  return Rx.Observable.create((obs) => {
    const validDownload$ = Rx.Observable.create((observer) => {
      fStat(`${IDE_COMPRESSED_FILE}.mtd`)
          .subscribe(
            x => {
              observer.onNext(true);
              observer.onCompleted();
            },
            e => {
              const create$ = mt.CreateMTDFile(downloadOptions);
              const [{ remoteFileSize$ }] = demux(create$, 'meta$', 'remoteFileSize$');

              create$.forkJoin(remoteFileSize$)
                .subscribe(x => {
                  const fileSize = x[1];
                    observer.onNext(!!fileSize);
                    observer.onCompleted();
                });
            }
          );
      })
      .share();

    validDownload$.subscribe(
      valid => {
        if (!valid) {
          obs.onError(new Error('try again on November 3rd!'));
          obs.onCompleted();
        } else {

          const downloadedSource$ = mt.DownloadFromMTDFile(path.resolve(`${IDE_COMPRESSED_FILE}.mtd`)).share();
          const [{ meta$, fdR$ }] = demux(downloadedSource$, 'meta$', 'fdR$');

          const bar = new ProgressBar('Downloading...:bar :completed%');

          mt.Completion(meta$)
            .subscribe(x => {
              bar.update(x * 100, 100);
            });

          const preFinSource$ = downloadedSource$.last()
            .withLatestFrom(fdR$, meta$)
            .map(([a, fd, meta]) => {
              return { fd$: Rx.Observable.just(fd), meta$: Rx.Observable.just(meta) };
            });

          preFinSource$
            .map((x) => {
              const finalizeDownload$ = mt.FinalizeDownload(x).share();
              const [{ truncated$, renamed$ }] = demux(finalizeDownload$, 'truncated$', 'renamed$');

              renamed$
                .subscribe(() => {
                    bar.complete();
                    obs.onNext(downloadOptions.path);
                });        

            })
            .subscribe();
        }
      }
    );  
  });

};
