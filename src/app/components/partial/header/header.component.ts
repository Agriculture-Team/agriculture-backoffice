import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authservice/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { UiHelperService} from 'src/app/service/helper/uihelper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showMobilOption: boolean;
  constructor(private authService: AuthenticationService,
    public dialog: MatDialog,
    private uiHelperService:UiHelperService) {
    this.showMobilOptions(screen.width);
  }

  ngOnInit(): void {
  }

  confirmLogout(): void {
    this.uiHelperService.closeSideBar();
    const message = 'Çıkış yapmak istediğinize emin misiniz?';
    const dialogData = new ConfirmDialogModel("İşlemi Onayla", message,'Hayır','Evet',true);
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      maxWidth: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult && dialogResult == true){
        this.logOut();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.showMobilOptions(event.target.innerWidth);
  }

  logOut() {
    this.authService.logOut();
  }

  showMobilOptions(size: number) {
    if (size < 960) {
      this.showMobilOption = true;
    } else {
      this.showMobilOption = false;
    }
  }

}
