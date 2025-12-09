import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsWidget } from './components/statswidget';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ChartDemo } from "../uikit/chartdemo";

interface JoinRequest {
    id: number;
    firstName: string;
    lastName: string;
    personalNumber: string;
    email: string;
    phone: string;
    motivation: string;
    submittedDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, StatsWidget, TableModule, ButtonModule, TagModule, DialogModule, DividerModule, ChartDemo],
    template: `   
        <div class="grid grid-cols-12 gap-8">   
            <app-stats-widget class="contents" />      
            <!-- Join Requests Section -->
            <div class="col-span-12">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 m-0 mb-2">Membership Requests</h2>
                            <p class="text-muted-color text-sm m-0">Review and approve new member applications</p>
                        </div>
                        <p-tag [value]="getPendingCount() + ' Pending'" severity="warn"></p-tag>
                    </div>
                    
                    <p-table [value]="joinRequests" [paginator]="true" [rows]="10" [tableStyle]="{ 'min-width': '60rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Name</th>
                                <th>Personal Number</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-request>
                            <tr>
                                <td>
                                    <div class="font-semibold">{{ request.firstName }} {{ request.lastName }}</div>
                                </td>
                                <td>{{ request.personalNumber }}</td>
                                <td>{{ request.email }}</td>
                                <td>{{ request.phone }}</td>
                                <td>{{ request.submittedDate }}</td>
                                <td>
                                    <p-tag 
                                        [value]="request.status" 
                                        [severity]="getStatusSeverity(request.status)"
                                    ></p-tag>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button 
                                            icon="pi pi-eye" 
                                            [text]="true" 
                                            [rounded]="true"
                                            severity="secondary"
                                            (onClick)="viewRequest(request)"
                                        ></p-button>
                                        <p-button 
                                            *ngIf="request.status === 'pending'"
                                            icon="pi pi-check" 
                                            [text]="true" 
                                            [rounded]="true"
                                            severity="success"
                                            (onClick)="approveRequest(request)"
                                        ></p-button>
                                        <p-button 
                                            *ngIf="request.status === 'pending'"
                                            icon="pi pi-times" 
                                            [text]="true" 
                                            [rounded]="true"
                                            severity="danger"
                                            (onClick)="rejectRequest(request)"
                                        ></p-button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
        
        <!-- View Request Dialog -->
        <p-dialog [(visible)]="viewDialogVisible" [header]="selectedRequest ? selectedRequest.firstName + ' ' + selectedRequest.lastName : 'Request Details'" [modal]="true" [style]="{width: '50rem'}" appendTo="body">
            <div *ngIf="selectedRequest" class="flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label class="block text-muted-color text-sm mb-1">First Name</label>
                        <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.firstName }}</div>
                    </div>
                    
                    <div class="col-span-6">
                        <label class="block text-muted-color text-sm mb-1">Last Name</label>
                        <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.lastName }}</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label class="block text-muted-color text-sm mb-1">Personal Number</label>
                        <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.personalNumber }}</div>
                    </div>
                    
                    <div class="col-span-6">
                        <label class="block text-muted-color text-sm mb-1">Status</label>
                        <p-tag 
                            [value]="selectedRequest.status" 
                            [severity]="getStatusSeverity(selectedRequest.status)"
                        ></p-tag>
                    </div>
                </div>
                
                <div>
                    <label class="block text-muted-color text-sm mb-1">Email</label>
                    <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.email }}</div>
                </div>
                
                <div>
                    <label class="block text-muted-color text-sm mb-1">Phone Number</label>
                    <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.phone }}</div>
                </div>
                
                <div>
                    <label class="block text-muted-color text-sm mb-1">Submitted Date</label>
                    <div class="font-semibold text-surface-900 dark:text-surface-0">{{ selectedRequest.submittedDate }}</div>
                </div>
                
                <p-divider></p-divider>
                
                <div>
                    <label class="block text-muted-color text-sm mb-2">Motivation</label>
                    <div class="text-surface-700 dark:text-surface-300 leading-relaxed p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        {{ selectedRequest.motivation }}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end gap-2 mt-6">
                <p-button label="Close" severity="secondary" (onClick)="viewDialogVisible = false" />
                <p-button 
                    *ngIf="selectedRequest?.status === 'pending'"
                    label="Reject" 
                    severity="danger" 
                    icon="pi pi-times"
                    (onClick)="selectedRequest && rejectRequest(selectedRequest); viewDialogVisible = false" 
                />
                <p-button 
                    *ngIf="selectedRequest?.status === 'pending'"
                    label="Approve" 
                    severity="success" 
                    icon="pi pi-check"
                    (onClick)="selectedRequest && approveRequest(selectedRequest); viewDialogVisible = false" 
                />
            </div>
        </p-dialog>
        <div class="card">
            <app-chart-demo />
        </div>
    `
})
export class Dashboard {
    viewDialogVisible = false;
    selectedRequest: JoinRequest | null = null;
    
