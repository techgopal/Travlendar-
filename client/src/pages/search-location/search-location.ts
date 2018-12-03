import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

import { MapServiceProvider } from '../../providers/map-service/map-service';

/**
 * Generated class for the SearchLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-location',
  templateUrl: 'search-location.html',
})
export class SearchLocationPage {
  autocompleteItems;
  autocomplete;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapServiceProvider: MapServiceProvider,public viewCtrl: ViewController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchLocationPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    var returnResult = { description: item };
    this.viewCtrl.dismiss(returnResult);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    this.mapServiceProvider.getPlaceSearch(this.autocomplete.query).subscribe(data => {
      console.log(data);
      if (data != undefined) {
        for (var i = 0; i < data.predictions.length; i++) {
          this.autocompleteItems.push(data.predictions[i].description);
        }
      }
    });
  }
}
