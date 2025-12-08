import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    joinDate: string;
    avatar: string;
    rfid: string;
}

@Component({
    selector: 'app-users',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, AvatarModule, ConfirmDialogModule, CheckboxModule],
    providers: [ConfirmationService],
    template: `
    <p-confirmdialog></p-confirmdialog>
    
    <div class="card">
        <div class="font-semibold text-xl mb-4">Users</div>
        
        <p-table [value]="users" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="10" [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
            <ng-template #header>
                <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>RFID</th>
                    <th>Join Date</th>
                    <th></th>
                </tr>
            </ng-template>
            <ng-template #body let-user>
                <tr>
                    <td>
                        <p-avatar [image]="user.avatar" shape="circle"></p-avatar>
                    </td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                        <div class="flex align-items-center gap-3">
                            <div class="flex align-items-center gap-2">
                                <p-checkbox 
                                    [(ngModel)]="user.rfid" 
                                    [binary]="true" 
                                    inputId="yes-{{user.id}}"
                                    [trueValue]="'Yes'"
                                    [falseValue]="'No'"
                                />
                                <label [for]="'yes-' + user.id">Yes</label>
                            </div>
                            <div class="flex align-items-center gap-2">
                                <p-checkbox 
                                    [(ngModel)]="user.rfid" 
                                    [binary]="true" 
                                    inputId="no-{{user.id}}"
                                    [trueValue]="'No'"
                                    [falseValue]="'Yes'"
                                />
                                <label [for]="'no-' + user.id">No</label>
                            </div>
                        </div>
                    </td>
                    <td>{{ user.joinDate }}</td>
                    <td>
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="confirmDelete(user)"></p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
    `
})
export class Users {
    constructor(private confirmationService: ConfirmationService) {}

    confirmDelete(user: User) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${user.name}?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.deleteUser(user);
            }
        });
    }

    deleteUser(user: User) {
        this.users = this.users.filter(u => u.id !== user.id);
    }

    users: User[] = [
        {
            id: 1,
            name: 'Amy Elsner',
            email: 'amy.elsner@flossk.com',
            role: 'Member',
            rfid: 'Yes',
            joinDate: '2023-01-15',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
        },
        {
            id: 2,
            name: 'Anna Fali',
            email: 'anna.fali@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-03-22',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png'
        },
        {
            id: 3,
            name: 'Asiya Javayant',
            email: 'asiya.javayant@flossk.com',
            role: 'Member',
            rfid: 'Yes',
            joinDate: '2023-05-10',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png'
        },
        {
            id: 4,
            name: 'Bernardo Dominic',
            email: 'bernardo.dominic@flossk.com',
            role: 'Board Member',
            rfid: 'Yes',
            joinDate: '2023-07-08',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png'
        },
        {
            id: 5,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png'
        },
        {
            id: 6,
            name: 'Bernardo Dominic',
            email: 'bernardo.dominic@flossk.com',
            role: 'Board Member',
            rfid: 'Yes',
            joinDate: '2023-07-08',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png'
        },
        {
            id: 7,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png'
        },
        {
            id: 8,
            name: 'Bernardo Dominic',
            email: 'bernardo.dominic@flossk.com',
            role: 'Board Member',
            rfid: 'Yes',
            joinDate: '2023-07-08',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png'
        },
        {
            id: 9,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png'
        },
        {
            id: 10,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png'
        },
        {
            id: 11,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Board Member',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png'
        }
    ];
}
