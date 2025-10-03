import {Component} from '@angular/core';


@Component({
    standalone: false,
    /* tslint:disable:component-selector */
    selector: 'app-sidebarTabContent',
    /* tslint:enable:component-selector */
    template: `
        <div class="layout-submenu-content">
            <ng-content></ng-content>
        </div>
    `
})
export class AppSidebartabcontentComponent {
}
