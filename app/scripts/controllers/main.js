'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    // Phases control
    $scope.phaseIndex = 0;
    $scope.phases = [
      'splash',
      'start',
      'game'
    ];
    $scope.phase = $scope.phases[$scope.phaseIndex];

    $scope.setPhase = function (target) {
      var index = $scope.phases.indexOf(target);
      if (index !== -1) {
        $scope.phaseIndex = index;
        $scope.phase = target;
      }

      if (target === 'start') {
        beesInitialization();
        $timeout(function () {
          $scope.nextPhase();
        },1000);
      }
    };

    $scope.nextPhase = function () {
      $scope.phaseIndex++;
      while ($scope.phaseIndex >= $scope.phases.length) {
        $scope.phaseIndex--;
      }
      $scope.setPhase($scope.phases[$scope.phaseIndex]);
    };

    $scope.prevPhase = function () {
      $scope.phaseIndex--;
      while ($scope.phaseIndex <= 0) {
        $scope.phaseIndex++;
      }
      $scope.setPhase($scope.phases[$scope.phaseIndex]);
    };

    // Bees control
    $scope.bees = [];

    function createBee (type) {
      switch (type) {
        case 'queen':
          return {
            'type': type,
            'maxlifespan': 100,
            'lifespan': 100,
            'hitpoints': 8
          };
        case 'worker':
          return {
            'type': type,
            'maxlifespan': 75,
            'lifespan': 75,
            'hitpoints': 10
          };
        case 'drone':
          return {
            'type': type,
            'maxlifespan': 50,
            'lifespan': 50,
            'hitpoints': 12
          };
        default:
          throw new Error('No type of bee specified');
      }
    }

    function beesInitialization () {
      var i;
      $scope.bees = [];
      // 1 Queen Bee
      $scope.bees.push(createBee('queen'));

      // 5 Workers Bees
      for (i = 0; i < 5; i++) {
        $scope.bees.push(createBee('worker'));
      }

      // 5 Workers Bees
      for (i = 0; i < 8; i++) {
        $scope.bees.push(createBee('drone'));
      }
    }

    function getRandomNumber () {
      return Math.floor((Math.random() * $scope.bees.length));
    }

    function hitRandomBee () {
      var random = getRandomNumber();

      if ($scope.bees[random].lifespan > 0) {
        $scope.bees[random].lifespan -= $scope.bees[random].hitpoints;
        if ($scope.bees[random].lifespan < 0) {
          $scope.bees[random].lifespan = 0;
        }
        if ($scope.bees[random].type === 'queen' && $scope.bees[random].lifespan === 0) {
          $scope.setPhase('start');
        }
      } else {
        // if that bee is already dead, get diferent random number
        hitRandomBee();
      }
    }
    $scope.hitRandomBee = hitRandomBee;

  })
  .filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
  });
