/*
 * angular-cc-autorefresh
 * http://projects.codingmonster.co.uk/angular-cc-autorefresh

 * Version: 0.3.0 - 2015-11-21
 * License: MIT
 */

angular.module("cc.autorefresh.tpls", ["app/vendor/angular-ccacca/autoRefresh/ccAutoRefreshBtn.html"]);
angular.module("app/vendor/angular-ccacca/autoRefresh/ccAutoRefreshBtn.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/vendor/angular-ccacca/autoRefresh/ccAutoRefreshBtn.html",
    "<div class=\"btn-group\" ng-show=\"ctrl.isVisible\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\"\n" +
    "            ng-click=\"ctrl.togglePause()\" \n" +
    "            ng-disabled=\"ctrl.isDisabled || ctrl.isRefreshing\" \n" +
    "            title=\"{{ctrl.isPaused ? '重新开始' : '暂停'}}\">\n" +
    "        <i class=\"glyphicon\" ng-class=\"{\n" +
    "            'glyphicon-pause': !ctrl.isPaused, \n" +
    "            'glyphicon-play': ctrl.isPaused }\"></i>\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default\" \n" +
    "            ng-click=\"ctrl.isRefreshing ? ctrl.cancelRefresh() : ctrl.refresh()\" \n" +
    "            ng-disabled=\"ctrl.isDisabled\" \n" +
    "            title=\"{{ctrl.isRefreshing ? '取消刷新': '现在刷新'}}\"\n" +
    "            cc-transclude-append>\n" +
    "        <i class=\"glyphicon\" ng-class=\"{ \n" +
    "            'glyphicon-refresh': !ctrl.isRefreshing, \n" +
    "            'glyphicon-minus-sign': ctrl.isRefreshing }\"></i>\n" +
    "    </button>\n" +
    "</div>");
}]);
