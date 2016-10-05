'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('campaign', {
    url: '/campaign',
    template: '<campaign></campaign>'
  });
}
