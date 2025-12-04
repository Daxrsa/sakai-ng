import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, AvatarModule, ButtonModule, TagModule, ChipModule, BadgeModule, DividerModule, PanelModule],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Profile Header Card -->
            <div class="col-span-12">
                <div class="card">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <!-- Profile Picture and Status -->
                        <div class="flex flex-col items-center">
                            <!-- Custom Avatar -->
                            <div class="relative inline-block">
                                <img 
                                    [src]="userProfile.picture" 
                                    [alt]="userProfile.firstName + ' ' + userProfile.lastName"
                                    class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full border-4 border-surface-0 dark:border-surface-900 shadow-lg hover:scale-105 transition-transform duration-300"
                                >
                                <!-- Status Badge -->
                                <div class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4">
                                    <span 
                                        [class]="userProfile.status === 'Active' ? 'bg-green-500' : 'bg-red-500'"
                                        class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-4 border-surface-0 dark:border-surface-900 shadow-md"
                                    >
                                        <i [class]="userProfile.status === 'Active'" class="text-white text-base sm:text-lg md:text-xl"></i>
                                    </span>
                                </div>
                            </div>
                            <!-- Status Tag -->
                            <p-tag 
                                [value]="userProfile.status" 
                                [severity]="userProfile.status === 'Active' ? 'success' : 'danger'"
                                styleClass="mt-4"
                            ></p-tag>
                        </div>
                        
                        <!-- Profile Information -->
                        <div class="flex-1">
                            <div class="flex flex-col gap-6">
                                <div>
                                    <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                                        {{ userProfile.firstName }} {{ userProfile.lastName }}
                                    </h2>
                                    <p class="text-muted-color">{{ userProfile.email }}</p>
                                </div>
                                
                                <div class="flex flex-wrap gap-4">
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-calendar text-muted-color"></i>
                                        <span class="text-muted-color">Joined: </span>
                                        <span class="font-semibold">{{ userProfile.dateJoined }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-briefcase text-muted-color"></i>
                                        <span class="text-muted-color">Role: </span>
                                        <span class="font-semibold">{{ userProfile.role }}</span>
                                    </div>
                                </div>
                                
                                <div class="flex gap-2">
                                    <p-button label="Edit" icon="pi pi-pencil" outlined></p-button>
                                    <p-button label="Settings" icon="pi pi-cog" severity="secondary" outlined></p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Cards Section -->
            <div class="col-span-12">
                <div class="grid grid-cols-12 gap-8">
                    <!-- Biography Card -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="card h-full">
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-user text-xl text-primary"></i>
                                <h3 class="text-xl font-semibold m-0">Biography</h3>
                            </div>
                            <p-divider></p-divider>
                            <p class="text-surface-700 dark:text-surface-300 leading-relaxed m-0">
                                {{ userProfile.biography }}
                            </p>
                        </div>
                    </div>

                    <!-- Contact Card -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="card h-full">
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-envelope text-xl text-primary"></i>
                                <h3 class="text-xl font-semibold m-0">Contact</h3>
                            </div>
                            <p-divider></p-divider>
                            
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-phone text-muted-color"></i>
                                    <span class="text-surface-900 dark:text-surface-0">+1 234 567 8900</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-map-marker text-muted-color"></i>
                                    <span class="text-surface-900 dark:text-surface-0">San Francisco, CA</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-globe text-muted-color"></i>
                                    <span class="text-surface-900 dark:text-surface-0">www.example.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Skills Card -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="card h-full">
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-star text-xl text-primary"></i>
                                <h3 class="text-xl font-semibold m-0">Skills & Expertise</h3>
                            </div>
                            <p-divider></p-divider>
                            <div class="flex flex-wrap gap-2">
                                <p-chip 
                                    *ngFor="let skill of userProfile.skills" 
                                    [label]="skill"
                                    styleClass="bg-primary-100 dark:bg-primary-400/10 text-primary-700 dark:text-primary-400"
                                ></p-chip>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics Card -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="card h-full">
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-chart-bar text-xl text-primary"></i>
                                <h3 class="text-xl font-semibold m-0">Statistics</h3>
                            </div>
                            <p-divider></p-divider>
                            
                            <div class="flex flex-col gap-6">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="text-muted-color text-sm mb-1">Projects</div>
                                        <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">24</div>
                                    </div>
                                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 3rem; height: 3rem">
                                        <i class="pi pi-folder text-blue-500 text-xl"></i>
                                    </div>
                                </div>

                                <p-divider></p-divider>

                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="text-muted-color text-sm mb-1">Contributions</div>
                                        <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">156</div>
                                    </div>
                                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 3rem; height: 3rem">
                                        <i class="pi pi-code text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Profile {
    userProfile = {
        picture: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        firstName: 'Amy',
        lastName: 'Elsner',
        email: 'amy.elsner@flossk.com',
        dateJoined: 'January 15, 2023',
        status: 'Inactive',
        activity: 'Online',
        role: 'Board Member',
        biography: 'Passionate software engineer with over 8 years of experience in full-stack development. Specialized in Angular, TypeScript, and cloud technologies. Love contributing to open-source projects and mentoring junior developers. Always eager to learn new technologies and improve code quality.',
        skills: ['Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'Git', 'CI/CD', 'Agile']
    };
}
