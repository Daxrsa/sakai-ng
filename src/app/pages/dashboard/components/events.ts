import { Component } from '@angular/core';

@Component({
    selector: 'app-events',
    imports: [],
    template: `
        <div class="card">
            <iframe src="https://calendar.google.com/calendar/embed?src=daorsahyseni%40gmail.com&ctz=Europe%2FAmsterdam" style="border-radius: 5px" width="800" height="600" frameborder="0" scrolling="no"></iframe>        
        </div>
    `
})
export class Events {
}
