import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ReportType } from '../helpers/report-type';
import { Note } from '../model/note.model';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { DashboardService } from '../services/dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  serviceName:string;
  appName:string;
  timelapse:string;

  lastUpdate:string;
  charts:any[] = [];
  notes: Note[] = [];

  latestNote:Note;
  previousNotes:number;
  subaccountId:string = null;

  isChartsDataLoading:boolean = true;
  isNoteDataLoading: boolean = true;

  constructor(private ctaasDashboardService: CtaasDashboardService,
              private noteService: NoteService,
              private subaccountService: SubaccountService,
              private ionToastService: IonToastService,
              private dashboardService: DashboardService) {}
  
  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.timelapse = 'Last 24 Hours';
    this.fetchData();
  }

  fetchData(event?:any){
    this.subaccountService.getSubAccountList().subscribe((res)=>{
      if(res.subaccounts.length>0){
        // this.subaccountService.setSubAccount(res.subaccounts[0]);
        this.subaccountService.setSubAccount({id:"2c8e386b-d1bd-48b3-b73a-12bfa5d00805",customerId:"",name:"Test",subaccountAdminEmails: []});
        this.subaccountId = this.subaccountService.getSubAccount().id;
        this.fetchCtaasDashboard(event);
      }else{
        this.isChartsDataLoading=false;
        this.isNoteDataLoading=false;
      }
    },(err)=>{
      console.error(err);
      this.isChartsDataLoading=false;
      this.isNoteDataLoading=false;
    });
  }

  handleRefresh(event) {
    this.fetchData(event);
  };

  fetchCtaasDashboard(event?: any){
    this.isChartsDataLoading = true;
    this.charts = [];

    const requests: Observable<any>[] = [];
    for(const key in ReportType){
      const reportType: string = ReportType[key];
      requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccountId,reportType));
    }

    forkJoin(requests).subscribe((res: [{ response?:string, error?:string }])=>{
      if(res){
        this.charts = [...res].filter((e: any) => !e.error).map((e: { response: string }) => e.response);
        if(this.charts.length>0){
          let reports = this.charts.map((chart:any)=>{
            // Destructure the chart object to save only timestampId and type attributes
            return (({ timestampId, type }) => ({ timestampId, type }))(chart);
          });
          this.dashboardService.setReports(reports);
          this.lastUpdate = this.charts[0].lastUpdatedTS ? this.charts[0].lastUpdatedTS : null;
        }
      }
      if(event) event.target.complete();
      this.isChartsDataLoading = false;
    },(e)=>{
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'Ok');
      if(event) event.target.complete();
    })
  }

}
