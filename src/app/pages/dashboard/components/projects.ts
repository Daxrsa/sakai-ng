import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabsModule } from 'primeng/tabs';
import { DragDropModule } from 'primeng/dragdrop';

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
    imports: [CommonModule, ButtonModule, TagModule, AvatarModule, AvatarGroupModule, DividerModule, ProgressBarModule, TabsModule, DragDropModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">Projects Board</div>
                <p-button label="New Project" icon="pi pi-plus" size="small"></p-button>
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
                            <div *ngFor="let project of getProjectsByStatus('upcoming')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-move" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                        {{ project.name }}
                                    </h4>
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
                            <div *ngFor="let project of getProjectsByStatus('in-progress')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-move" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                        {{ project.name }}
                                    </h4>
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
                            <div *ngFor="let project of getProjectsByStatus('completed')" pDraggable="projects" (onDragStart)="dragStart(project)" (onDragEnd)="dragEnd()" class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg p-4 hover:shadow-lg transition-shadow cursor-move" (click)="selectedProject = project">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">
                                        {{ project.name }}
                                    </h4>
                                    <i class="pi pi-check-circle text-green-500 text-xl"></i>
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
                    <p-button icon="pi pi-times" [text]="true" [rounded]="true" (onClick)="selectedProject = null"></p-button>
                </div>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-8">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-4">Objectives</h3>
                            <div class="flex flex-col gap-4">
                                <div *ngFor="let objective of selectedProject.objectives" class="border border-surface rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex-1">
                                            <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-2">{{ objective.title }}</h4>
                                            <p class="text-sm text-surface-700 dark:text-surface-300 mb-3">{{ objective.description }}</p>
                                        </div>
                                        <p-tag 
                                            [value]="objective.status" 
                                            [severity]="getObjectiveStatusSeverity(objective.status)"
                                        ></p-tag>
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
    selectedProject: Project | null = null;
    draggedProject: Project | null = null;

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
}
