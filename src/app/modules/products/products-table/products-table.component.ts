import { Component, OnInit } from '@angular/core';
import { Modal } from 'flowbite';
import { forkJoin } from 'rxjs';
import { ProductsService } from '../../../api/products.service';
import { UserService } from '../../../api/user.service';
import { Keys } from '../../../models/keys';
import { Product } from '../../../models/product';
import { ProductsPaginated } from '../../../models/products-paginated';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent implements OnInit {

  products: Product | any;
  selectedProduct: any;
  modal: any;

  page = 0;
  pageSize = 10;

  loading = false;

  currentPage: any;
  totalPages: any;
  firstPage: any = 1;
  lastPage: any;

  constructor(
    private productsService: ProductsService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserSettings().subscribe(res => {

      var inputType = undefined;
      var inputValue = undefined;
      var orderBy = undefined;
      var sort = undefined;
      var currentPage = undefined;

      if (res.inputType != undefined && res.inputType != null) {
        inputType = res.inputType;
      }
      if (res.inputValue != undefined && res.inputValue != null) {
        inputValue = res.inputValue;
      }
      if (res.orderBy != undefined && res.orderBy != null) {
        orderBy = res.orderBy;
      }
      if (res.sort != undefined && res.sort != null) {
        sort = res.sort;
      }
      if (res.currentPage != undefined && res.currentPage != null) {
        currentPage = res.currentPage;
      }

      console.log(inputValue);

      if (inputType == "Name") {
        this.loading = true;
        this.productsService.getProductsPaginated(inputValue, undefined, orderBy, sort, currentPage)
          .subscribe((res: ProductsPaginated) => {
            this.products = res.products;
            this.currentPage = res.currentPage;
            this.totalPages = res.totalPages;
            this.lastPage = res.totalPages;
            this.selectedType == "Name";
            this.loading = false;
          }, (err) => { this.loading = false; });
      } else if (inputType == "Category") {
        this.loading = true;
        this.productsService.getProductsPaginated(undefined, inputValue, orderBy, sort, currentPage)
          .subscribe((res: ProductsPaginated) => {
            this.products = res.products;
            this.currentPage = res.currentPage;
            this.totalPages = res.totalPages;
            this.lastPage = res.totalPages;
            this.selectedType == "Category"
            this.loading = false;
          }, (err) => { this.loading = false; });
      } else {
        this.loading = true;
        this.productsService.getProductsPaginated(undefined, undefined, orderBy, sort, currentPage)
          .subscribe((res: ProductsPaginated) => {
            this.products = res.products;
            this.currentPage = res.currentPage;
            this.totalPages = res.totalPages;
            this.lastPage = res.totalPages;
            this.loading = false;
          }, (err) => { this.loading = false; });
      }


    });

    this.createModal();

  }

  createModal() {
    const $targetEl = document.getElementById('modalEl');

    // options with default values
    const options: any = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
      onHide: () => {
        console.log('modal is hidden');
      },
      onShow: () => {
        console.log('modal is shown');
      },
      onToggle: () => {
        console.log('modal has been toggled');
      }
    };
    this.modal = new Modal($targetEl, options);
  }

  inputValue: any;
  // Name:	2-Year Standard Geek Squad Protection
  // Name: 	Audio-Technica - Microphone
  // Category: All Flat-Screen TVs
  search() {
    if (this.selectedType == "Name") {
      this.loading = true;
      this.productsService.getProductsPaginated(this.inputValue, undefined, undefined, undefined, undefined)
        .subscribe((res: ProductsPaginated) => {
          this.products = res.products;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;
          this.lastPage = res.totalPages;
          this.loading = false;
          var sources = [
            this.userService.updateUserSettings(Keys._inputValueKey, this.inputValue),
            this.userService.updateUserSettings(Keys._inputTypeKey, this.selectedType)
          ];

          forkJoin(sources).subscribe();

        }, (err => {
          this.products = [];
          this.currentPage = 0;
          this.totalPages = 0;
          this.lastPage = 0;
          this.loading = false;
        }));
    }

    if (this.selectedType == "Category") {
      this.loading = true;
      this.productsService.getProductsPaginated(undefined, this.inputValue, undefined, undefined, undefined)
        .subscribe((res: ProductsPaginated) => {
          this.products = res.products;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;
          this.lastPage = res.totalPages;
          this.loading = false;
          var sources = [
            this.userService.updateUserSettings(Keys._inputValueKey, this.inputValue),
            this.userService.updateUserSettings(Keys._inputTypeKey, this.selectedType)
          ];

          forkJoin(sources).subscribe();
        }, (err) => { this.loading = false; });
    }
  }

  ascending = true;
  sort(sortType: string) {
    var sortValue = "";
    this.ascending = !this.ascending;
    if (this.ascending) {
      sortValue = "asc"
    } else {
      sortValue = "desc"
    }

    if (this.selectedType == "Name") {
      this.loading = true;
      this.productsService.getProductsPaginated(this.inputValue, undefined, sortType, sortValue, undefined)
        .subscribe((res: ProductsPaginated) => {
          this.products = res.products;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;
          this.lastPage = res.totalPages;
          this.loading = false;
          var sources = [
            this.userService.updateUserSettings(Keys._orderByKey, sortType),
            this.userService.updateUserSettings(Keys._sortKey, sortValue)
          ];

          forkJoin(
            sources
          ).subscribe();
        }, (err => {
          this.products = [];
          this.currentPage = 0;
          this.totalPages = 0;
          this.lastPage = 0;
          this.loading = false;
        }));
    }

    if (this.selectedType == "Category") {
      this.loading = true;
      this.productsService.getProductsPaginated(undefined, this.inputValue, sortType, sortValue, undefined)
        .subscribe((res: ProductsPaginated) => {
          this.products = res.products;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;
          this.lastPage = res.totalPages;
          this.loading = false;
          var sources = [
            this.userService.updateUserSettings(Keys._orderByKey, sortType),
            this.userService.updateUserSettings(Keys._sortKey, sortValue)
          ];

          forkJoin(
            sources
          ).subscribe();
        }, (err) => { this.loading = false; });
    }
  }

  selectedType = "Name"
  selectType(type: string) {
    this.selectedType = type;
  }

  changePage(pageNumber: number) {
    if (pageNumber < 1) {
      return;
    }
    if (pageNumber > this.lastPage) {
      return;
    }
    console.log(pageNumber);
    this.loading = true;
    this.productsService.getProductsPaginated(undefined, undefined, undefined, undefined, pageNumber)
      .subscribe((res: ProductsPaginated) => {
        this.products = res.products;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.lastPage = res.totalPages;
        this.loading = false;
        this.userService.updateUserSettings(Keys._currentPageKey, pageNumber.toString()).subscribe();
      }, (err) => { this.loading = false; });
  }


  show(selectedProduct: any) {
    this.selectedProduct = selectedProduct;
    this.modal.show()
  }

  hide() {
    this.modal.hide()
  }
}
