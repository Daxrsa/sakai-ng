import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputIcon } from "primeng/inputicon";
import { IconField } from "primeng/iconfield";

interface InventoryItem {
    id: number;
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    image?: string;
    rating?: number;
    location: string;
    lastUpdated: string;
}

@Component({
    selector: 'app-inventory',
    imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    InputIcon,
    IconField
],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast />
        <p-confirmDialog />
        
        <div class="card">
            <p-toolbar class="mb-6">
               
                     <ng-template #center>
                        <p-iconfield>
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText placeholder="Search" />
                        </p-iconfield>
                    </ng-template>
                <div class="flex justify-content-center">
                    <p-button 
                        label="New Item" 
                        icon="pi pi-plus" 
                        severity="success" 
                        class="mr-2"
                        (onClick)="openAddDialog()"
                    />
                    <p-button 
                        label="Export" 
                        icon="pi pi-upload" 
                        severity="help" 
                        (onClick)="exportData()"
                    />
                </div>
               
            </p-toolbar>

            <p-table 
                [value]="inventoryItems" 
                [paginator]="true" 
                [rows]="10"
                [rowsPerPageOptions]="[5, 10, 20]"
                [tableStyle]="{ 'min-width': '75rem' }"
                [globalFilterFields]="['name', 'category', 'location', 'status']"
                #dt
            >
                <ng-template #caption>
                    <div class="flex align-items-center justify-content-between">
                    
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>

                <ng-template #body let-item>
                    <tr>
                        <td>
                            <div class="flex align-items-center gap-2">
                                <img 
                                    *ngIf="item.image" 
                                    [src]="item.image" 
                                    [alt]="item.name" 
                                    width="50" 
                                    class="shadow-lg rounded"
                                />
                                <span class="font-semibold">{{ item.name }}</span>
                            </div>
                        </td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>
                            <p-tag 
                                [value]="getStatusLabel(item.status)" 
                                [severity]="getStatusSeverity(item.status)"
                            />
                        </td>
                        <td>{{ item.location }}</td>
                        <td>
                            <div class="flex gap-2">
                                <p-button 
                                    icon="pi pi-pencil" 
                                    [rounded]="true" 
                                    [text]="true" 
                                    severity="secondary"
                                    (onClick)="openEditDialog(item)"
                                />
                                <p-button 
                                    icon="pi pi-trash" 
                                    [rounded]="true" 
                                    [text]="true" 
                                    severity="danger"
                                    (onClick)="confirmDelete(item)"
                                />
                            </div>
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8" class="text-center py-6">
                            <div class="flex flex-col items-center gap-3">
                                <i class="pi pi-inbox text-6xl text-muted-color"></i>
                                <p class="text-xl text-muted-color">No items found</p>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Add/Edit Dialog -->
        <p-dialog 
            [(visible)]="dialogVisible" 
            [header]="dialogMode === 'add' ? 'Add New Item' : 'Edit Item'"
            [modal]="true" 
            [style]="{ width: '50rem' }"
            [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
            [contentStyle]="{ 'max-height': '70vh', 'overflow-y': 'auto' }"
        >
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name" class="font-semibold">Name</label>
                    <input 
                        pInputText 
                        id="name" 
                        [(ngModel)]="currentItem.name" 
                        required 
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="description" class="font-semibold">Description</label>
                    <textarea 
                        pTextarea 
                        id="description" 
                        [(ngModel)]="currentItem.description" 
                        rows="3"
                        class="w-full"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="category" class="font-semibold">Category</label>
                        <p-select 
                            id="category"
                            [(ngModel)]="currentItem.category" 
                            [options]="categories"
                            placeholder="Select a category"
                            class="w-full"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="location" class="font-semibold">Location</label>
                        <input 
                            pInputText 
                            id="location" 
                            [(ngModel)]="currentItem.location" 
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="quantity" class="font-semibold">Quantity</label>
                        <p-inputNumber
                            id="quantity"
                            [(ngModel)]="currentItem.quantity"
                            [showButtons]="true"
                            [min]="0"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="status" class="font-semibold">Status</label>
                    <p-select 
                        id="status"
                        [(ngModel)]="currentItem.status" 
                        [options]="statusOptions"
                        placeholder="Select status"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="rating" class="font-semibold">Rating</label>
                    <!-- <p-rating [(ngModel)]="currentItem.rating" [cancel]="false" /> -->
                </div>

                <div class="flex flex-col gap-2">
                    <label for="image" class="font-semibold">Image URL</label>
                    <input 
                        pInputText 
                        id="image" 
                        [(ngModel)]="currentItem.image" 
                        placeholder="https://example.com/image.jpg"
                        class="w-full"
                    />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button 
                        label="Cancel" 
                        severity="secondary" 
                        (onClick)="dialogVisible = false"
                    />
                    <p-button 
                        [label]="dialogMode === 'add' ? 'Create' : 'Update'" 
                        (onClick)="saveItem()"
                    />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class Inventory {
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    dialogVisible = false;
    dialogMode: 'add' | 'edit' = 'add';
    currentItem: InventoryItem = this.getEmptyItem();

    categories = [
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Tools', value: 'Tools' },
        { label: 'Office Supplies', value: 'Office Supplies' },
        { label: 'Hardware', value: 'Hardware' },
        { label: 'Components', value: 'Components' }
    ];

    statusOptions = [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Low Stock', value: 'low-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' }
    ];

    inventoryItems: InventoryItem[] = [
        {
            id: 1,
            name: 'Arduino Uno R3',
            description: 'Microcontroller board based on the ATmega328P',
            category: 'Electronics',
            quantity: 45,
            price: 22.99,
            status: 'in-stock',
            image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=100&h=100&fit=crop',
            rating: 5,
            location: 'Shelf A-12',
            lastUpdated: '2025-12-08'
        },
        {
            id: 2,
            name: 'Raspberry Pi 4',
            description: 'Single-board computer with 4GB RAM',
            category: 'Electronics',
            quantity: 12,
            price: 55.00,
            status: 'low-stock',
            image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop',
            rating: 5,
            location: 'Shelf A-13',
            lastUpdated: '2025-12-07'
        },
        {
            id: 3,
            name: 'Soldering Station',
            description: 'Digital temperature-controlled soldering iron',
            category: 'Tools',
            quantity: 8,
            price: 89.99,
            status: 'in-stock',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop',
            rating: 4,
            location: 'Workbench 2',
            lastUpdated: '2025-12-06'
        },
        {
            id: 4,
            name: 'LED Strip 5M RGB',
            description: 'Addressable RGB LED strip with WS2812B',
            category: 'Components',
            quantity: 0,
            price: 18.50,
            status: 'out-of-stock',
            image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop',
            rating: 4,
            location: 'Drawer C-5',
            lastUpdated: '2025-12-05'
        },
        {
            id: 5,
            name: 'Multimeter Digital',
            description: 'Auto-ranging digital multimeter with LCD display',
            category: 'Tools',
            quantity: 15,
            price: 45.00,
            status: 'in-stock',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop',
            rating: 5,
            location: 'Tool Cabinet',
            lastUpdated: '2025-12-08'
        },
        {
            id: 6,
            name: 'Breadboard 830 Points',
            description: 'Solderless breadboard for prototyping',
            category: 'Components',
            quantity: 32,
            price: 5.99,
            status: 'in-stock',
            rating: 4,
            location: 'Bin D-8',
            lastUpdated: '2025-12-07'
        },
        {
            id: 7,
            name: 'Desk Lamp LED',
            description: 'Adjustable LED desk lamp with USB charging',
            category: 'Furniture',
            quantity: 6,
            price: 34.99,
            status: 'low-stock',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop',
            rating: 4,
            location: 'Office Area',
            lastUpdated: '2025-12-06'
        },
        {
            id: 8,
            name: 'USB-C Cable 2M',
            description: 'High-speed USB-C cable with data transfer',
            category: 'Electronics',
            quantity: 28,
            price: 12.99,
            status: 'in-stock',
            rating: 4,
            location: 'Drawer A-3',
            lastUpdated: '2025-12-08'
        }
    ];

    getEmptyItem(): InventoryItem {
        return {
            id: 0,
            name: '',
            description: '',
            category: '',
            quantity: 0,
            price: 0,
            status: 'in-stock',
            location: '',
            lastUpdated: new Date().toISOString().split('T')[0],
            rating: 0
        };
    }

    openAddDialog() {
        this.dialogMode = 'add';
        this.currentItem = this.getEmptyItem();
        this.dialogVisible = true;
    }

    openEditDialog(item: InventoryItem) {
        this.dialogMode = 'edit';
        this.currentItem = { ...item };
        this.dialogVisible = true;
    }

    saveItem() {
        if (!this.currentItem.name || !this.currentItem.category) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Name and Category are required'
            });
            return;
        }

        if (this.dialogMode === 'add') {
            this.currentItem.id = Math.max(...this.inventoryItems.map(i => i.id)) + 1;
            this.currentItem.lastUpdated = new Date().toISOString().split('T')[0];
            this.inventoryItems.push(this.currentItem);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item added successfully'
            });
        } else {
            const index = this.inventoryItems.findIndex(i => i.id === this.currentItem.id);
            if (index !== -1) {
                this.currentItem.lastUpdated = new Date().toISOString().split('T')[0];
                this.inventoryItems[index] = this.currentItem;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Item updated successfully'
                });
            }
        }

        this.dialogVisible = false;
    }

    confirmDelete(item: InventoryItem) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${item.name}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.deleteItem(item);
            }
        });
    }

    deleteItem(item: InventoryItem) {
        this.inventoryItems = this.inventoryItems.filter(i => i.id !== item.id);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item deleted successfully'
        });
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'in-stock': 'In Stock',
            'low-stock': 'Low Stock',
            'out-of-stock': 'Out of Stock'
        };
        return labels[status] || status;
    }

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
        const severities: { [key: string]: 'success' | 'warn' | 'danger' } = {
            'in-stock': 'success',
            'low-stock': 'warn',
            'out-of-stock': 'danger'
        };
        return severities[status] || 'success';
    }

    exportData() {
        const dataStr = JSON.stringify(this.inventoryItems, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_export.json';
        link.click();
        URL.revokeObjectURL(url);

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory exported successfully'
        });
    }
}
