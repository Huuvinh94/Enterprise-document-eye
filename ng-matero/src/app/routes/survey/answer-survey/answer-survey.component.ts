import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AnswerSurveyService } from '@core/services/answerSurvey.service';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as Survey from 'survey-angular';
@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.scss']
})
export class AnswerSurveyComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public answerSurveyService: AnswerSurveyService) {
  }
  listAnswer = [];
  listQuestion = [];
  selectedAnswerSurvey: any = -1;
  survey: any;
  ngOnInit() {
    if (this.data._id) {
      Survey.StylesManager.applyTheme('default');
      this.survey = new Survey.Model(this.data.content);
      this.getAnswer();
    }

  }

  getAnswer() {
    this.listQuestion = [];
    this.listAnswer = [];
    this.answerSurveyService.getAnswerSurveyBySurveyId(this.data._id).subscribe(
      listAnswer => {
        this.listAnswer = listAnswer;
        if (this.listAnswer.length > 0) {
          this.selectedAnswerSurvey = this.listAnswer[0]._id;
        }
        this.getQuestionsSurvey();
        // Draw chart of answer for each question
        setTimeout(() => {
          this.listQuestion.forEach((item, index) => {
            if (item.answer) {
              this.drawAnswerChart(item, index);
            }
          });
        });
      });
  }

  onTabChange(event) {
    switch (event.index) {
      case 0:
        this.getAnswer();
        break;
      case 1:
        this.showAnswerDetailToSurvey();
        break;
      default:
        break;
    }
  }

  showAnswerDetailToSurvey() {
    if (this.listAnswer.length > 0) {
      const answerContent = this.listAnswer.find(item => item._id === this.selectedAnswerSurvey).content;
      this.survey.data = JSON.parse(answerContent);
      this.survey.mode = 'display';
      Survey.SurveyNG.render('surveyResult', { model: this.survey });
    }
  }

  getQuestionsSurvey() {
    const listQuestSurvey = this.survey.getAllQuestions();
    if (this.listAnswer.length > 0) {
      let listAllAnswerOfSurvey = this.listAnswer.map(item => JSON.parse(item.content));
      // Reduce
      listAllAnswerOfSurvey.reduce((accumulator, currentValue, currentIndex, array) => {
        _.map(accumulator, (val, key) => {
          if (currentValue[key] !== undefined) {
            accumulator[key] = val + ',' + currentValue[key];
          }
        });
        return accumulator;
      });
      listAllAnswerOfSurvey = listAllAnswerOfSurvey[0];
      // Get data for list question(All answer of each quest) to show UI
      listQuestSurvey.forEach(item => {
        let listAnswer = [];
        if (typeof listAllAnswerOfSurvey[item.name] === 'string') {
          listAnswer = listAllAnswerOfSurvey[item.name].split(',');
        } else {
          listAnswer = listAllAnswerOfSurvey[item.name];
        }
        this.listQuestion.push({
          name: item.name,
          title: item.title,
          answer: listAnswer === undefined ? '' : listAnswer
        });
      });
    } else {
      listQuestSurvey.forEach(item => {
        this.listQuestion.push({
          name: item.name,
          title: item.title,
          answer: null
        });
      });
    }
  }

  drawAnswerChart(quest, indexOfQuest) {
    const answer = quest.answer;
    // Count number of each answer content
    const countAnswer = {};
    $.each(answer, (i, el) => {
      countAnswer[el] = countAnswer[el] + 1 || 1;
    });
    // Get data Chart
    const dataChart = Object.entries(countAnswer).map((item) => {
      const numOfCount: any = item[1];
      return {
        name: item[0] === '' ? 'Chưa trả lời' : item[0],
        count: numOfCount,
        percentage: ((numOfCount / answer.length) * 100).toFixed(2)
      };
    });

    const color = d3.schemeCategory10;
    // avoiding overlap labels
    const getAngle = (d) => {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
    };
    const width = 500;
    const height = 300;
    const radius = 100;
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    const arcOver = d3.arc()
      .innerRadius(0)
      .outerRadius(150 + 10);

    const pie = d3.pie()
      .sort(null)
      .value((d) => {
        return d.count;
      });
    $('#chart-' + indexOfQuest).empty();
    const svg = d3.select('#chart-' + indexOfQuest).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');



    const g = svg.selectAll('.arc')
      .data(pie(dataChart))
      .enter().append('g')
      .on('mouseover', () => {
        tooltip.style('display', null);
      })
      .on('mousemove', (d) => {
        tooltip.transition().duration(200)
          .style('opacity', 0.9);
        tooltip.select('div').html(
          d.data.name + ' <br><strong>' + 'Số lần:' + d.data.count + '</strong>'
        )
          .style('position', 'fixed')
          .style('text-align', 'center')
          .style('width', '120px')
          .style('height', '45px')
          .style('padding', '2px')
          .style('font', '12px sans-serif')
          .style('background', 'lightsteelblue')
          .style('border', '0px')
          .style('border-radius', '8px')
          .style('left', (d3.event.pageX + 15) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
        d3.select(this).transition()
          .duration(1000)
          .attr('g', arcOver);

      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
        d3.select(this).transition()
          .attr('class', arc)
          .attr('stroke', 'none');
      });
    // color of each pie
    g.append('path')
      .attr('d', arc)
      .style('fill', (d, i) => {
        return color[i];
      });

    g.append('text')
      .attr('transform', (d) => {
        const _d = arc.centroid(d);
        _d[0] *= 2.2;	// multiply by a constant factor
        _d[1] *= 2.2;	// multiply by a constant factor
        return 'translate(' + _d + ')';
      })
      .attr('dy', '.50em')
      .style('text-anchor', 'middle')
      .text((d) => {
        if (d.data.percentage < 8) {
          return '';
        }
        return d.data.percentage + '%';
      });

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0.5);

    tooltip.append('rect')
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', '#ffffff')
      .style('opacity', 0.5);

    tooltip.append('div')
      .attr('x', 15)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '1.5em')
      .attr('font-weight', 'bold');
    // Legend for charts
    const legend = svg.selectAll('.legend')
      .data(dataChart).enter()
      .append('g').attr('class', 'legend')
      // .attr("legend-id", function (d) {
      //   return count++;
      // })
      .attr('transform', (d, i) => {
        return 'translate(-30,' + (-90 + i * 20) + ')';
      });

    legend.append('rect')
      .attr('x', width / 1.9)
      .attr('word-wrap', 'break-word')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d, i) => {
        return color[i];
      });
    legend.append('text')
      .attr('x', width / 2)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end').text((d) => {
        return d.name;
      });
  }

  deleteAnswerSurvey() {
    this.answerSurveyService.deleteAnswerSurvey(this.selectedAnswerSurvey).subscribe(
      listAnswer => {
        // this.showAnswerDetailToSurvey();
      });
  }
}
