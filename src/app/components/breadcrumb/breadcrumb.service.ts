import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const breadcrumbs: Breadcrumb[] = [];
        const root = this.router.routerState.snapshot.root;

        // Make first call to addBreadcrumb function
        this.addBreadcrumb(root.firstChild!, [], breadcrumbs);

        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private buildPath(iterations: number, components: string[]) {
    var path = '';

    for (let i = 1; i <= iterations; i++) {
      path = path + '/' + components[i];
    }
    
    return path;
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[]
  ) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      let components = routeUrl.toString().split(',');

      // only show 'home' when we're not home      
      if (routeUrl.length > 0) {
        components.splice(0, 0, 'home');
      }
      
      for (let i = 0; i<components.length; i++) {
        let item = components[i];

        let label = item;

        label = label.replace( "records", "record viewer" );
        label = label.replace( "mdi", "mdi viewer" );
        label = label.replace( "tox", "toxicology viewer" );

        const breadcrumb = {
            label: label,
            url: this.buildPath(i, components),
        };
      
        breadcrumbs.push(breadcrumb);
        this.addBreadcrumb(route.firstChild!, routeUrl, breadcrumbs);   
        
        // drop the id parameter that follows mdi & tox in the url
        if (item === "mdi" || item === "tox") {
          break;
        }
      }
    }
  }
}