import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { ArribadesListComponent } from "./arribades-list/arribades-list.component";
import { PaquetComponent } from "./paquet/paquet.component";

const appRoutes: Routes = [
    {path:"login", component:LoginComponent},
    {path:"llista", component:ArribadesListComponent},
    {path:"signarmovil/:id/:qrcode", component:PaquetComponent}
    

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