import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path:'',
        loadChildren:()=>
            import('@fit-reserve/static').then(
                (esModule) => esModule.StaticModule
            )
    },
    {
        path:'feature',
        loadChildren:()=>
            import('@fit-reserve/fit-reserve/features').then(
                (esModule) => esModule.FeaturesModule
            )
    },

    
];
