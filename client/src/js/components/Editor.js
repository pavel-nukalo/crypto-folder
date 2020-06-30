import $ from 'jquery';

import store from '@/js/store';

const render = async () => {
  const component = $(`
    <h6 class="mt-4 font-weight-bold mb-0">
      ${store.getters.getBreadcrumbs()}
    </h6>
    
    <div class="mt-4 mb-4 vh-75 w-100">
      <textarea class="form-control rounded shadow-sm h-100 w-100"></textarea>
    </div>
  `);

  component.find('textarea')
    .val(store.getters.getChild().content)
    .bind('input propertychange', function () {
      store.mutations.setChildContent(this.value);
    });
  
  $('main').html(component); 
};

export default {
  render
};