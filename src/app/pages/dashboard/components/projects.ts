import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabsModule } from 'primeng/tabs';
import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService } from 'primeng/api';

interface Member {
    name: string;
    avatar: string;
    role: string;
}

interface Objective {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    assignedTo: Member;
    progress: number;
}

interface Project {
    id: number;
    name: string;
    description: string;
    status: 'upcoming' | 'in-progress' | 'completed';
    startDate: string;
    endDate: string;
    progress: number;
    participants: Member[];
    objectives: Objective[];
}

@Component({
    selector: 'app-projects',
    imports: [CommonModule, FormsModule, ButtonModule, TagModule, AvatarModule, AvatarGroupModule, DividerModule, ProgressBarModule, TabsModule, DragDropModule, DialogModule, InputTextModule, TextareaModule, SelectModule, DatePickerModule, ConfirmDialogModule, MultiSelectModule],
    providers: [ConfirmationService],
    template: `
        <p-confirmdialog></p-confirmdialog>
        
        <p-dialog [(visible)]="dialogVisible" [header]="dialogMode === 'add' ? 'New Project' : 'Edit Project'" [modal]="true" [style]="{width: '50rem'}" [contentStyle]="{'max-height': '70vh', 'overflow': 'visible'}" appendTo="body" [maximizable]="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="projectName" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Project Name</label>
                    <input pInputText id="projectName" [(ngModel)]="currentProject.name" class="w-full" />
                </div>
                
                <div>
                    <label for="description" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Description</label>
                    <textarea pInputTextarea id="description" [(ngModel)]="currentProject.description" [rows]="4" class="w-full"></textarea>
                </div>
                
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="startDate" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Start Date</label>
                        <p-datepicker id="startDate" [(ngModel)]="startDate" dateFormat="M d, yy" [showIcon]="true" class="w-full" />
                    </div>
                    
                    <div class="col-span-6">
                        <label for="endDate" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">End Date</label>
                        <p-datepicker id="endDate" [(ngModel)]="endDate" dateFormat="M d, yy" [showIcon]="true" class="w-full" />
                    </div>
                </div>
                
                <div>
                    <label for="teamMembers" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Team Members</label>
                    <p-multiselect 
                        id="teamMembers" 
                        [(ngModel)]="selectedMemberNames" 
                        [options]="availableMembers" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select Team Members" 
                        class="w-full"
                        [showClear]="true"
                        display="chip"
                    />
                </div>
                
                <div *ngIf="dialogMode === 'edit'">
                    <label for="status" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Status</label>
                    <p-select id="status" [(ngModel)]="currentProject.status" [options]="statusOptions" placeholder="Select Status" class="w-full" />
                </div>
                
                <div *ngIf="dialogMode === 'edit' && currentProject.status === 'in-progress'">
                    <label for="progress" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Progress (%)</label>
                    <input pInputText id="progress" [(ngModel)]="currentProject.progress" type="number" min="0" max="100" class="w-full" />
                </div>
            </div>
            
            <div class="flex justify-end gap-2 mt-6">
                <p-button label="Cancel" severity="secondary" (onClick)="dialogVisible = false" />
                <p-button [label]="dialogMode === 'add' ? 'Create' : 'Save'" (onClick)="saveProject()" />
            </div>
        </p-dialog>
        
        <p-dialog [(visible)]="objectiveDialogVisible" [header]="objectiveDialogMode === 'add' ? 'New Objective' : 'Edit Objective'" [modal]="true" [style]="{width: '40rem'}" [contentStyle]="{'max-height': '70vh', 'overflow': 'visible'}" appendTo="body" [maximizable]="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="objectiveTitle" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Title</label>
                    <input pInputText id="objectiveTitle" [(ngModel)]="currentObjective.title" class="w-full" />
                </div>
                
                <div>
                    <label for="objectiveDescription" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Description</label>
                    <textarea pInputTextarea id="objectiveDescription" [(ngModel)]="currentObjective.description" [rows]="3" class="w-full"></textarea>
                </div>
                
                <div>
                    <label for="objectiveStatus" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Status</label>
                    <p-select id="objectiveStatus" [(ngModel)]="currentObjective.status" [options]="objectiveStatusOptions" placeholder="Select Status" class="w-full" />
                </div>
                
                <div>
                    <label for="objectiveProgress" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Progress (%)</label>
                    <input pInputText id="objectiveProgress" [(ngModel)]="currentObjective.progress" type="number" min="0" max="100" class="w-full" />
                </div>
            </div>
            
            <div class="flex justify-end gap-2 mt-6">
                <p-button label="Cancel" severity="secondary" (onClick)="objectiveDialogVisible = false" />
                <p-button [label]="objectiveDialogMode === 'add' ? 'Create' : 'Save'" (onClick)="saveObjective()" />
            </div>
        </p-dialog>
        
        <div class="card">
            <div class="flex justify-end items-center mb-6">
                <p-button label="New Project" icon="pi pi-plus" size="small" (onClick)="openAddDialog()"></p-button>
            </div>

            <!-- Kanban-style Board -->
            <div class="grid grid-cols-12 gap-4">
                <!-- Upcoming Column -->
                <div class="col-span-12 md:col-span-4">
                    <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4" pDroppable="projects" (onDrop)="onDrop($event, 'upcoming')">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-lg m-0">Upcoming</h3>
                            <p-tag [value]="getProjectsByStatus('upcoming').length.toString()" severity="warn"></p-tag>
                        </div>
                        <div class="flex flex-col gap-3 min-h-32">
                            <div *ngFor="let project of getProjectsByStatus('upcoming')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                        {{ project.name }}
                                    </h4>
                                    <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" severity="secondary" (onClick)="openEditDialog(project); $event.stopPropagation()" />
                                    <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="danger" (onClick)="confirmDeleteProject(project)" />
                                </div>

                                <p class="text-surface-700 dark:text-surface-300 text-sm mb-3 line-clamp-2">
                                    {{ project.description }}
                                </p>

                                <div class="flex items-center gap-2 text-xs text-muted-color mb-3">
                                    <i class="pi pi-calendar"></i>
                                    <span>Starts {{ project.startDate }}</span>
                                </div>

                                <p-divider></p-divider>

                                <div class="mt-3">
                                    <p class="text-xs text-muted-color mb-2">Team</p>
                                    <p-avatargroup>
                                        <p-avatar 
                                            *ngFor="let member of project.participants.slice(0, 3)" 
                                            [image]="member.avatar" 
                                            shape="circle"
                                            size="normal"
                                        ></p-avatar>
                                        <p-avatar 
                                            *ngIf="project.participants.length > 3"
                                            [label]="'+' + (project.participants.length - 3)" 
                                            shape="circle"
                                            size="normal"
                                            [style]="{'background-color': 'var(--primary-color)', 'color': 'var(--primary-color-text)'}"
                                        ></p-avatar>
                                    </p-avatargroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- In Progress Column -->
                <div class="col-span-12 md:col-span-4">
                    <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4" pDroppable="projects" (onDrop)="onDrop($event, 'in-progress')">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-lg m-0">In Progress</h3>
                            <p-tag [value]="getProjectsByStatus('in-progress').length.toString()" severity="info"></p-tag>
                        </div>
                        <div class="flex flex-col gap-3 min-h-32">
                            <div *ngFor="let project of getProjectsByStatus('in-progress')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                        {{ project.name }}
                                    </h4>
                                    <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" severity="secondary" (onClick)="openEditDialog(project); $event.stopPropagation()" />
                                    <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="danger" (onClick)="confirmDeleteProject(project)" />
                                </div>

                                <p class="text-surface-700 dark:text-surface-300 text-sm mb-3 line-clamp-2">
                                    {{ project.description }}
                                </p>

                                <div class="mb-3">
                                    <div class="flex justify-between text-xs mb-2">
                                        <span class="text-muted-color">Progress</span>
                                        <span class="font-semibold">{{ project.progress }}%</span>
                                    </div>
                                    <p-progressbar [value]="project.progress" [showValue]="false"></p-progressbar>
                                </div>

                                <p-divider></p-divider>

                                <div class="mt-3">
                                    <p class="text-xs text-muted-color mb-2">Team</p>
                                    <p-avatargroup>
                                        <p-avatar 
                                            *ngFor="let member of project.participants.slice(0, 3)" 
                                            [image]="member.avatar" 
                                            shape="circle"
                                            size="normal"
                                        ></p-avatar>
                                        <p-avatar 
                                            *ngIf="project.participants.length > 3"
                                            [label]="'+' + (project.participants.length - 3)" 
                                            shape="circle"
                                            size="normal"
                                            [style]="{'background-color': 'var(--primary-color)', 'color': 'var(--primary-color-text)'}"
                                        ></p-avatar>
                                    </p-avatargroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Completed Column -->
                <div class="col-span-12 md:col-span-4">
                    <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4" pDroppable="projects" (onDrop)="onDrop($event, 'completed')">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-lg m-0">Completed</h3>
                            <p-tag [value]="getProjectsByStatus('completed').length.toString()" severity="success"></p-tag>
                        </div>
                        <div class="flex flex-col gap-3 min-h-32">
                            <div *ngFor="let project of getProjectsByStatus('completed')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-center gap-2 flex-1">
                                        <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                            {{ project.name }}
                                        </h4>
                                        <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                    </div>
                                    <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" severity="secondary" (onClick)="openEditDialog(project); $event.stopPropagation()" />
                                    <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="danger" (onClick)="confirmDeleteProject(project)" />
                                </div>

                                <p class="text-surface-700 dark:text-surface-300 text-sm mb-3 line-clamp-2">
                                    {{ project.description }}
                                </p>

                                <div class="flex items-center gap-2 text-xs text-muted-color mb-3">
                                    <i class="pi pi-calendar"></i>
                                    <span>Completed {{ project.endDate }}</span>
                                </div>

                                <p-divider></p-divider>

                                <div class="mt-3">
                                    <p class="text-xs text-muted-color mb-2">Team</p>
                                    <p-avatargroup>
                                        <p-avatar 
                                            *ngFor="let member of project.participants.slice(0, 3)" 
                                            [image]="member.avatar" 
                                            shape="circle"
                                            size="normal"
                                        ></p-avatar>
                                        <p-avatar 
                                            *ngIf="project.participants.length > 3"
                                            [label]="'+' + (project.participants.length - 3)" 
                                            shape="circle"
                                            size="normal"
                                            [style]="{'background-color': 'var(--primary-color)', 'color': 'var(--primary-color-text)'}"
                                        ></p-avatar>
                                    </p-avatargroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Details Modal/Section -->
            <div *ngIf="selectedProject" class="mt-8 border-t border-surface pt-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ selectedProject.name }}</h2>
                    <div class="flex gap-2">
                        <p-button label="Edit" icon="pi pi-pencil" severity="secondary" [outlined]="true" (onClick)="openEditDialog(selectedProject)" />
                        <p-button label="Delete" icon="pi pi-trash" severity="danger" [outlined]="true" (onClick)="confirmDeleteProject(selectedProject)" />
                        <p-button icon="pi pi-times" [text]="true" [rounded]="true" (onClick)="selectedProject = null"></p-button>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-8">
                        <div class="mb-6">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold m-0">Objectives</h3>
                                <p-button label="Add Objective" icon="pi pi-plus" size="small" (onClick)="openAddObjectiveDialog()" />
                            </div>
                            <div class="flex flex-col gap-4">
                                <div *ngFor="let objective of selectedProject.objectives" class="border border-surface rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex-1">
                                            <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-2">{{ objective.title }}</h4>
                                            <p class="text-sm text-surface-700 dark:text-surface-300 mb-3">{{ objective.description }}</p>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <p-tag 
                                                [value]="objective.status" 
                                                [severity]="getObjectiveStatusSeverity(objective.status)"
                                            ></p-tag>
                                            <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" severity="secondary" (onClick)="openEditObjectiveDialog(objective)" />
                                            <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="danger" (onClick)="confirmDeleteObjective(objective)" />
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <p-avatar [image]="objective.assignedTo.avatar" shape="circle" size="normal"></p-avatar>
                                            <div>
                                                <p class="text-sm font-semibold m-0">{{ objective.assignedTo.name }}</p>
                                                <p class="text-xs text-muted-color m-0">{{ objective.assignedTo.role }}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm font-semibold">{{ objective.progress }}%</span>
                                            <div style="width: 100px;">
                                                <p-progressbar [value]="objective.progress" [showValue]="false"></p-progressbar>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                       
                            <h3 class="text-lg font-semibold mb-4">Team Members</h3>
                            <div class="flex flex-col gap-3">
                                <div *ngFor="let member of selectedProject.participants" class="flex items-center gap-3">
                                    <p-avatar [image]="member.avatar" shape="circle" size="large"></p-avatar>
                                    <div>
                                        <p class="font-semibold m-0">{{ member.name }}</p>
                                        <p class="text-sm text-muted-color m-0">{{ member.role }}</p>
                                    </div>
                                </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Projects {
    constructor(private confirmationService: ConfirmationService) {}
    
    selectedProject: Project | null = null;
    draggedProject: Project | null = null;
    dialogVisible = false;
    dialogMode: 'add' | 'edit' = 'add';
    currentProject: Project = this.getEmptyProject();
    startDate: Date | null = null;
    endDate: Date | null = null;
    
    objectiveDialogVisible = false;
    objectiveDialogMode: 'add' | 'edit' = 'add';
    currentObjective: Objective = this.getEmptyObjective();
    selectedMemberNames: string[] = [];
    
    availableMembers = [
        { label: 'Amy Elsner', value: 'Amy Elsner', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Project Lead' },
        { label: 'Bernardo Dominic', value: 'Bernardo Dominic', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png', role: 'Hardware Engineer' },
        { label: 'Anna Fali', value: 'Anna Fali', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', role: 'Software Developer' },
        { label: 'Asiya Javayant', value: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'UI/UX Designer' },
        { label: 'Elwin Sharvill', value: 'Elwin Sharvill', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', role: 'Lead Engineer' },
        { label: 'Ioni Bowcher', value: 'Ioni Bowcher', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', role: 'Technician' }
    ];
    
    statusOptions = [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' }
    ];
    
    objectiveStatusOptions = [
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' }
    ];

    projects: Project[] = [
        {
            id: 1,
            name: 'Smart Home Automation System',
            description: 'Develop an IoT-based home automation system using Arduino and Raspberry Pi to control lights, temperature, and security.',
            status: 'in-progress',
            startDate: 'Nov 1, 2025',
            endDate: 'Feb 28, 2026',
            progress: 65,
            participants: [
                { name: 'Amy Elsner', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Project Lead' },
                { name: 'Bernardo Dominic', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png', role: 'Hardware Engineer' },
                { name: 'Anna Fali', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', role: 'Software Developer' },
                { name: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'UI/UX Designer' }
            ],
            objectives: [
                {
                    id: 1,
                    title: 'Circuit Design & Hardware Setup',
                    description: 'Design and assemble the circuit board with sensors and actuators',
                    status: 'completed',
                    assignedTo: { name: 'Bernardo Dominic', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png', role: 'Hardware Engineer' },
                    progress: 100
                },
                {
                    id: 2,
                    title: 'Backend API Development',
                    description: 'Create RESTful API for device control and monitoring',
                    status: 'in-progress',
                    assignedTo: { name: 'Anna Fali', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', role: 'Software Developer' },
                    progress: 70
                },
                {
                    id: 3,
                    title: 'Mobile App UI Design',
                    description: 'Design user-friendly mobile interface for system control',
                    status: 'in-progress',
                    assignedTo: { name: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'UI/UX Designer' },
                    progress: 50
                },
                {
                    id: 4,
                    title: 'System Integration & Testing',
                    description: 'Integrate all components and perform end-to-end testing',
                    status: 'todo',
                    assignedTo: { name: 'Amy Elsner', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Project Lead' },
                    progress: 0
                }
            ]
        },
        {
            id: 2,
            name: '3D Printer Upgrade Project',
            description: 'Upgrade existing 3D printers with auto-leveling sensors and improved cooling systems.',
            status: 'in-progress',
            startDate: 'Dec 1, 2025',
            endDate: 'Jan 15, 2026',
            progress: 40,
            participants: [
                { name: 'Elwin Sharvill', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', role: 'Lead Engineer' },
                { name: 'Ioni Bowcher', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', role: 'Technician' }
            ],
            objectives: [
                {
                    id: 1,
                    title: 'Install Auto-Leveling Sensors',
                    description: 'Add BLTouch sensors to all printers',
                    status: 'in-progress',
                    assignedTo: { name: 'Elwin Sharvill', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', role: 'Lead Engineer' },
                    progress: 60
                },
                {
                    id: 2,
                    title: 'Upgrade Cooling Systems',
                    description: 'Replace fans with high-performance cooling solution',
                    status: 'todo',
                    assignedTo: { name: 'Ioni Bowcher', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', role: 'Technician' },
                    progress: 20
                }
            ]
        },
        {
            id: 3,
            name: 'Community Website Redesign',
            description: 'Redesign the FLOSSK community website with modern UI and improved user experience.',
            status: 'upcoming',
            startDate: 'Jan 15, 2026',
            endDate: 'Mar 30, 2026',
            progress: 0,
            participants: [
                { name: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'Lead Designer' },
                { name: 'Anna Fali', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', role: 'Frontend Developer' }
            ],
            objectives: [
                {
                    id: 1,
                    title: 'Requirements Gathering',
                    description: 'Collect feedback and requirements from community members',
                    status: 'todo',
                    assignedTo: { name: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'Lead Designer' },
                    progress: 0
                },
                {
                    id: 2,
                    title: 'UI/UX Design',
                    description: 'Create wireframes and high-fidelity mockups',
                    status: 'completed',
                    assignedTo: { name: 'Asiya Javayant', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', role: 'Lead Designer' },
                    progress: 0
                }
            ]
        },
        {
            id: 4,
            name: 'Robotics Competition Team',
            description: 'Build and program a robot for the regional robotics competition in March 2026.',
            status: 'completed',
            startDate: 'Sep 1, 2025',
            endDate: 'Nov 30, 2025',
            progress: 100,
            participants: [
                { name: 'Bernardo Dominic', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png', role: 'Team Captain' },
                { name: 'Amy Elsner', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Programmer' },
                { name: 'Elwin Sharvill', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', role: 'Mechanical Engineer' }
            ],
            objectives: [
                {
                    id: 1,
                    title: 'Robot Design & Build',
                    description: 'Design and construct the robot chassis and mechanisms',
                    status: 'completed',
                    assignedTo: { name: 'Elwin Sharvill', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', role: 'Mechanical Engineer' },
                    progress: 100
                },
                {
                    id: 2,
                    title: 'Programming & Testing',
                    description: 'Write control software and test robot performance',
                    status: 'completed',
                    assignedTo: { name: 'Amy Elsner', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Programmer' },
                    progress: 100
                }
            ]
        }
    ];

    getProjectsByStatus(status: string): Project[] {
        return this.projects.filter(p => p.status === status);
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'secondary' {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'info';
            case 'upcoming': return 'warn';
            default: return 'secondary';
        }
    }

    getObjectiveStatusSeverity(status: string): 'success' | 'info' | 'secondary' {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'info';
            case 'todo': return 'secondary';
            default: return 'secondary';
        }
    }

    dragStart(project: Project) {
        this.draggedProject = project;
    }

    dragEnd() {
        this.draggedProject = null;
    }

    onDrop(event: any, newStatus: 'upcoming' | 'in-progress' | 'completed') {
        if (this.draggedProject) {
            // Update the project status
            const project = this.projects.find(p => p.id === this.draggedProject!.id);
            if (project && project.status !== newStatus) {
                project.status = newStatus;

                // Update progress based on status
                if (newStatus === 'upcoming') {
                    project.progress = 0;
                } else if (newStatus === 'completed') {
                    project.progress = 100;
                }
                // For 'in-progress', keep the current progress
            }
            this.draggedProject = null;
        }
    }
    
    getEmptyProject(): Project {
        return {
            id: 0,
            name: '',
            description: '',
            status: 'upcoming',
            startDate: '',
            endDate: '',
            progress: 0,
            participants: [],
            objectives: []
        };
    }
    
    formatDate(date: Date): string {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    openAddDialog() {
        this.dialogMode = 'add';
        this.currentProject = this.getEmptyProject();
        this.startDate = null;
        this.endDate = null;
        this.selectedMemberNames = [];
        this.dialogVisible = true;
    }
    
    openEditDialog(project: Project) {
        this.dialogMode = 'edit';
        this.currentProject = { ...project, participants: [...project.participants], objectives: [...project.objectives] };
        // Parse dates if they exist
        this.startDate = project.startDate ? new Date(project.startDate) : null;
        this.endDate = project.endDate ? new Date(project.endDate) : null;
        // Load current team member names
        this.selectedMemberNames = project.participants.map(p => p.name);
        this.dialogVisible = true;
    }
    
    saveProject() {
        // Format dates
        if (this.startDate) {
            this.currentProject.startDate = this.formatDate(this.startDate);
        }
        if (this.endDate) {
            this.currentProject.endDate = this.formatDate(this.endDate);
        }
        
        // Convert selected member names to participants
        this.currentProject.participants = this.selectedMemberNames.map(name => {
            const member = this.availableMembers.find(m => m.value === name);
            return {
                name: member!.value,
                avatar: member!.avatar,
                role: member!.role
            };
        });
        
        if (this.dialogMode === 'add') {
            // Generate new ID
            const maxId = this.projects.length > 0 
                ? Math.max(...this.projects.map(p => p.id)) 
                : 0;
            this.currentProject.id = maxId + 1;
            this.currentProject.status = 'upcoming';
            this.currentProject.progress = 0;
            this.currentProject.objectives = [];
            this.projects.push(this.currentProject);
        } else {
            // Update existing project
            const index = this.projects.findIndex(p => p.id === this.currentProject.id);
            if (index !== -1) {
                // Update progress based on status if status changed
                if (this.currentProject.status === 'upcoming') {
                    this.currentProject.progress = 0;
                } else if (this.currentProject.status === 'completed') {
                    this.currentProject.progress = 100;
                }
                this.projects[index] = this.currentProject;
            }
        }
        this.dialogVisible = false;
    }
    
    confirmDeleteProject(project: Project) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.deleteProject(project);
            }
        });
    }
    
    deleteProject(project: Project) {
        this.projects = this.projects.filter(p => p.id !== project.id);
        // Close details if the deleted project was selected
        if (this.selectedProject?.id === project.id) {
            this.selectedProject = null;
        }
    }
    
    getEmptyObjective(): Objective {
        return {
            id: 0,
            title: '',
            description: '',
            status: 'todo',
            assignedTo: { name: 'Unassigned', avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', role: 'Member' },
            progress: 0
        };
    }
    
    openAddObjectiveDialog() {
        if (!this.selectedProject) return;
        this.objectiveDialogMode = 'add';
        this.currentObjective = this.getEmptyObjective();
        this.objectiveDialogVisible = true;
    }
    
    openEditObjectiveDialog(objective: Objective) {
        this.objectiveDialogMode = 'edit';
        this.currentObjective = { ...objective, assignedTo: { ...objective.assignedTo } };
        this.objectiveDialogVisible = true;
    }
    
    saveObjective() {
        if (!this.selectedProject) return;
        
        if (this.objectiveDialogMode === 'add') {
            const maxId = this.selectedProject.objectives.length > 0
                ? Math.max(...this.selectedProject.objectives.map(o => o.id))
                : 0;
            this.currentObjective.id = maxId + 1;
            this.selectedProject.objectives.push(this.currentObjective);
        } else {
            const index = this.selectedProject.objectives.findIndex(o => o.id === this.currentObjective.id);
            if (index !== -1) {
                this.selectedProject.objectives[index] = this.currentObjective;
            }
        }
        
        // Update the project in the main projects array
        const projectIndex = this.projects.findIndex(p => p.id === this.selectedProject!.id);
        if (projectIndex !== -1) {
            this.projects[projectIndex] = this.selectedProject;
        }
        
        this.objectiveDialogVisible = false;
    }
    
    confirmDeleteObjective(objective: Objective) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${objective.title}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.deleteObjective(objective);
            }
        });
    }
    
    deleteObjective(objective: Objective) {
        if (!this.selectedProject) return;
        this.selectedProject.objectives = this.selectedProject.objectives.filter(o => o.id !== objective.id);
        
        // Update the project in the main projects array
        const projectIndex = this.projects.findIndex(p => p.id === this.selectedProject!.id);
        if (projectIndex !== -1) {
            this.projects[projectIndex] = this.selectedProject;
        }
    }
}