    joinRequests: JoinRequest[] = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            personalNumber: '123456789',
            email: 'john.doe@email.com',
            phone: '+383 44 123 456',
            motivation: 'I am deeply passionate about technology and open-source software. I have been following FLOSSK for the past year and am impressed by the community\'s dedication to promoting free software in Kosovo. I would love to contribute my programming skills and help organize workshops for students. I believe in the power of community-driven development and want to be part of this movement.',
            submittedDate: 'Dec 5, 2025',
            status: 'pending'
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            personalNumber: '987654321',
            email: 'jane.smith@email.com',
            phone: '+383 45 234 567',
            motivation: 'As a computer science student at University of Prishtina, I am eager to gain practical experience in software development and contribute to meaningful projects. FLOSSK represents everything I believe in - collaboration, knowledge sharing, and building technology that serves the community. I have experience with Python and web development, and I am excited to learn from experienced members while contributing to ongoing projects.',
            submittedDate: 'Dec 6, 2025',
            status: 'pending'
        },
        {
            id: 3,
            firstName: 'Alex',
            lastName: 'Johnson',
            personalNumber: '456789123',
            email: 'alex.johnson@email.com',
            phone: '+383 49 345 678',
            motivation: 'I am a hardware enthusiast and maker who loves building IoT devices and working with Arduino and Raspberry Pi. I have heard great things about FLOSSK\'s makerspace and would love to access the equipment while also sharing my knowledge with other members. I am particularly interested in teaching workshops on electronics and 3D printing. I believe FLOSSK is the perfect place to collaborate on innovative hardware projects.',
            submittedDate: 'Dec 4, 2025',
            status: 'approved'
        },
        {
            id: 4,
            firstName: 'Maria',
            lastName: 'Garcia',
            personalNumber: '789123456',
            email: 'maria.garcia@email.com',
            phone: '+383 48 456 789',
            motivation: 'I am a graphic designer interested in contributing to open-source design projects. I have experience with GIMP, Inkscape, and Blender, and I want to help create visual materials for FLOSSK events and campaigns. I am also passionate about teaching others about open-source design tools and would love to organize design workshops for the community.',
            submittedDate: 'Dec 3, 2025',
            status: 'rejected'
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Brown',
            personalNumber: '321654987',
            email: 'david.brown@email.com',
            phone: '+383 44 567 890',
            motivation: 'As a recent graduate in electrical engineering, I am looking for opportunities to apply my skills in real-world projects. FLOSSK\'s focus on open hardware and collaborative development aligns perfectly with my values. I have worked on several robotics projects during my studies and would love to contribute to FLOSSK\'s robotics initiatives. I am also interested in mentoring younger students who are new to electronics and programming.',
            submittedDate: 'Dec 7, 2025',
            status: 'pending'
        }
    ];
    
    getPendingCount(): number {
        return this.joinRequests.filter(r => r.status === 'pending').length;
    }
    
    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
        switch(status) {
            case 'approved': return 'success';
            case 'pending': return 'warn';
            case 'rejected': return 'danger';
            default: return 'warn';
        }
    }
    
    viewRequest(request: JoinRequest) {
        this.selectedRequest = request;
        this.viewDialogVisible = true;
    }
    
    approveRequest(request: JoinRequest) {
        request.status = 'approved';
    }
    
    rejectRequest(request: JoinRequest) {
        request.status = 'rejected';
    }
}
