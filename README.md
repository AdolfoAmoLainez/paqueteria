# Paqueteria

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

See `paqueteria.sql` for database tables.
You have to add manually the first user in the `usuaris` table for administration pourposes with `rol_id 1`. Notice the `niu` column is the username used to enter through CAS and to get access to the app. The rol_id is hardcoded in the `environment` files of the app (1=admin, 2=standard user) by default the `2` rol is used when a user is added with the app.

Important columns at `usuaris` table:
* tablename: Table used by the user identified by `niu`. When a user is added thruogh the app, a new table is created by copying the table `paquets_buida` 
* ubicacioemail: The text added to the mail sended to the recipient to indicate where to pick up the package.
* gestoremail: The mail address to use on the `from` of the mail.
* ldapuri: Not used at this version. Keeped for backwards compatibility.
* uidbasedn: Not used at this version. Keeped for backwards compatibility.

A linux server is recommended because of the mail needs for notifications.
You have to configure exim4 (or sendmail) to use de `mail` command to send mails from command line. See `app.post('/selfapi/enviaMail')` and `app.post('/selfapi/enviaMailRemitent')`middlewares on index.js

Mysql-restapi (https://www.npmjs.com/package/mysql-restapi) is used to have CRUD rest api access to de DB. We use a hardcoded module in the mysql-restapi folder but we need its dependencies. So we have to install manually the package on the `backend` folder project with 
```
npm install mysql-restapi
```

## index.js

Change connectin port with de `PORT` variable.

Change the CAS host at the `cas.configure` object options.

Change `secret pass frase` at `session middleware` creation:

```javascript
app.use(session({
	secret: 'your_secret_random_pass_frase',
        resave: false,
        saveUninitialized: true
	}
));
```

Configure https access with server certificates on `options` variable at the end of the file

```javascript
var options = {
    key: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.key')),
    cert: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.crt'))
  };
```
## connections.js
Configure mysql database access at the mysqlOptions variable:

```javascript
var mysqlOptions = {
  host:'localhost',
  user:'paqueteria',
  password:'paqueteria',
  database:'paqueteria'
};
```

## Development server

Run `ng serve` for a frontend dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. You can configure a mysql instance in localhost and set it up in the connections.js file. Also have to change the environment files to especify the backend URLs.
Run `npm run start:server` to start de backend server on the localhost.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --prod --aot` to build the project. The build artifacts will be stored in the `backend/public` directory. Use the `--configuration=production` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
