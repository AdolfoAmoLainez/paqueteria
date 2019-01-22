import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { ArribadesListComponent } from "./arribades-list/arribades-list.component";
import { PaquetEditAddComponent } from "./paquet/paquet-editadd/paquet-editadd.component";
import { PaquetViewsignatComponent } from "./paquet/paquet-viewsignat/paquet-viewsignat.component";
import { PaquetSignarComponent } from "./paquet/paquet-signar/paquet-signar.component";
import { PaquetSignarmovilComponent } from "./paquet/paquet-signarmovil/paquet-signarmovil.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { ErrorPageComponent } from "./shared/error-page/error-page.component";

const appRoutes: Routes = [
    {path:"", component:LoginComponent},
    {path:"login", component:LoginComponent},
    {path:"signarmovil/:id/:qrcode/:tablename", component:PaquetSignarmovilComponent},
    {path:"entrega/:id/:mode",component:PaquetSignarComponent},
    {path:"view/:id",component:PaquetViewsignatComponent},
    {path:"llista", component:ArribadesListComponent,children:[
      {path:":mode/:id",component:PaquetEditAddComponent}
      ],canActivate:[AuthGuard]
    },
    {path:"http-error/:error",component: ErrorPageComponent}

]

@NgModule({
    imports: [
      // RouterModule.forRoot(appRoutes, {useHash: true})
      RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  
  }