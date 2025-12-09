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
    contributions?: number;
    projectsCompleted?: number;
    eventsAttended?: number;
}

@Component({
    selector: 'app-users',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, AvatarModule, ConfirmDialogModule, CheckboxModule],
    providers: [ConfirmationService],
    template: `
    <p-confirmdialog></p-confirmdialog>
    
    <div class="grid grid-cols-12 gap-4 mb-4">
        <!-- Top Contributors Leaderboard -->
        <div class="col-span-12 lg:col-span-4">
            <div class="card">
                <div class="font-semibold text-xl mb-4">🏆 Top Contributors</div>
                <div class="flex flex-col gap-3">
                    <div *ngFor="let contributor of topContributors; let i = index" class="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white" 
                             [ngClass]="{
                                'bg-yellow-500': i === 0,
                                'bg-gray-400': i === 1,
                                'bg-orange-600': i === 2,
                                'bg-blue-500': i > 2
                             }">
                            {{ i + 1 }}
                        </div>
                        <p-avatar [image]="contributor.avatar" shape="circle" size="large"></p-avatar>
                        <div class="flex-1">
                            <div class="font-semibold">{{ contributor.name }}</div>
                            <div class="text-sm text-muted-color">{{ contributor.role }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-primary">{{ contributor.contributions }}</div>
                            <div class="text-xs text-muted-color">contributions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Contribution Breakdown -->
        <div class="col-span-12 lg:col-span-8">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Contribution Stats</div>
                <div class="grid grid-cols-12 gap-4">
                    <div *ngFor="let contributor of topContributors.slice(0, 3)" class="col-span-12 sm:col-span-4">
                        <div class="p-4 border border-surface rounded-lg">
                            <div class="flex items-center gap-3 mb-3">
                                <p-avatar [image]="contributor.avatar" shape="circle"></p-avatar>
                                <div class="font-semibold">{{ contributor.name }}</div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div class="text-muted-color">Projects</div>
                                    <div class="font-bold text-lg">{{ contributor.projectsCompleted }}</div>
                                </div>
                                <div>
                                    <div class="text-muted-color">Events</div>
                                    <div class="font-bold text-lg">{{ contributor.eventsAttended }}</div>
                                </div>
                                <div class="col-span-2">
                                    <div class="text-muted-color">Total Contributions</div>
                                    <div class="font-bold text-xl text-primary">{{ contributor.contributions }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card">
        <div class="font-semibold text-xl mb-4">All Users</div>
        
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
    topContributors: User[] = [];
    
    constructor(private confirmationService: ConfirmationService) {
        this.calculateTopContributors();
    }
    
    calculateTopContributors() {
        this.topContributors = [...this.users]
            .filter(u => u.contributions && u.contributions > 0)
            .sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
            .slice(0, 5);
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
            role: 'Project Lead',
            rfid: 'Yes',
            joinDate: '2023-01-15',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
            contributions: 127,
            projectsCompleted: 15,
            eventsAttended: 22
        },
        {
            id: 2,
            name: 'Anna Fali',
            email: 'anna.fali@flossk.com',
            role: 'Software Developer',
            rfid: 'No',
            joinDate: '2023-03-22',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
            contributions: 98,
            projectsCompleted: 12,
            eventsAttended: 18
        },
        {
            id: 3,
            name: 'Asiya Javayant',
            email: 'asiya.javayant@flossk.com',
            role: 'UI/UX Designer',
            rfid: 'Yes',
            joinDate: '2023-05-10',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
            contributions: 85,
            projectsCompleted: 10,
            eventsAttended: 15
        },
        {
            id: 4,
            name: 'Bernardo Dominic',
            email: 'bernardo.dominic@flossk.com',
            role: 'Hardware Engineer',
            rfid: 'Yes',
            joinDate: '2023-07-08',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png',
            contributions: 73,
            projectsCompleted: 9,
            eventsAttended: 13
        },
        {
            id: 5,
            name: 'Elwin Sharvill',
            email: 'elwin.sharvill@flossk.com',
            role: 'Lead Engineer',
            rfid: 'No',
            joinDate: '2023-09-14',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png',
            contributions: 64,
            projectsCompleted: 8,
            eventsAttended: 12
        },
        {
            id: 6,
            name: 'Ioni Bowcher',
            email: 'ioni.bowcher@flossk.com',
            role: 'Technician',
            rfid: 'Yes',
            joinDate: '2023-10-20',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
            contributions: 52,
            projectsCompleted: 7,
            eventsAttended: 10
        },
        {
            id: 7,
            name: 'Xuxue Feng',
            email: 'xuxue.feng@flossk.com',
            role: 'Member',
            rfid: 'No',
            joinDate: '2023-11-05',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png',
            contributions: 38,
            projectsCompleted: 5,
            eventsAttended: 8
        },
        {
            id: 8,
            name: 'Ivan Magalhaes',
            email: 'ivan.magalhaes@flossk.com',
            role: 'Member',
            rfid: 'Yes',
            joinDate: '2024-01-12',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ivanmagalhaes.png',
            contributions: 29,
            projectsCompleted: 4,
            eventsAttended: 6
        },
        {
            id: 9,
            name: 'Onyama Limba',
            email: 'onyama.limba@flossk.com',
            role: 'Member',
            rfid: 'No',
            joinDate: '2024-02-18',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
            contributions: 18,
            projectsCompleted: 3,
            eventsAttended: 4
        },
        {
            id: 10,
            name: 'Stephen Shaw',
            email: 'stephen.shaw@flossk.com',
            role: 'Member',
            rfid: 'Yes',
            joinDate: '2024-04-22',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png',
            contributions: 12,
            projectsCompleted: 2,
            eventsAttended: 3
        },
        {
            id: 11,
            name: 'Walter White',
            email: 'walter.white@flossk.com',
            role: 'Member',
            rfid: 'No',
            joinDate: '2024-06-10',
            avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/walterwhite.png',
            contributions: 5,
            projectsCompleted: 1,
            eventsAttended: 2
        }
    ];
}
