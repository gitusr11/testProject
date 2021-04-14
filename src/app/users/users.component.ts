import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  static parameters = [NgbModal, HttpClient]
  public modalReference: NgbModalRef;
  public users: any;
  public savedUser: any;
  public savedUserTask : any;
  public newUserList: any;
  public currentUserID ;

  constructor(private modalService: NgbModal, private http: HttpClient) {
    this.modalService = modalService;
  };

  ngOnInit(): void {
    this.users = {};
    this.users.usertask = {};
    
    this.getAllUsers();
  };

// Reset Form Value
  resetForm() {
    this.users = {};
    this.user.usertask = {};
    
  };

// Open User Template
  openUserPopup(UserModel) {
    this.users = {};
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll('close all to open new popup!');
    }
    this.modalReference = this.modalService.open(UserModel, { size: 'sm', windowClass: 'app-modal-window', backdropClass: 'top96' });
  };

// Open Task Template
  openTaskPopup(TaskModel,id) {
    console.log("currentUserID",id);
    this.currentUserID = id
    this.users.usertask = {};
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll('close all to open new popup!');
    }
    this.modalReference = this.modalService.open(TaskModel, { size: 'sm', windowClass: 'app-modal-window', backdropClass: 'top96' });
  };

//  Save User Details
  saveusers(form) {
    // Check New /Existing User
    if (this.users.id === undefined || this.users.id === '') {
      console.log("form", form)
      var value = form.value;

      // Validate Form
      if (form.invalid == true) {
        return true;
      }

      // check already created user
      var data = this.user.filter(el => {
        return el.userName == value.userName
      })
      if (data.length > 0) {
        alert("user already exist");
      }
      else {
        this.http.post('http://localhost:3000/users', this.users)
          .subscribe(result => {
            this.savedUser = result;
            let res = []
            res.push(result);
            if (res.length == 0) {
              alert("failed")
            }
            else {
              alert("Record Saved Successfully")
              this.resetForm();
              this.modalService.dismissAll('close all to open new popup!');
            }
          })
      }
      setTimeout(() => {
          this.getAllUsers();
      }, 500);
    
    }
     // Update Existing User
    else {
      var data = this.users;
      console.log("dadaupdate", data)
      this.http.put('http://localhost:3000/users/' + this.users.id, data)
        .subscribe(result => {
          let res = []
          res.push(result);
          // console.log(result);
          if (res.length == 0) {
            alert("failed")
          }
          else {
            alert("Record Update Successfully")
            this.resetForm();
            this.modalService.dismissAll('close all to open new popup!');
          }
        });
    }
    setTimeout(() => {
       this.getAllUsers();
    }, 500);
  };

// Get User List
    user: any;
    getAllUsers() {
      console.log("enter");
      this.http.get('http://localhost:3000/users')
        .subscribe(response => {
          this.user = response;
          setTimeout(() => {
            this.getAllUsersTaskList();
          }, 500);
        })
    };

// Get UserDetail By Id
  getId(id, UserModel) {
    this.http.get('http://localhost:3000/users/' + id)
      .subscribe(response => {
        this.users = response;
        console.log("resss", response)
        if (this.modalService.hasOpenModals()) {
          this.modalService.dismissAll('close all to open new popup!');
        }
        this.modalReference = this.modalService.open(UserModel, { size: 'sm', windowClass: 'app-modal-window', backdropClass: 'top96' });
      })
  };

// Delete User
   removeModal(id) {
    var ask = confirm("Do You Want Delete This?")
    if (ask) {
      var index = this.user.map(item => item.id).indexOf(id);
      console.log("index", index);
      if (index >= 0) {
        this.http.delete('http://localhost:3000/users/' + id)
          .subscribe(() => {
          });
      }
    }
    setTimeout(() => {
      this.getAllUsers();
    }, 500);
  };
  
  // Save User Task Details
  saveboards(form){
     // Check New /Existing Task
    if (this.users.usertask.id === undefined || this.users.usertask.id === '') {
        var value = form.value;
      // Validate Form
      if (form.invalid == true) {
        return true;
      }
       // check already created task
      var data = this.userTask.filter(el => {
        return el.task == value.task
      })
      if (data.length > 0) {
        alert("task already exist");
      }
      else{
      var json = {"users_ID":this.currentUserID , "task":this.users.usertask.task}
        this.http.post('http://localhost:3000/task', json)
          .subscribe(result => {
            this.savedUserTask = result;
            let res = []
            res.push(result);
            if (res.length == 0) {
              alert("failed")
            }
            else {
              alert("Record Saved Successfully")
              this.resetForm();
              this.modalService.dismissAll('close all to open new popup!');
            }
          })
    }
      setTimeout(() => {
          this.getAllUsersTaskList();
      }, 500);
    
    }
  };

  // Get UserTask List
    userTask: any;
    getAllUsersTaskList() {
      this.http.get('http://localhost:3000/task')
        .subscribe(response => {
          this.userTask = response;
          this.user.forEach(element => {
            element.task = this.userTask.filter(function(item){
              return element.id == item.users_ID
            })
          });
          console.log(this.user);
        })
    };
}
