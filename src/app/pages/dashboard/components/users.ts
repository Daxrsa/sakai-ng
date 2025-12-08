import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
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
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, AvatarModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule],
    providers: [ConfirmationService],
    template: `
    <p-confirmdialog></p-confirmdialog>
    
    <p-dialog [(visible)]="editDialogVisible" [header]="'Edit User'" [modal]="true" [style]="{width: '450px'}" [contentStyle]="{'max-height': '70vh', 'overflow': 'visible'}" appendTo="body" [maximizable]="true">
        <div class="flex flex-col gap-4" *ngIf="selectedUser">
            <div class="flex flex-col gap-2">
                <label for="name">Name</label>
                <input pInputText id="name" [(ngModel)]="selectedUser.name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <input pInputText id="email" type="email" [(ngModel)]="selectedUser.email" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="role">Role</label>
                <p-select id="role" [(ngModel)]="selectedUser.role" [options]="roleOptions" placeholder="Select a Role" styleClass="w-full"></p-select>
            </div>
            <div class="flex flex-col gap-2">
                <label for="rfid">RFID</label>
                <p-select id="rfid" [(ngModel)]="selectedUser.rfid" [options]="rfidOptions" placeholder="RFID Status" styleClass="w-full"></p-select>
            </div>
            <div class="flex flex-col gap-2">
                <label for="joinDate">Join Date</label>
                <input pInputText id="joinDate" type="date" [(ngModel)]="selectedUser.joinDate" />
            </div>
        </div>
        <ng-template #footer>
            <p-button label="Cancel" severity="secondary" (onClick)="editDialogVisible = false" />
            <p-button label="Save" (onClick)="saveUser()" />
        </ng-template>
    </p-dialog>
    
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
                    <th>Actions</th>
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
                        <p-tag 
                            [value]="user.rfid" 
                            [severity]="user.rfid === 'Yes' ? 'success' : 'danger'"
                        ></p-tag>
                    </td>
                    <td>{{ user.joinDate }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" [text]="true" severity="warn" styleClass="mr-2" (onClick)="editUser(user)"></p-button>
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="confirmDelete(user)"></p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
    `
})
export class Users {
    editDialogVisible = false;
    selectedUser: User | null = null;
    
    roleOptions = [
        { label: 'Member', value: 'Member' },
        { label: 'Board Member', value: 'Board Member' },
    ];
    
    rfidOptions = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    constructor(private confirmationService: ConfirmationService) {}

    editUser(user: User) {
        this.selectedUser = { ...user };
        this.editDialogVisible = true;
    }

    saveUser() {
        if (this.selectedUser) {
            const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
            if (index !== -1) {
                this.users[index] = { ...this.selectedUser };
            }
            this.editDialogVisible = false;
            this.selectedUser = null;
        }
    }

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
