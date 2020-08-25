import {
    transition,
    trigger,
    query,
    style,
    animate,
    group,
    animateChild
} from '@angular/animations';


export const slideInAnimation =
    trigger('routeAnimations', [
        //transition('* => *', [
        //    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        //    group([
        //        query(':enter', [
        //            style({ transform: 'translateX(50%)' }),
        //            animate('1.0s ease-in-out', style({ transform: 'translateZ(-200px) perspective(500px)' }))
        //        ], { optional: true }),
        //        query(':leave', [
        //            style({ transform: 'translateX(0%)' }),
        //            animate('1.0s ease-in-out', style({ transform: 'translateZ(-200px) perspective(500px)' }))
        //        ], { optional: true }),
        //    ])
        //])     
    ]);