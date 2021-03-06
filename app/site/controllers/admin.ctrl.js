(function(){
  'use strict';

  angular
    .module('shopApp')
    .controller('AdminCtrl',AdminCtrl);

  function AdminCtrl($scope,$state,productSrv,toastr){
    var adminVm = this;
    adminVm.productSrv = productSrv;
    adminVm.is_products = false;
    adminVm.is_orders = false;
    adminVm.totalRev = 0;
    adminVm.categories = productSrv.categories;
    adminVm.category = productSrv.category;
    adminVm.page = 1;

    console.log(adminVm.categories);

    //check if logged in
    if(localStorage.authToken == undefined || localStorage.authToken == null){
      $state.go('auth');
    }

    //check current state
    $scope.$watch(function(){
      return $state.current;
    },function(){
      console.log($state.current.name)
      if($state.current.name == 'admin.dash'){
        console.log(1)
        adminVm.page = 1;
      }else if($state.current.name == 'admin.orders'){
        console.log('2')
        adminVm.page = 2;
      }else if($state.current.name == 'admin.add_product'){
        console.log('3')
        adminVm.page = 3;
      }
    });

    adminVm.products = productSrv.products;
    if(adminVm.products.length > 0 ){
      adminVm.is_products = true;
    }

    adminVm.orders = productSrv.orders;
    if(adminVm.orders.length > 0 ){
      adminVm.is_orders = true;
    }
    console.log(adminVm.orders)
    calcRev();

    //watch for updates to products object
    $scope.$watch(function(){
        return productSrv.products;
    }, function (newValue) {
      if(productSrv.products.length > 0){
          adminVm.products = productSrv.products;
          adminVm.is_products = true;
      }
    });

    $scope.$watch(function(){
        return productSrv.orders;
    }, function (newValue) {
      if(productSrv.orders.length > 0){
          adminVm.orders = productSrv.orders;
          adminVm.is_orders = true;
      }
    });

    //public functions
    adminVm.gotoOrder = gotoOrder;
    adminVm.editProduct = editProduct;
    adminVm.logout = logout;
    adminVm.reloadProducts = reloadProducts;
    adminVm.deleteOrders = deleteOrders;
    adminVm.calcRev = calcRev;

    function reloadProducts(){
      productSrv.deleteAllProducts()
      .then(function(){
        productSrv.loadProducts();
      })
    }

    function deleteOrders(){
      productSrv.deleteOrders();
      adminVm.orders = productSrv.orders;
      adminVm.is_orders = false;
      adminVm.calcRev();
    }

    function gotoOrder(id){
      $state.go('admin.order_details',{orderId:id})
    }

    function editProduct(product){
      $state.go('admin.edit_product',{productId:product.id});
    }

    function logout(){
      localStorage.removeItem('authToken');
      toastr.success('Logged out succesfully.')
      $state.go('auth');
    }

    function calcRev(){
      adminVm.totalRev = 0;
      for(var order in adminVm.orders){
        adminVm.totalRev += adminVm.orders[order].final_total;
      }
    }

  };
})();
