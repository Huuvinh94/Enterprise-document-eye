import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CareerService } from '@core/services/career.service';
import { SurveyService } from '@core/services/survey.service';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SurveyComponent } from '../survey/survey.component';
@Component({
  selector: 'app-survey-builder',
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public surveyService: SurveyService,
    public careerService: CareerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SurveyBuilderComponent>) {
  }
  numQuest: number;
  selectedPage: any = 1;
  selectedCareer: any = -1;
  // List page default
  listPage: any[] = [
    { value: 'addNew', viewValue: 'Thêm trang mới' },
  ];
  listCareer: any = [];
  // List types of question default
  typesQuestion: any[] = [
    { value: 'text', viewValue: 'Trả lời ngắn', icon: 'short_text' },
    { value: 'comment', viewValue: 'Đoạn', icon: 'format_align_left' },
    {
      value: 'radiogroup', viewValue: 'Trắc nghiệm', icon: 'radio_button_checked',
      icon_unchecked: 'radio_button_unchecked'
    },
    { value: 'checkbox', viewValue: 'Hộp kiểm', icon: 'checkbox', icon_unchecked: 'check_box_outline_blank' },
    { value: 'dropdown', viewValue: 'Menu thả xuống', icon: 'arrow_drop_down', icon_unchecked: 'arrow_drop_down' },
    { value: 'bootstrapdatepicker', viewValue: 'Ngày', icon: 'date_range' },
  ];
  // Default survey
  survey: any = {
    title: '',
    pages: [
      {
        name: 'page1',
        id: 1,
        questions: [
          {
            type: 'text',
            isRequired: false,
            name: 'question1',
            title: '',
            typeIcon: {
              value: 'text', viewValue: 'Trả lời ngắn', icon: 'short_text'
            },
          },
        ]
      }
    ]
  };
  // List quest of career
  optionsQuestCareer: string[];
  // QuestFormControl
  quest: FormControl = new FormControl();
  questControl = [
    this.quest
  ];
  // QuestFormControl
  filter: Observable<string[]>;
  filteredOptions = [
    this.filter
  ];

  ngOnInit() {
    // Get list quest suggest of each career
    this.careerService.getQuestCareer().subscribe(res => {
      this.listCareer = res;
      if (this.listCareer.length > 0) {

        if (this.data.isEdit) {
          this.survey = JSON.parse(this.data.content);

          // Get list quest of current career detail
          this.selectedCareer = this.data.careerId;
          const listQuestCarrer = this.listCareer.find(item =>
            item._id === this.data.careerId
          );
          this.optionsQuestCareer = _.map(listQuestCarrer.questCareer, 'content');

          // Load autocomplete for survey
          let countQuest = 0;
          let countPage = 0;
          this.survey.pages.forEach((page, pageIndex) => {
            countPage = countPage + 1;
            // Get Page
            this.listPage.push({
              value: countPage,
              viewValue: 'Trang ' + countPage
            });
            // Add form
            page.questions.forEach((item, index) => {
              countQuest = countQuest + 1;
              // If firt quest of first page then only set auto
              if (index === 0 && pageIndex === 0) {
                this.setAutocompleteQuest(0);
              } else {// Other need to add form and filter
                this.addQuestAutocomplete(countQuest - 1);
              }
            });
            this.numQuest = countQuest;
          });
        } else {
          // Get list quest of first career
          this.selectedCareer = this.listCareer[0]._id;
          this.optionsQuestCareer = _.map(this.listCareer[0].questCareer, 'content');
          this.numQuest = 1;

          // List page default
          this.listPage.push(
            { value: 1, viewValue: 'Trang 1' },
          );
          this.setAutocompleteQuest(0);
        }
      }
    });
  }

  /**
   * Filter quest
   * @param value:input quest
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsQuestCareer.filter(option =>
      option.toLowerCase().includes(filterValue
      ));
  }

  /**
   * Set autocomplete quest for form and filter
   */
  setAutocompleteQuest(index: number) {
    this.filteredOptions[index] = this.questControl[index].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  /**
   * Event add new quest
   */
  addNewQuestion() {
    // Add new quest
    this.numQuest = this.numQuest + 1;
    this.survey.pages[this.selectedPage - 1].questions.push(
      {
        type: 'text',
        title: '',
        name: 'question-' + this.selectedPage + '-' + this.numQuest,
        typeIcon: {
          value: 'text', viewValue: 'Trả lời ngắn', icon: 'short_text'
        },
      });
    this.addQuestAutocomplete(this.numQuest - 1);
  }

  /**
   * Event add autocomplete for quest
   */
  addQuestAutocomplete(index: number) {
    // Add new form
    const quest: FormControl = new FormControl();
    this.questControl.push(quest);
    // Add new filter autocomplete
    const newFilter = new Observable<string[]>();
    this.filteredOptions.push(newFilter);
    this.setAutocompleteQuest(index);
  }

  /**
   * Event remove quest autocomplete
   */
  removeQuestAutocomplete(index: number) {
    this.questControl.splice(index, 1);
    this.filteredOptions.splice(index, 1);
  }

  /**
   * Add new answer
   * @param indexQues :index of quest
   */
  addNewAnswer(indexQues, indexAnswer) {
    this.survey.pages[this.selectedPage - 1].questions[indexQues].choices.push({
      value: 'item' + (indexAnswer + 2),
      text: ''
    });
  }

  /**
   * Event remove quest
   */
  removeQuest(item, items) {
    const indexQuest = $.inArray(item, items);
    items.splice(indexQuest, 1);
    this.removeQuestAutocomplete(indexQuest);
    this.numQuest = this.numQuest - 1;
  }

  /**
   * Event remove answer
   */
  removeAnswer(item, items) {
    items.splice($.inArray(item, items), 1);
  }

  /**
   * Event page
   */
  removePage() {
    // debugger
    // this.listPage.splice(this.listPage.indexOf(this.selectedPage), 1);
    // // debugger
    // this.selectedPage = this.selectedPage - 1;
  }

  /**
   * Handle preview button
   */
  togglePreview() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      content: this.survey
    };
    this.dialog.open(SurveyComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
        }
      });
  }

  /**
   * Save survey to database
   */
  saveSurvey() {
    const dataSurvey = {
      _id: null,
      surveyName: this.survey.title,
      careerId: this.selectedCareer,
      content: JSON.stringify(this.survey),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lastLoggedIn: null
    };
    // Edit mode
    if (this.data.isEdit) {
      dataSurvey._id = this.data._id;
      this.surveyService.editSurvey(dataSurvey).subscribe(
        resClose => {
          if (resClose && resClose.statusCode === 200) {
            this.dialogRef.close(true);
          }
        }
      );
    } else {// Create mode
      this.surveyService.saveSurvey(dataSurvey).subscribe(
        resClose => {
          if (resClose && resClose.statusCode === 200) {
            this.dialogRef.close(true);
          }
        }
      );
    }

  }

  /**
   * Handle when change type of quest
   */
  typeQuestChange(event, question) {
    delete question.choices;
    delete question.inputType;
    delete question.dateFormat;
    question.typeIcon = this.typesQuestion.find(item => item.value === event.value);
    switch (question.type) {
      case 'text':
        break;
      case 'comment':
        break;
      case 'radiogroup':
        question.choices = [{
          value: 'item1',
          text: ''
        }];
        break;
      case 'checkbox':
        question.choices = [{
          value: 'item1',
          text: ''
        }];
        break;
      case 'dropdown':
        question.choices = [{
          value: 'item1',
          text: ''
        }];
        break;
      case 'bootstrapdatepicker':
        // TODO survey date picker not load
        question.inputType = 'date';
        question.dateFormat = 'mm / dd / yy';
        break;
      default:
        break;
    }
  }

  /**
   * Handle when page change or add new page
   */
  pageChange() {
    switch (this.selectedPage) {
      case 'addNew':
        this.numQuest = this.numQuest + 1;
        // Add page to select
        this.listPage.push({
          value: (this.listPage.length),
          viewValue: 'Trang ' + (this.listPage.length)
        });
        // Add page to survey data
        this.survey.pages.push({
          name: 'page' + (this.listPage.length - 1),
          id: this.listPage.length - 1,
          questions: [
            {
              type: 'text',
              isRequired: false,
              name: 'question' + this.numQuest,
              title: '',
              typeIcon: {
                value: 'text', viewValue: 'Trả lời ngắn', icon: 'short_text'
              },
            },
          ]
        });
        this.selectedPage = this.listPage.length - 1;
        this.addQuestAutocomplete(this.numQuest - 1);
        break;
      default:
        break;
    }
  }

  /**
   * Handle when change career
   */
  careerChange(event) {
    const listQuestCarrer = this.listCareer.find(item =>
      item._id === event.value
    );
    this.optionsQuestCareer = _.map(listQuestCarrer.questCareer, 'content');
    for (let i = 0; i < this.numQuest; i++) {
      this.setAutocompleteQuest(i);
    }
  }
}



