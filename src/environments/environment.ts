// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginURL: "http://localhost:55023/auth/login",
  dataServerURL: "http://localhost:55023",
  signUrlServer:'http://localhost:55023/signarmovil/',
  rols: [
    {id: "1",name:"admin"},
    {id: "2",name:"usuari"},
  ]
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
