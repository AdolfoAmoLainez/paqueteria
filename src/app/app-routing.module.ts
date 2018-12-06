import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { ArribadesListComponent } from "./arribades-list/arribades-list.component";
import { PaquetEditAddComponent } from "./paquet/paquet-editadd/paquet-editadd.component";
import { PaquetViewsignatComponent } from "./paquet/paquet-viewsignat/paquet-viewsignat.component";
import { PaquetSignarComponent } from "./paquet/paquet-signar/paquet-signar.component";
import { PaquetSignarmovilComponent } from "./paquet/paquet-signarmovil/paquet-signarmovil.component";
import { AuthGuard } from "./auth/auth-guard.service";

const appRoutes: Routes = [
    {path:"", component:LoginComponent},
    {path:"login", component:LoginComponent},
    {path:"signarmovil/:id/:qrcode", component:PaquetSignarmovilComponent},
    {path:"llista", component:ArribadesListComponent,children:[
      {path:"entrega/:id",component:PaquetSignarComponent},
      {path:"view/:id",component:PaquetViewsignatComponent},
      {path:":mode/:id",component:PaquetEditAddComponent}

      ],canActivate:[AuthGuard]
    }

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