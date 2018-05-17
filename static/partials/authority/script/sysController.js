define(['app', 'sucHelpers'], function (app) {
    app.controller("sysCtrl", function ($scope, $http, $rootScope, $templateCache) {
    	if($scope.suc.slimOptions){
    		$scope.slimOptions = $scope.suc.slimOptions;
    	}else{
    		$scope.slimOptions = {
        			height:"100%",
        			size: '4px',
        			color: '#3b8cff'
    		};
    	}
    	
    	$templateCache.put('dir/myOpe.html', "    <div>" +
                "        <ul class=\"opeLi editing\">" +
                "            <li ng-repeat=\"ope in data track by $index\">" +
                "                <div><span class=\"leftOpe\" ng-click=\"deleteOpe(ope,data)\">×</span><span class=\"opeName\">{{ope.operaName}}</span></div>" +
                "            </li>" +
                "        </ul>" +
                "        <div class=\"inli\" ng-click=\"clickAddBtn()\" ng-show=\"addBtn\"><button class=\"editBtn\">+</button></div>" +
                "        <div class=\"inli\" ng-show=\"!addBtn\">" +
                "            <input type=\"text\" ng-model=\"input_ope.operaName\" uib-typeahead=\"autho for autho in ops | filter:$viewValue | limitTo:8\" class=\"tableInput opeInput\">" +
                "            <button class=\"editBtn opeEditBtn leftB\" ng-disabled=\"!input_ope.operaName\" ng-click=\"addNewOpe()\"></button>" +
                "            <button class=\"editBtn opeEditBtn rightB\" ng-click=\"noShowAdd()\"></button>" +
                "        </div>" +
                "    </div>");
            $templateCache.put('dir/multiSelect.html', "    <span class=\"multiSelect inlineBlock\">" +
                "                <button id=\"{{directiveId}}\" type=\"button\"                " +
                "                    ng-click=\"toggleCheckboxes( $event );  refreshSelectedItems(); refreshButton();refreshButton(); prepareGrouping; prepareIndex();\"" +
                "                    ng-bind-html=\"varButtonLabel\" " +
                "                    ng-show=\"!noMulti\"" +
                "                    >" +
                "                </button>" +
                "                <div class=\"checkboxLayer\">" +
                "                    <div class=\"helperContainer\" ng-if=\"helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset \">" +
                "                        <div class=\"line\" ng-if=\"helperStatus.all || helperStatus.none || helperStatus.reset \">" +
                "                            <button type=\"button\" class=\"helperButton\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.all\" " +
                "                                ng-click=\"select( \'all\', $event );\"" +
                "                                ng-bind-html=\"lang.selectAll\">" +
                "                            </button>" +
                "                            <button type=\"button\" class=\"helperButton\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.none\"" +
                "                                ng-click=\"select( \'none\', $event );\"" +
                "                                ng-bind-html=\"lang.selectNone\">" +
                "                            </button>" +
                "                            <button type=\"button\" class=\"helperButton reset\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.reset\"" +
                "                                ng-click=\"select( \'reset\', $event );\"" +
                "                                ng-bind-html=\"lang.reset\">" +
                "                            </button>" +
                "                        </div>" +
                "                        <div class=\"line\" style=\"position:relative\" ng-if=\"helperStatus.filter\">       " +
                "                            <input placeholder=\"{{lang.search}}\" type=\"text\"" +
                "                                ng-click=\"select( \'filter\', $event )\"" +
                "                                ng-model=\"inputLabel.labelFilter\"" +
                "                                ng-change=\"searchChanged()\" class=\"inputFilter\"" +
                "                                />" +
                "                        </div> " +
                "                    </div>" +
                "                    <div class=\"checkBoxContainer\">" +
                "                        <div " +
                "                            ng-repeat=\"item in filteredModel | filter:removeGroupEndMarker\" class=\"multiSelectItem\"" +
                "                            ng-class=\"{selected: item[ tickProperty ]}\"" +
                "                            ng-click=\"syncItems( item, $event, $index );\">        " +
                "                        <div class=\"acol\">" +
                "                            <label>                               " +
                "                                <span " +
                "                                   ng-if=\"!noMulti\"" +
                "                                    ng-bind-html=\"writeLabel( item, \'itemLabel\' )\">" +
                "                                </span>" +
                "                            </label>" +
                "                            <span class=\"tickMark\" ng-if=\"item[ tickProperty ] === true\" ng-bind-html=\"icon.tickMark\"></span>" +
                "                        </div>" +
                "                    </div>" +
                "                </div>" +
                "            </div>" +
                "        </span>");
            $templateCache.put('dir/checkMultiList.html', "    <span class=\"multiSelect inlineBlock\">" +
                "                <button id=\"{{directiveId}}\" type=\"button\"                " +
                "                    ng-click=\"toggleCheckboxes( $event );  refreshSelectedItems(); refreshButton();refreshButton(); prepareGrouping; prepareIndex();\"" +
                "                    ng-bind-html=\"varButtonLabel\" " +
                "                    ng-show=\"!noMulti\"" +
                "                    >" +
                "                </button>" +
                "                <div class=\"checkboxLayer noShadow\">" +
                "                    <div class=\"checkBanner\">{{::leftBana}}</div>" +
                "                    <div class=\"helperContainer\" ng-if=\"helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset \">" +
                "                        <div class=\"line\" ng-if=\"helperStatus.all || helperStatus.none || helperStatus.reset \">" +
                "                            <!--// select all-->" +
                "                            <button type=\"button\" class=\"helperButton\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.all\" " +
                "                                ng-click=\"select( \'all\', $event );\"" +
                "                                ng-bind-html=\"lang.selectAll\">" +
                "                            </button>" +
                "                            <button type=\"button\" class=\"helperButton\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.none\"" +
                "                                ng-click=\"select( \'none\', $event );\"" +
                "                                ng-bind-html=\"lang.selectNone\">" +
                "                            </button>" +
                "                            <button type=\"button\" class=\"helperButton reset\"" +
                "                                ng-disabled=\"isDisabled\"" +
                "                                ng-if=\"helperStatus.reset\"" +
                "                                ng-click=\"select( \'reset\', $event );\"" +
                "                                ng-bind-html=\"lang.reset\">" +
                "                            </button>" +
                "                        </div>" +
                "                        <div class=\"line\" style=\"position:relative\" ng-if=\"helperStatus.filter\">  " +
                "                            <input placeholder=\"{{lang.search}}\" type=\"text\"" +
                "                                ng-click=\"select( \'filter\', $event )\"" +
                "                                ng-model=\"inputLabel.labelFilter\"" +
                "                                ng-change=\"searchChanged()\" class=\"inputFilter\"" +
                "                                />" +
                "                        </div> " +
                "                    </div>" +
                "                    <div class=\"checkBoxContainer\">" +
                "                        <div " +
                "                            ng-repeat=\"item in filteredModel | filter:removeGroupEndMarker\" class=\"multiSelectItem\"" +
                "                            ng-class=\"{selected: item[ tickProperty ]}\"" +
                "                            ng-click=\"syncItems( item, $event, $index );\">        " +
                "                        <div class=\"acol\">" +
                "                            <label>                               " +
                "                                <div ng-transclude></div>" +
                "                            </label>" +
                "                            <span class=\"tickMark\" ng-if=\"item[ tickProperty ] === true\" ng-bind-html=\"icon.tickMark\"></span>" +
                "                        </div>" +
                "                    </div>" +
                "                </div>" +
                "            </div>" +
                "            <div class=\"outChecked\">" +
                "                   <div class=\"checkBanner\">{{::rightBana}}</div>" +
                "                   <div class=\"checkBoxContainer\">" +
                "                        <div " +
                "                            ng-repeat=\"item in outputModel\" " +
                "                            ng-click=\"outClickItems( item, $event);\" class=\"multiSelectItem\" " +
                "                        ng-transclude></div>" +
                "                   </div>" +
                "            </div>" +
                "        </span>");
    })
});
