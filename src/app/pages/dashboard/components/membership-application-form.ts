import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-membership-application-form',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        InputTextModule, 
        TextareaModule, 
        ButtonModule, 
        CardModule,
        DatePickerModule
    ],
    template: ` 
    <div class="flex items-center justify-center min-h-screen overflow-hidden p-4">
        <div class="card w-full max-w-5xl">
            
            <h2 class="text-center text-3xl font-bold mb-6">Membership Application Form</h2>
            
            <form #applicationForm="ngForm" (ngSubmit)="onSubmit()">
                <!-- Row 1: Name and Address -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="field">
                        <label for="fullName" class="block font-bold mb-2">First Name and Last Name:</label>
                        <input 
                            pInputText 
                            id="fullName" 
                            [(ngModel)]="formData.fullName" 
                            name="fullName" 
                            #fullName="ngModel"
                            pattern="^[a-zA-ZÀ-ÿ\s]+$"
                            class="w-full"
                            [class.ng-invalid]="fullName.invalid && fullName.touched"
                            required />
                        <small *ngIf="fullName.invalid && fullName.touched" class="text-red-500">
                            <span *ngIf="fullName.errors?.['required']">Name is required.</span>
                            <span *ngIf="fullName.errors?.['pattern']">Name can only contain letters and spaces.</span>
                        </small>
                    </div>
                    <div class="field">
                        <label for="address" class="block font-bold mb-2">Address:</label>
                        <input 
                            pInputText 
                            id="address" 
                            [(ngModel)]="formData.address" 
                            name="address" 
                            #address="ngModel"
                            class="w-full"
                            [class.ng-invalid]="address.invalid && address.touched"
                            required />
                        <small *ngIf="address.invalid && address.touched" class="text-red-500">
                            <span *ngIf="address.errors?.['required']">Address is required.</span>
                        </small>
                    </div>
                </div>

                <!-- Row 2: City and Personal ID -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="field">
                        <label for="city" class="block font-bold mb-2">City:</label>
                        <input 
                            pInputText 
                            id="city" 
                            [(ngModel)]="formData.city" 
                            name="city" 
                            #city="ngModel"
                            pattern="^[a-zA-ZÀ-ÿ\s]+$"
                            class="w-full"
                            [class.ng-invalid]="city.invalid && city.touched"
                            required />
                        <small *ngIf="city.invalid && city.touched" class="text-red-500">
                            <span *ngIf="city.errors?.['required']">City is required.</span>
                            <span *ngIf="city.errors?.['pattern']">City can only contain letters and spaces.</span>
                        </small>
                    </div>
                    <div class="field">
                        <label for="personalId" class="block font-bold mb-2">Personal ID Number:</label>
                        <input 
                            pInputText 
                            id="personalId" 
                            [(ngModel)]="formData.personalId" 
                            name="personalId" 
                            #personalId="ngModel"
                            pattern="^[0-9]+$"
                            class="w-full"
                            [class.ng-invalid]="personalId.invalid && personalId.touched"
                            required />
                        <small *ngIf="personalId.invalid && personalId.touched" class="text-red-500">
                            <span *ngIf="personalId.errors?.['required']">Personal ID Number is required.</span>
                            <span *ngIf="personalId.errors?.['pattern']">Personal ID Number can only contain numbers.</span>
                        </small>
                    </div>
                </div>

                <!-- Row 3: Phone and Email -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="field">
                        <label for="phone" class="block font-bold mb-2">Phone:</label>
                        <input 
                            pInputText 
                            id="phone" 
                            [(ngModel)]="formData.phone" 
                            name="phone" 
                            #phone="ngModel"
                            type="tel"
                            pattern="^[0-9+]+$"
                            class="w-full"
                            [class.ng-invalid]="phone.invalid && phone.touched"
                            required />
                        <small *ngIf="phone.invalid && phone.touched" class="text-red-500">
                            <span *ngIf="phone.errors?.['required']">Phone is required.</span>
                            <span *ngIf="phone.errors?.['pattern']">Phone can only contain numbers and +.</span>
                        </small>
                    </div>
                    <div class="field">
                        <label for="email" class="block font-bold mb-2">Email:</label>
                        <input 
                            pInputText 
                            id="email" 
                            [(ngModel)]="formData.email" 
                            name="email" 
                            #email="ngModel"
                            type="email"
                            pattern="[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"
                            class="w-full"
                            [class.ng-invalid]="email.invalid && email.touched"
                            required />
                        <small *ngIf="email.invalid && email.touched" class="text-red-500">
                            <span *ngIf="email.errors?.['required']">Email is required.</span>
                            <span *ngIf="email.errors?.['pattern']">Please enter a valid email address.</span>
                        </small>
                    </div>
                </div>

                <!-- Row 4: School/Company -->
                <div class="field mb-4">
                    <label for="schoolCompany" class="block font-bold mb-2">School/Company:</label>
                    <input 
                        pInputText 
                        id="schoolCompany" 
                        [(ngModel)]="formData.schoolCompany" 
                        name="schoolCompany" 
                        #schoolCompany="ngModel"
                        class="w-full"
                        [class.ng-invalid]="schoolCompany.invalid && schoolCompany.touched"
                        required />
                    <small *ngIf="schoolCompany.invalid && schoolCompany.touched" class="text-red-500">
                        <span *ngIf="schoolCompany.errors?.['required']">School/Company is required.</span>
                    </small>
                </div>

                <!-- Statement -->
                <div class="field mb-4">
                    <label for="statement" class="block font-bold mb-2">
                        Statement: <span class="font-normal">(Please explain why you would like to be a member of FLOSSK)</span>
                    </label>
                    <textarea 
                        pInputTextarea 
                        id="statement" 
                        [(ngModel)]="formData.statement" 
                        name="statement" 
                        #statement="ngModel"
                        rows="5"
                        class="w-full"
                        [class.ng-invalid]="statement.invalid && statement.touched"
                        required></textarea>
                    <small *ngIf="statement.invalid && statement.touched" class="text-red-500">
                        <span *ngIf="statement.errors?.['required']">Statement is required.</span>
                    </small>
                </div>

                <!-- Signatures Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <!-- Applicant Signature -->
                        <div class="field mb-4">
                            <label for="applicantSignature" class="block font-bold mb-2">Applicant Signature:</label>
                            <input 
                                pInputText 
                                id="applicantSignature" 
                                [(ngModel)]="formData.applicantSignature" 
                                name="applicantSignature" 
                                class="w-full"
                                required />
                        </div>

                        <!-- Parent/Guardian -->
                        <div class="field mb-4">
                            <label for="parentGuardian" class="block font-bold mb-2">
                                Parent/Guardian <span class="font-normal">(If under 14 y/o)</span>
                            </label>
                            <input 
                                pInputText 
                                id="parentGuardian" 
                                [(ngModel)]="formData.parentGuardian" 
                                name="parentGuardian" 
                                class="w-full" />
                        </div>

                    </div>

                    <!-- Date (Applicant) -->
                        <div class="field">
                            <label for="applicantDate" class="block font-bold mb-2">Date of Birth:</label>
                            <p-datepicker
                                [(ngModel)]="formData.applicantDateofBirth" 
                                [iconDisplay]="'input'" 
                                [showIcon]="true" 
                                id="applicantDate"
                                inputId="icondisplay" 
                                name="applicantDate" 
                                #applicantDate="ngModel"
                                dateFormat="dd.mm.yy"
                                fluid
                                required
                            />
                            <small *ngIf="applicantDate.invalid && applicantDate.touched" class="text-red-500">
                                <span *ngIf="applicantDate.errors?.['required']">Date of Birth is required.</span>
                            </small>
                        </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-center mt-6">
                    <button 
                        pButton 
                        type="submit" 
                        label="Submit Application" 
                        icon="pi pi-check"
                        [disabled]="!applicationForm.valid"
                        class="p-button-lg"></button>
                </div>
            </form>
        </div>
    </div>`
})
export class MembershipApplicationForm {
    formData = {
        fullName: '',
        address: '',
        city: '',
        personalId: '',
        phone: '',
        email: '',
        schoolCompany: '',
        statement: '',
        applicantSignature: '',
        parentGuardian: '',
        applicantDateofBirth: '',
        boardMember: '',
    };

    onSubmit() {
        console.log('Form submitted:', this.formData);
        // Add your form submission logic here
    }
}
