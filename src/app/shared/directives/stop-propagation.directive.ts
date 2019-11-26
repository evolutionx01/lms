import {Directive, HostListener} from "@angular/core";

@Directive({
    selector: "[click-stop-propagation]"
})
export class ClickStopPropagation
{
    constructor(){
        console.log("Directive called");
    }
    @HostListener("click", ["$event"])
    public onClick(event: any): void
    {
       // console.log("Directive called");
        event.preventDefault();
    }
}