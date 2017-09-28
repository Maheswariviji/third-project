import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthService } from './Services/regAuth.service';
import { LoginAuthService } from './services/login-auth.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetpasswordService } from './services/reset-password.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { FilterPipe } from './Pipes/filter.pipe';
import { ChatService } from './Services/chat.service';
import { SocketService } from './Services/socket.service';
import { PushNotificationsModule } from 'angular2-notifications';
import { SidebarModule } from 'ng-sidebar';

import { ProfileComponent } from './Components/profile/profile.component';
import { ChangeComponent } from './Components/change/change.component';
import { FriendsComponent } from './Components/friends/friends.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import {SuiModule} from 'ng2-semantic-ui';
@NgModule( {
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        DashboardComponent,
        ResetPasswordComponent,
        FilterPipe,
        ProfileComponent,
        ChangeComponent,
        FriendsComponent,
        SidebarComponent

        
    ],
    imports: [ BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ToastModule.forRoot(),
        PushNotificationsModule,
        SidebarModule.forRoot(),
        SuiModule
    ],
   
    providers: [ChatService,SocketService,AuthService,LoginAuthService,ForgotPasswordService,AuthGuard, NotAuthGuard,ResetpasswordService],
    bootstrap: [AppComponent]
} )
export class AppModule { }
