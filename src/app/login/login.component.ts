import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public breakpoint: number;
    public rowspanForm: number;
    public rowspanLogo: number;
    private innerWidth: number;
    private innerHeight: number;
    public hide = true;
    public sessionExpiredMessage: string;

    constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: this.formBuilder.control('', Validators.compose([Validators.required])),
            password: this.formBuilder.control('', Validators.compose([Validators.required]))
        });

        this.breakpoint = (window.innerWidth > window.innerHeight) ? 2 : 1;
        this.rowspanForm = (window.innerWidth > window.innerHeight) ? 1 : 1;
        this.rowspanLogo = (window.innerWidth > window.innerHeight) ? 1 : 1;

        this.sessionExpiredMessage = this.auth.getSessionExpiredMessage();
    }

    ngOnDestroy(): void {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        if (this.innerWidth > this.innerHeight) {
            this.breakpoint = 2;
            this.rowspanForm = 1;
            this.rowspanLogo = 1;
        } else {
            this.breakpoint = 1;
            this.rowspanForm = 1;
            this.rowspanLogo = 1;
        }
    }

    public onSubmit(formData: any) {
        this.auth.login(formData);
    }
}
